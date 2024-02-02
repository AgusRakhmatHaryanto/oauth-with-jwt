const Sequelize = require('sequelize')
const config = require('../config/config.json')

const { username, password, database, host, dialect } = config.development

const sequelize = new Sequelize(database, username, password,{
    host: host,
    dialect: dialect
})

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.')
    console.log(`Database: ${database} - dialect: ${dialect}`);
}).catch((error) => {
    console.error('Unable to connect to the database:', error);
})