const { DataTypes } = require("sequelize")

const db = require("../db/conn")

const Intermediario = db.define("Intermediario",{
    nome:{
        type: DataTypes.STRING,
        allowNull:false,
    },

    cidade:{
        type: DataTypes.STRING,
        allowNull:true,
    },
    uf:{
        type: DataTypes.STRING(2),
        allowNull:true,
    },
    email:{
        type: DataTypes.STRING,
        allowNull:true,
    },
    telefone:{
        type: DataTypes.STRING,
        allowNull: true,
    }
});

module.exports = Intermediario;
