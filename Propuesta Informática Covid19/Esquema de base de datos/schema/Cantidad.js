const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

class Cantidad extends Model {}

Cantidad.init({
    id: {
        type: DataTypes.INTEGER({ unsigned: true }),
        primaryKey: true
    },
    unidad: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    montos: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    longitud: {
        type: DataTypes.INTEGER({ unsigned: true }),
        allowNull: false,
        defaultValue: 1
    },
    frecuencia: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'cantidad',
    underscored: true,
    sequelize,
    timestamps: true,
    updatedAt: false
});

module.exports = Cantidad;