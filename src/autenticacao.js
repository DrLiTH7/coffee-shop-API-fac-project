const jwt = require('jsonwebtoken');
const senhaJwt = require('./secreto');
const conexao = require('./conexao')

const verificaLogin = async (req, res, next) => {
    const {authorization} = req.headers;
    if (!authorization) {
        return res.status(403).json({mensagem: 'Nao autorizado'})
    }

    const token = authorization.split(' ')[1]
    try {
        const {id} = jwt.verify(token, senhaJwt)

        const {rows, rowCount} = await conexao.query('SELECT * FROM usuarios WHERE id = $1', [id]);

        if(rowCount === 0) {
            return res.status(401).json({mensagem: 'Usuario informado nao existe'})
        }

        const {senha, ...usuario} = rows[0];
        req.usuario = usuario;
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({mensagem: 'Não autorizado'})
    }
} 

module.exports = verificaLogin