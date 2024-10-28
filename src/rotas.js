const express = require('express');
const rotas = express();
const verificaLogin = require('./autenticacao')
const { cadastrarUsuario, login, logout, atualizarUsuario, detalharUsuario } = require('./controladores/usuario');
const { listarTransacao, cadastrarTransacao, detalharTransacao, listarProdutos, adicionarProduto, deletarProduto, atualizarTransacao } = require('./controladores/transacao');
const { adicionarAvaliacao, listarAvaliacoes,  deleteAvaliacao } = require('./controladores/avaliacao');


rotas.post('/usuario', cadastrarUsuario); // User and Admin
rotas.post('/login', login) // User and admin
rotas.use(verificaLogin);
rotas.get('/logout', logout) // User and Admin
rotas.get('/usuario', detalharUsuario) // User and Admin
rotas.put('/usuario', atualizarUsuario) // User and Admin

rotas.get('/produtos', listarProdutos) // User and Admin
rotas.post('/produtos', adicionarProduto) // Admin
rotas.delete('/produtos', deletarProduto) // Admin

rotas.get('/transacao', listarTransacao) // User and Admin
rotas.get('/transacao/:id', detalharTransacao) // User and Admin
rotas.post('/transacao', cadastrarTransacao) // User and Admin

rotas.put('/transacao/:id', atualizarTransacao) // Admin


rotas.post('/avaliacoes', adicionarAvaliacao); // Adicionar avaliação
rotas.get('/produtos/:produtoID/avaliacoes', listarAvaliacoes); // id_usuario nao esta no corpo??
rotas.delete('/avaliacoes/:avaliacaoID', deleteAvaliacao);




module.exports = rotas