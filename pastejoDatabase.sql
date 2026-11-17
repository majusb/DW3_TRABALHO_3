-- Banco de dados: pastejo  (DW3 - Trabalho 3 - Pastejo Rotacionado)
-- 1) Crie o banco:  CREATE DATABASE pastejo;
-- 2) Conecte nele e rode este script.

-- Tabela de login (obrigatória, não conta nas 4 tabelas)
CREATE TABLE IF NOT EXISTS usuarios (
    usuarioId BIGSERIAL,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    deleted BOOLEAN DEFAULT false,
    CONSTRAINT pk_usuarios PRIMARY KEY (usuarioId)
);

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- usuário de teste: login girl / senha girl
INSERT INTO usuarios (usuarioId, username, password)
VALUES (default, 'girl', crypt('girl', gen_salt('bf')))
ON CONFLICT DO NOTHING;

-- Animal
CREATE TABLE IF NOT EXISTS animal (
    animalid BIGSERIAL,
    nome VARCHAR(100),
    datanasc DATE,
    removido BOOLEAN DEFAULT false,
    CONSTRAINT pk_animal PRIMARY KEY (animalid)
);

INSERT INTO animal (nome, datanasc) VALUES
('Mimosa', '2022-03-15'),
('Estrela', '2021-08-02');

-- Alocado (N:N entre animal e piquete)
CREATE TABLE IF NOT EXISTS alocado (
    alocadoid BIGSERIAL,
    animalidifk BIGINT,
    piqueteidfk BIGINT,
    datainicio DATE,
    datafinal DATE,
    removido BOOLEAN DEFAULT false,
    CONSTRAINT pk_alocado PRIMARY KEY (alocadoid),
    CONSTRAINT fk_animal FOREIGN KEY (animalidifk) REFERENCES animal(animalid)
);
