const express = require('express');
const app = express();
const rotas = require('./rotas')
const verificaLogin = require('./autenticacao')

app.use(express.json())
app.get('/', (req, res) => {
    res.send(new Date())
})
app.use(rotas)
rotas.use(verificaLogin)
app.listen(3060)