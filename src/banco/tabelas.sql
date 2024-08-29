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

