const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

class Fenomeno extends Model {}

// Los fenomenos son el conjunto de valores discretos que puede tomar la observacion
Fenomeno.init({
    id: {
        type: DataTypes.INTEGER({ unsigned: true }),
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    },
    tipoFenomenoId:{
        type: DataTypes.INTEGER({ unsigned: true }),
        allowNull: false
    }/*,
    fenomenoId: {
        type: DataTypes.INTEGER({ unsigned: true })
    }*/
}, {
    tableName: 'fenomeno',
    underscored: true,
    sequelize,
    timestamps: true,
    updatedAt: false,
    initialAutoIncrement: '1'
});

module.exports = Fenomeno;