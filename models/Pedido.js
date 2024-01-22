const { DataTypes } = require("sequelize")

const db = require("../db/conn")

const Usuario = require("../models/Usuario")
const Intermediario = require("./Intermediario")

const Pedido = db.define("Pedido",{
    data:{
        type: DataTypes.DATE,
        allowNull:false,
    },
    valor_pedido:{
        type: DataTypes.DECIMAL(10,2),
        allowNull:false,
    },
});

Pedido.belongsTo(Usuario);
Usuario.hasMany(Pedido);

Pedido.belongsTo(Intermediario);
Intermediario.hasMany(Pedido);

module.exports = Pedido;