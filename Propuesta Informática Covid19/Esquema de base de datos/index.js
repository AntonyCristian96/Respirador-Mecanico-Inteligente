const S = require("./schema");
const sequelize = require("./database");

async function main() {
    await sequelize.sync();
    await S.TipoFenomeno.create({ nombre: 'Presion arterial sistolica' });
    await S.TipoFenomeno.create({ nombre: 'Presion arterial diastolica' });
    await S.TipoFenomeno.create({ nombre: 'Frecuencia cardiaca' });
    await S.TipoFenomeno.create({ nombre: 'Frecuencia respiratoria' });
    await S.TipoFenomeno.create({ nombre: 'Temperatura cutanea' });
    await S.TipoFenomeno.create({ nombre: 'Saturacion de oxigeno' });
    await S.TipoFenomeno.create({ nombre: 'Presion parcial de oxigeno arterial' });
}

main();