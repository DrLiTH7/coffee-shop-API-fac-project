const conexao = require("../conexao");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const senhaJwt = require("../secreto");
const { validarCampos } = require("./utilitarios");
const enviarEmail = require("../emailService")

const cadastrarUsuario = async (req, res) => {
  console.log(req)
  const { 
    nome, 
    telefone, 
    email, 
    rua, 
    numero_casa, 
    bairro, 
    cidade, 
    estado, 
    cep, 
    complemento, 
    senha 
  } = req.body;

  try {
    if (!nome || !email || !senha) {
      return res.status(400).json({ mensagem: "Os campos nome, email e senha são obrigatórios." });
    }

    const verificarEmail = await conexao.query("SELECT * FROM usuarios WHERE email = $1", [email]);

    if (verificarEmail.rowCount > 0) {
      return res.status(401).json({ mensagem: "Já existe usuário cadastrado com o e-mail informado." });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const query = `
      INSERT INTO usuarios (
        nome, telefone, email, rua, numero_casa, bairro, cidade, estado, cep, complemento, senha
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id, nome, telefone, email, rua, numero_casa, bairro, cidade, estado, cep, complemento
    `;

    const valores = [
      nome, 
      telefone, 
      email, 
      rua, 
      numero_casa, 
      bairro, 
      cidade, 
      estado, 
      cep, 
      complemento, 
      senhaCriptografada
    ];

    const { rows } = await conexao.query(query, valores);

    const usuario = rows[0];

    enviarEmail(
      email,"Bem vindo à Cafeteria Gostinho de Café", 
      `
      Bem vindo, ${nome}!

      Ficamos felizes com você aqui, que tal um café para aquecer a alma?
      Sinta-se à vontade!

      Equipe Gostinho de Café
      `
    )

    return res.status(201).json(usuario);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro interno no servidor." });
  }
};


const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!validarCampos({ email, senha })) {
    return res.status(400).json({ mensagem: "Todos os campos devem ser preenchidos" });
  }

  try {
    const { rows, rowCount } = await conexao.query( "SELECT * FROM usuarios WHERE email = $1",[email] );
    if (rowCount === 0) {
      return res.status(400).json({ mensagem: `Usuário inválido.` });
    }

    const { senha: senhaUsuario, ...usuario } = rows[0];

    const validarSenha = await bcrypt.compare(senha, senhaUsuario);

    if (!validarSenha) {
      return res.status(401).json({ mensagem: "Usuário ou senha incorretos" });
    }

    const token = jwt.sign({ id: usuario.id }, senhaJwt, { expiresIn: "2h" });

    return res.status(200).json({usuario,token});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const detalharUsuario = async (req, res) => {
  try {
    return res.status(200).json(req.usuario);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado." });
  }
};

const atualizarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    if (!validarCampos({ nome, email, senha })) {
      return res.status(400).json({ mensagem: "Todos os campos devem ser preenchidos" });
    }

    const { rowCount: emailExiste } = conexao.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    if (emailExiste > 0) {
      return res.status(400).json({ mensagem: "Este e-mail já está cadastrado." });
    }

    const senhaEncriptada = await bcrypt.hash(senha, 10);
    await conexao.query(
      "UPDATE usuarios set nome = $1, email = $2, senha = $3 WHERE id = $4",
      [nome, email, senhaEncriptada, req.usuario.id]
    );

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno" });
  }
};

let tokensInvalidos = [];
const logout = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ mensagem: "Token de autenticação não fornecido" });
  }

  try {
    if (tokensInvalidos.includes(token)) {
      return res.status(401).json({ mensagem: "Token já está inválido" });
    }

    tokensInvalidos.push(token);

    return res.status(200).json({ mensagem: "Logout realizado com sucesso" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};


module.exports = {
  cadastrarUsuario,
  login,
  detalharUsuario,
  atualizarUsuario,
  logout
};
