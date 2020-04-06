const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

class CategoriaObservacion extends Model {}

CategoriaObservacion.init({
    id: {
        type: DataTypes.INTEGER({ unsigned: true }),
        primaryKey: true
    },
    fenomenoId: {
        type: DataTypes.INTEGER({ unsigned: true }),
        allowNull: false
    },
    presente: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    tableName: 'categoria_observacion',
    underscored: true,
    sequelize,
    timestamps: true,
    updatedAt: false
});

module.exports = CategoriaObservacion;