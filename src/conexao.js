const {Pool} = require('pg');
const conexao = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'coffeemuchobom'
})

module.exports = conexao