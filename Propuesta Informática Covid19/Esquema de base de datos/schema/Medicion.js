const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

class Medicion extends Model {}

Medicion.init({
    id: {
        type: DataTypes.INTEGER({ unsigned: true }),
        primaryKey: true
    },
    tipoFenomenoId: {
        type: DataTypes.INTEGER({ unsigned: true }),
        allowNull: false
    }
}, {
    tableName: 'medicion',
    underscored: true,
    sequelize,
    timestamps: true,
    updatedAt: false
});

module.exports = Medicion;