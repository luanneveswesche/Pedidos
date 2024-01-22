const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('pedidos', 'thales', 'info2k21',{
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
})

try{
    sequelize.authenticate()
    console.log('Conectado no BD')
}catch(error){
    console.log('Não foi possível conectar no BD: ',error)
}

module.exports = sequelize