const conexao = require("../conexao");
const { validarCampos, validarData } = require("./utilitarios");

const listarProdutos = async (req, res) => {
  try {
    const { rows } = await conexao.query("SELECT * FROM produtos");
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro no servidor interno" });
  }
};

const adicionarProduto = async (req, res) => {
  const { produto, descricao } = req.body;

  try {
    if (!validarCampos({ produto, descricao })) {
      return res.status(400).json({ mensagem: "Todos os campos devem ser preenchidos" });
    }
    
    const { rows } = await conexao.query("INSERT INTO produtos (produto, descricao) VALUES ($1, $2) RETURNING *", [produto, descricao]);

    const produtoInserido = rows[0];

    return res.status(201).json(produtoInserido);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: 'Erro interno'} );
  }
};

const deletarProduto = async (req, res) => {
  const { produtoID } = req.body;

  try {
    if (!validarCampos({ produtoID })) {
      return res.status(400).json({ mensagem: "Todos os campos devem ser preenchidos" });
    }
    
    const { rows } = await conexao.query("DELETE FROM produtos WHERE id = $1 RETURNING *", [produtoID]);

    const produtoDeletado = rows[0];

    return res.status(201).json({'Produto deletado': produtoDeletado});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: 'Erro interno'} );
  }
};

const listarTransacao = async (req, res) => {
  try {
    const { id: idUsuarioLogado } = req.usuario;

    const { rows } = await conexao.query("SELECT id, descricaoCompra, valor, data, usuario_id FROM transacoes WHERE usuario_id = $1", [idUsuarioLogado]);

    const resposta = rows.map(row => ({
      id: row.id,
      descricaoCompra: row.descricaoCompra,
      valor: row.valor,
      data: row.data,
    }));

    return res.status(200).json(resposta);
  } catch (error) {
    console.error("Erro ao listar transações:", error);
    res.status(500).json({ mensagem: "Erro no servidor interno ao listar transações" });
  }
};

const cadastrarTransacao = async (req, res) => {
  const { descricaoCompra, valor, data } = req.body;
  const { id: idUsuarioLogado } = req.usuario;

  try {
    if (!validarCampos({ descricaoCompra, valor, data })) {
      return res.status(400).json({ mensagem: "Todos os campos devem ser preenchidos" });
    }
    
    if (!validarData(data)) {
      return res.status(400).json({ mensagem: "Data não está com formato válido" });
    }

    const { rows } = await conexao.query("INSERT INTO transacoes (descricaoCompra, valor, data, usuario_id) VALUES ($1, $2, $3, $4) RETURNING *", [descricaoCompra, valor, data, idUsuarioLogado]);

    return res.status(201).json({
      id: rows[0].id,
      descricaoCompra: rows[0].descricaoCompra,
      valor: rows[0].valor,
      data: rows[0].data,
      usuario_id: idUsuarioLogado,
    });
  } catch (error) {
    console.error("Erro ao cadastrar transação:", error);
    return res.status(500).json({ mensagem: "Erro interno ao cadastrar transação" });
  }
};

const detalharTransacao = async (req, res) => {
  const { id } = req.params;
  const { id: idUsuarioLogado } = req.usuario;
  
  try {
    const { rows, rowCount } = await conexao.query("SELECT id, descricaoCompra, valor, data, usuario_id FROM transacoes WHERE id = $1 AND usuario_id = $2", [id, idUsuarioLogado]);
    
    if (rowCount < 1) {
      return res.status(404).json({ mensagem: "Transacao não encontrada" });
    }
    
    return res.status(200).json({
      id: rows[0].id,
      descricaoCompra: rows[0].descricaoCompra,
      valor: rows[0].valor,
      data: rows[0].data,
      usuario_id: idUsuarioLogado,
    });
  } catch (error) {
    console.error("Erro ao detalhar transação:", error);
    return res.status(500).json({ mensagem: "Erro interno ao detalhar transação" });
  }
};

// const excluirTransacao = async (req, res) => {
//   const { id: idTransacao } = req.params;
//   const { id: idUsuarioLogado } = req.usuario;
//   try {
//     const { rowCount } = await conexao.query("SELECT * FROM transacoes WHERE id = $1 AND usuario_id = $2", [idTransacao, idUsuarioLogado]);

//     if (rowCount < 1) {
//       return res.status(400).json({ mensagem: "Transação informada não encontrada." });
//     }

//     await conexao.query("DELETE FROM transacoes WHERE usuario_id = $1 AND id = $2", [idUsuarioLogado, idTransacao]);

//     return res.status(204).json();
//   } catch (error) {
//     return res.status(500).json({ mensagem: "Erro interno" });
//   }
// };

const atualizarTransacao = async (req, res) => {
  const { id: transacaoId } = req.params;
  const { descricao, valor, data } = req.body;
  const { id: idUsuarioLogado } = req.usuario;
  
  try {
    if (!validarCampos({ descricao, valor, data })) {
      return res.status(400).json({ mensagem: "Todos os campos devem ser preenchidos" });
    }
    
    if (!validarData(data)) {
      return res.status(400).json({ mensagem: "Data não está com formato válido" });
    }
    
    await conexao.query("UPDATE transacoes SET descricaoCompra = $1, valor = $2, data = $3 WHERE id = $4 AND usuario_id = $5;", [descricao, valor, data, transacaoId, idUsuarioLogado]);

    return res.status(204).json();
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
    return res.status(500).json({ mensagem: "Erro interno ao atualizar transação" });
  }
};

module.exports = {
  adicionarProduto,
  deletarProduto,
  listarTransacao,
  cadastrarTransacao,
  excluirTransacao,
  detalharTransacao,
  listarProdutos,
  atualizarTransacao,
};
