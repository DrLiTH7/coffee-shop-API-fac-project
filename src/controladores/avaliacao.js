const conexao = require("../conexao");
const { validarCampos,} = require("./utilitarios");

const adicionarAvaliacao = async (req, res) => {
  const { produtoID, nota, comentario } = req.body;
  const { id: usuarioID } = req.usuario;

  try {
    if (!validarCampos({ produtoID, nota })) {
      return res.status(400).json({ mensagem: "Produto, nota e usuário são obrigatórios" });
    }

    if (nota < 1 || nota > 5) {
      return res.status(400).json({ mensagem: "A nota deve estar entre 1 e 5" });
    }

    const { rows } = await conexao.query(
      "INSERT INTO avaliacoes (produto_id, usuario_id, nota, comentario) VALUES ($1, $2, $3, $4) RETURNING *",
      [produtoID, usuarioID, nota, comentario]
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Erro ao adicionar avaliação:", error);
    return res.status(500).json({ mensagem: "Erro interno ao adicionar avaliação" });
  }
};

const listarAvaliacoes = async (req, res) => {
  const { produtoID } = req.params;

  try {
    const { rows } = await conexao.query(
      "SELECT a.id,a.usuario_id, a.nota, a.comentario, a.data_avaliacao, p.produto FROM avaliacoes a JOIN produtos p ON a.produto_id = p.id WHERE p.id = $1",
      [produtoID]
    );

    if (rows.length === 0) {
      return res.status(404).json({ mensagem: "Nenhuma avaliação encontrada para este produto" });
    }

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Erro ao listar avaliações:", error);
    return res.status(500).json({ mensagem: "Erro interno ao listar avaliações" });
  }
};

const deleteAvaliacao = async (req, res) => {
  const { avaliacaoID } = req.params;
  const { id: usuarioID } = req.usuario; // Supondo que o usuário está autenticado e o ID está no token.

  try {
    // Verificar se a avaliação existe e se pertence ao usuário autenticado
    const { rows: avaliacao } = await conexao.query(
      "SELECT * FROM avaliacoes WHERE id = $1 AND usuario_id = $2",
      [avaliacaoID, usuarioID]
    );

    if (avaliacao.length === 0) {
      return res.status(404).json({ mensagem: "Avaliação não encontrada ou você não tem permissão para excluí-la." });
    }

    // Excluir a avaliação
    await conexao.query("DELETE FROM avaliacoes WHERE id = $1", [avaliacaoID]);

    return res.status(200).json({ mensagem: "Avaliação excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir avaliação:", error);
    return res.status(500).json({ mensagem: "Erro interno ao excluir avaliação" });
  }
};


module.exports = {
  
  adicionarAvaliacao,  
  listarAvaliacoes,
  deleteAvaliacao,
};