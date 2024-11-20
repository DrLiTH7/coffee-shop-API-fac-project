CREATE DATABASE coffeemuchobom;

CREATE TABLE usuario (
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

