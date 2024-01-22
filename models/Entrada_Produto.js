const { DataTypes } = require("sequelize")

const db = require("../db/conn")

const Entrada_Produto = db.define("Entrada_Produto", {
    produto: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    peso: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
    },
    data: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Entrada_Produto