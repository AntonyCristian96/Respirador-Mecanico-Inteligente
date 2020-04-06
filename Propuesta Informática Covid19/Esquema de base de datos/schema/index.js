const Persona = require("./Persona");
const Cantidad = require("./Cantidad");
const CategoriaObservacion = require("./CategoriaObservacion");
const Fenomeno = require("./Fenomeno");
const Medicion = require("./Medicion");
const Observacion = require("./Observacion");
const Protocolo = require("./Protocolo");
const TipoFenomeno = require("./TipoFenomeno");

Persona.hasMany(Observacion, { foreignKey: { name: 'personaId' }});

Cantidad.belongsTo(Medicion, { foreignKey: { name: 'id' }});

Protocolo.hasMany(Observacion, { foreignKey: { name: 'protocoloId' }});

Observacion.belongsTo(Protocolo, { foreignKey: { name: 'protocoloId' }});
Observacion.belongsTo(Persona, { foreignKey: { name: 'personaId' }});
Observacion.hasOne(Medicion, { foreignKey: { name: 'id' }});
Observacion.hasOne(CategoriaObservacion, { foreignKey: { name: 'id' }});

TipoFenomeno.hasMany(Fenomeno, { foreignKey: { name: 'tipoFenomenoId' }});
TipoFenomeno.hasMany(Medicion, { foreignKey: { name: 'tipoFenomenoId' }});

Fenomeno.hasMany(CategoriaObservacion, { foreignKey: { name: 'fenomenoId' }});
Fenomeno.belongsTo(TipoFenomeno, { foreignKey: { name: 'tipoFenomenoId' }});

Medicion.hasOne(Cantidad, { foreignKey: { name: 'id' }});
Medicion.belongsTo(TipoFenomeno, { foreignKey: { name: 'tipoFenomenoId' }});
Medicion.belongsTo(Observacion, { foreignKey: { name: 'id' }});

CategoriaObservacion.belongsTo(Fenomeno, { foreignKey: { name: 'fenomenoId' }});
CategoriaObservacion.belongsTo(Observacion, { foreignKey: { name: 'id' }});

module.exports = {
    Persona,
    Cantidad,
    CategoriaObservacion,
    Fenomeno,
    Medicion,
    Observacion,
    Protocolo,
    TipoFenomeno
};