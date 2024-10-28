const {Pool} = require('pg');
const conexao = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'admin',
    database: 'coffeemuchobom'
})

module.exports = conexao