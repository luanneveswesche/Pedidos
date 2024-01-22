const { DataTypes } = require("sequelize")

const db = require("../db/conn")

const Produto = db.define("Produto",{
    nome:{
        type: DataTypes.STRING,
        allowNull :false,
    },
    valor_unitario:{
        type: DataTypes.DECIMAL(10,2),
        allowNull:false,
    }
}
);


module.exports = Produto;