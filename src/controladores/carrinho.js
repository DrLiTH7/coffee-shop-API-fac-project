const conexao = require("../conexao");
const { validarCampos,} = require("./utilitarios");


const adicionarAoCarrinho = async (req, res) => {
  const { produto_id, quantidade } = req.body;
  const { id: usuario_id } = req.usuario;

  try {
      if (!validarCampos({ produto_id, quantidade })) {
          return res.status(400).json({ mensagem: "Todos os campos devem ser preenchidos" });
      }

      // Obter o preço do produto
      const { rows: produtoRows } = await conexao.query(
          "SELECT preco FROM produtos WHERE id = $1",
          [produto_id]
      );

      if (produtoRows.length === 0) {
          return res.status(404).json({ mensagem: "Produto não encontrado" });
      }

      const valor = produtoRows[0].preco;

      // Verifica se o produto já está no carrinho
      const { rowCount } = await conexao.query(
          "SELECT * FROM carrinhos WHERE usuario_id = $1 AND produto_id = $2",
          [usuario_id, produto_id]
      );

      if (rowCount > 0) {
          // Atualiza a quantidade do produto no carrinho
          await conexao.query(
              "UPDATE carrinhos SET quantidade = quantidade + $1 WHERE usuario_id = $2 AND produto_id = $3",
              [quantidade, usuario_id, produto_id]
          );
      } else {
          // Insere o produto no carrinho com o valor
          await conexao.query(
              "INSERT INTO carrinhos (usuario_id, produto_id, quantidade, valor) VALUES ($1, $2, $3, $4)",
              [usuario_id, produto_id, quantidade, valor]
          );
      }

      return res.status(201).json({ mensagem: "Produto adicionado ao carrinho com sucesso" });
  } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error.message);
      return res.status(500).json({ mensagem: "Erro interno ao adicionar ao carrinho" });
  }
};


const listarCarrinho = async (req, res) => {
    const { id: usuario_id } = req.usuario;
  
    try {
      const { rows } = await conexao.query(
        `SELECT c.id, p.produto, p.descricao, c.quantidade 
         FROM carrinhos c 
         JOIN produtos p ON c.produto_id = p.id 
         WHERE c.usuario_id = $1`,
        [usuario_id]
      );
  
      return res.status(200).json(rows);
    } catch (error) {
      console.error("Erro ao listar carrinho:", error);
      console.error(error.stack);
      return res.status(500).json({ mensagem: "Erro interno ao listar o carrinho" });
    }
  };

const removerDoCarrinho = async (req, res) => {
    const { id: usuario_id } = req.usuario;
    const { produto_id } = req.body;
  
    try {
      await conexao.query(
        "DELETE FROM carrinhos WHERE usuario_id = $1 AND produto_id = $2",
        [usuario_id, produto_id]
      );
  
      return res.status(200).json({ mensagem: "Produto removido do carrinho com sucesso" });
    } catch (error) {
      console.error("Erro ao remover do carrinho:", error);
      return res.status(500).json({ mensagem: "Erro interno ao remover do carrinho" });
    }
  };

module.exports = {
  
    adicionarAoCarrinho,  
    listarCarrinho,
    removerDoCarrinho,
  };