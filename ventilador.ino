/********************************************************
Descripción:
  El presente proyecto es una implementación didactica sobre el uso
  del metodo de control de posición por PID en un motor DC, usando encoder incremental. 
CONEXIÓN::::::::::::::::::::::::::
> ENCODER: (5V) 100PPR
  360grados = 400 pulsos
  0.9 grados / Pulso
  For better signal, we used a NOT TTL7404, for every channel.
  Remember that the output signal is 3.3V for the TTL microchip, and that is good for the ESP8266.
> ESP8266: (5V USB) [Warning I/O 3.3v, doesn't matter if the USB is 5V]
  D1  = Channel A
  D2  = Channel B
  D8  = IN1 --L298N
  D7  = IN2 --L298N
  D6 = PWM --L298N [10bit resolution ESP8266]
> L298N (5v & 19v)
  IN1
  IN2
  In PWM 
***************************************************************************************************/
#include <PID_v1.h>
#include <TimerOne.h>  //timers only for ESP8266
/*------------------------------Variebles-------------------------------*/
int presion=A0;
int presionValue=0;
int peso=0;
float d=1.225;//densidad del aire
float g=9.81;//gravedad
float h=0;
float p=0;
int temperatura=A1;
int temp=0;
float t=0;
float A=0.00309579817057;//metros cuadrados
float Vt=0;//volumen tidal en litros
float Vti=0;//volumen tidal ideal en litros
float BPM=0;//bombeo por minuto
int norespira=9;
int sobrepresion=10;
int ledverde=11;
int ledamarilla=12;
int ledroja=13;
int IN1  = 8; 
int IN2  = 7;
int PWM1 = 6;
int forWARDS  = 1; 
int backWARDS = 0;
float start   = 0;

/*------------------------------Variables for incremental encoder----------------------------------*/
volatile long contador =  0;   
byte          ant      =  0;    
byte          act      =  0;
const byte    encA     =  1;                  // Signal for channel A
const byte    encB     =  2;                  // Signal for channel B
int   MIN_MAX_POST     =  300;                 // Limit the maximun position
/*-----------------------------We defined variables for PID algorithm------------------------------*/
//Ticker PID_compute;                         // Timer
double Setpoint, Input, Output;
float angulo;
double SampleTime = 1;                      // time in mili seconds, RUN at 160MHZ ESP8266
//double Kp=5, Ki=2, Kd=0.001; 
//double Kp=5.5, Ki=3.6, Kd=0.002;
double Kp=5.5, Ki=4.0, Kd=0.002;              // PID gain
PID myPID(&Input, &Output, &Setpoint, Kp, Ki, Kd, DIRECT);

/*----------------------------- Interruption Function----------------------------------------------*/ 
void flash(){
  //Serial.print("t: ");Serial.println(millis()-start)   ;
  //start = millis();
  myPID.Compute();  // Calculus for PID algorithm 
  RunMotor(Output); // PWM order to DC driver
}

/*----------------------------SETUP----------------------------------------------------------------*/
void setup(){ 
  Serial.begin(9600); 
  //Iniciando L298N
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  analogWrite(PWM1, LOW);
  digitalWrite(norespira, LOW);
  digitalWrite(sobrepresion, LOW);
  digitalWrite(ledverde, LOW);
  digitalWrite(ledamarilla, LOW);
  digitalWrite(ledroja, LOW);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(PWM1, OUTPUT);
  pinMode(norespira, OUTPUT);
  pinMode(sobrepresion, OUTPUT);
  pinMode(ledverde, OUTPUT);
  pinMode(ledamarilla, OUTPUT);
  pinMode(ledroja, OUTPUT);
  pinMode(presion,INPUT);
  pinMode(temperatura,INPUT);
   
  Setpoint = 0.0; // Init in position 0.0 
  //RUN the PID
  myPID.SetMode(AUTOMATIC);
  // Max Min values for PID algorithm
  myPID.SetOutputLimits(-1023,1023); 
  // Sample Time for PID
  myPID.SetSampleTime(SampleTime);     

  // Initializing Interruptions
  Timer1.initialize(2000);
  Timer1.attachInterrupt(flash);

  // Pin Interruption
  attachInterrupt(digitalPinToInterrupt(encA), encoder, CHANGE); // rising and falling flank
  attachInterrupt(digitalPinToInterrupt(encB), encoder, CHANGE); // rising and falling flank
}

/*----------------------------LOOP----------------------------------------------------------------*/
void loop(){  
  // Protection code
  //limit_post();
  // Ask for input data for change PID gain or setpoint
  Serial.print("Ingrese el peso del paciente: ");Serial.println(Setpoint);
  input_data();
  Serial.print("PWM  :");Serial.print(Output); 
  Serial.print(" |  contador  :");Serial.print(contador);
  Serial.print(" |  Setpoint  :");Serial.println(Setpoint);
  
}
/*------------------------------------------------------------------------------------------------*/

// Function for run the motor, backward, forward or stop
void RunMotor(double Usignal){  
  if (Setpoint-Input==0){
    shaftrev(IN1,IN2,PWM1,backWARDS, 0);
    //Serial.print("cero");
  }else if(Usignal>=0){
    shaftrev(IN1,IN2,PWM1,backWARDS, Usignal);
  }else{
      shaftrev(IN1,IN2,PWM1,forWARDS, -1*Usignal);
  }   
}

// Function that set DC_driver to move the motor
void shaftrev(int in1, int in2, int PWM, int sentido,int Wpulse){  
  if(sentido == 0){ //backWARDS
    digitalWrite(in2, HIGH);
    digitalWrite(in1, LOW);
    analogWrite(PWM,Wpulse);
    }
  if(sentido == 1){ //forWARDS
    digitalWrite(in2, LOW);
    digitalWrite(in1, HIGH);
    analogWrite(PWM,Wpulse);     
    }
}

// Data catched from serial terminal
void input_data(void){
  if (Serial.available() > 0){           // Check if you have received any data through the serial terminal.
      peso=Serial.read();
      presionValue=analogRead(presion);
      p=map(presionValue,0,1023,-2000,2000);
      temp=analogRead(temperatura);
      t=((temp*5000)/1023)/10;
      h=p/(g*d);
      Vt=A*h*1000;
      Vti=8*p/1000;
      BPM=(Vti-Vt)/0.75;
      Setpoint=0;
      if (p <-2000){
        Serial.print("No respira el paciente");
        digitalWrite(norespira, HIGH);
        delay(3000);
      }
      else if(-2000<=p<=2000){
        BPM=p*5;//cambiar el 5
        if (5<=BPM<17.5){
          angulo=(pow(BPM,2))*(-2)/75+32*BPM/15;
          Setpoint=angulo/0.9;// ENCODER: (5V) 100PPR 360grados = 400 pulsos
          digitalWrite(ledverde, HIGH);
          //Serial.write(Setpoint);
          Setpoint=0;
          //Serial.write(Setpoint);    
        }
        else if (17.5<=BPM<24.8){
          angulo=(pow(BPM,2))*(-2)/75+32*BPM/15;
          Setpoint=angulo/0.9;
          digitalWrite(ledamarilla, HIGH);
         // Serial.write(Setpoint);
          Setpoint=0;
          //Serial.write(Setpoint);
        }
        else if(24.8<=BPM<=30){
          angulo=(pow(BPM,2))*(-2)/75+32*BPM/15;
          Setpoint=angulo/0.9;
          digitalWrite(ledroja, HIGH);
          //Serial.write(Setpoint);
          Setpoint=0;
          //Serial.write(Setpoint);
          }
        }
      else {Serial.print("Sobrepresión");
        digitalWrite(sobrepresion, HIGH);
        delay(3000);
    }
  }
}

// Print date in serial terminal
//void imprimir(byte flag){ 

  //if ((flag == 1) || (flag == 3))
  //{
 //   Serial.print("KP=");     Serial.print(Kp);
 //   Serial.print(" KI=");    Serial.print(Ki);
 //   Serial.print(" KD=");    Serial.print(Kd);
 //   Serial.print(" Time=");  Serial.println(SampleTime);
 // }
 // if ((flag == 2) || (flag == 3))
  //{
  //  Serial.print("Position:");
  //  Serial.println((long)Setpoint);
//  }
//}

// Encoder x4. Execute when interruption pin jumps.
void encoder(void){ 
  //Serial.println(ant);
  ant=act;                            // Saved act (current read) in ant (last read)
  act = digitalRead(encA)<<1|digitalRead(encB);
  if(ant==0 && act==1)        contador++;  // Increase the counter for forward movement
  else if(ant==1  && act==3)  contador++;
  else if(ant==3  && act==2)  contador++;
  else if(ant==2  && act==0)  contador++;
  else contador--;                         // Reduce the counter for backward movement

  // Enter the counter as input for PID algorith
  Input=contador;
}

void limit_post(void){
  // Protection code for limit the position
  if(contador>=MIN_MAX_POST){
     RunMotor(0);
  }else if(contador<=-MIN_MAX_POST){
     RunMotor(0);
  }
}
