const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

class Persona extends Model {}

Persona.init({
    id: {
        type: DataTypes.INTEGER({ unsigned: true }),
        primaryKey: true
    }
    //...
}, {
    tableName: 'persona',
    underscored: true,
    sequelize,
    timestamps: true,
    updatedAt: false
});

module.exports = Persona;