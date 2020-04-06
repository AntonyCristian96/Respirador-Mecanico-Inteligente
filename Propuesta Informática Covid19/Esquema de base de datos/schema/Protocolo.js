const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

class Protocolo extends Model {}

Protocolo.init({
    id: {
        type: DataTypes.INTEGER({ unsigned: true }),
        primaryKey: true,
        autoIncrement: true
    },
    dispositivo: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    margenDeError: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    tableName: 'protocolo',
    underscored: true,
    sequelize,
    timestamps: true,
    updatedAt: false,
    initialAutoIncrement: '1'
});

module.exports = Protocolo;