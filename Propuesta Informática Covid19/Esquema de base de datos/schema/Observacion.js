const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

class Observacion extends Model {}

Observacion.init({
    id: {
        type: DataTypes.INTEGER({ unsigned: true }),
        primaryKey: true,
        autoIncrement: true
    },
    tipoObservacion: {
        type: DataTypes.STRING, // medicion | categoria
        allowNull: false
    },
    fechaObservacion: {
        type: DataTypes.DATE,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    },
    protocoloId: {
        type: DataTypes.INTEGER({ unsigned: true })
    },
    personaId: {
        type: DataTypes.INTEGER({ unsigned: true })
    }
}, {
    tableName: 'observacion',
    underscored: true,
    sequelize,
    timestamps: true,
    updatedAt: false,
    initialAutoIncrement: '1'
});

module.exports = Observacion;