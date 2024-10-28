CREATE DATABASE coffeemuchobom;

CREATE TABLE usuarios (
  id serial primary key,
  nome text,
  email text unique,
  senha text
);

CREATE TABLE produtos (
	id serial primary key,
  produto, text,
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


