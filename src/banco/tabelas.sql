CREATE DATABASE coffeemuchobom;

CREATE TABLE usuarios (
    id serial primary key,
    nome varchar(100) not null,
    telefone varchar(15),
    email varchar(100) unique not null,
    rua varchar(100),
    numero_casa varchar(10),
    bairro varchar(100),
    cidade varchar(100),
    estado varchar(2),
    cep varchar(10),
    complemento varchar(100),
    senha text not null
);


CREATE TABLE produtos (
	id serial primary key,
  produto text,
  valor integer,
  descricao text
);


CREATE TABLE transacoes (
  id serial primary key,
  descricaoCompra text,
  valor integer,
  data timestamp,
  usuario_id integer references usuarios(id)
);

CREATE TABLE avaliacoes (
  id SERIAL PRIMARY KEY,
  produto_id INT NOT NULL REFERENCES produtos(id),
  usuario_id INT NOT NULL,  -- Id do usuário que está fazendo a avaliação
  nota INT CHECK (nota >= 1 AND nota <= 5),  -- Avaliação de 1 a 5
  comentario TEXT,
  data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE carrinhos (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES usuarios(id), -- Relacionado ao usuário
  produto_id INT NOT NULL REFERENCES produtos(id), -- Relacionado ao produto
  quantidade INT NOT NULL DEFAULT 1, -- Quantidade do produto no carrinho
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Data de inserção
);
