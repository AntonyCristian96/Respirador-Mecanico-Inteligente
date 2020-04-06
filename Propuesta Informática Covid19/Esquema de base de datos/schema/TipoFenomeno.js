const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

class TipoFenomeno extends Model {}

// Lo que podemos observar
// Las unidades son independientes al tipo de fenomeno

TipoFenomeno.init({
    id: {
        type: DataTypes.INTEGER({ unsigned: true }),
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        unique: true
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'tipo_fenomeno',
    underscored: true,
    sequelize,
    timestamps: true,
    updatedAt: false,
    initialAutoIncrement: '1'
});

module.exports = TipoFenomeno;