const { DataTypes } = require("sequelize")

const db = require("../db/conn")

const Pedido = require("../models/Pedido")
const Produto = require("../models/Produto")

const Pedido_Detalhe = db.define("Pedido_Detalhe",{
    quantidade: {
        type: DataTypes.DECIMAL(10,2),
        allowNull:false,
    },
    valor_unitario: {
        type: DataTypes.DECIMAL(10,2),
        allowNull:false,
    },    
});

Pedido_Detalhe.belongsTo(Pedido)
Pedido.hasMany(Pedido_Detalhe)

Pedido_Detalhe.belongsTo(Produto)
Produto.hasMany(Pedido_Detalhe)

module.exports = Pedido_Detalhe