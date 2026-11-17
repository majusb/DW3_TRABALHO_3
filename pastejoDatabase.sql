-- Banco de dados: pastejo  (DW3 - Trabalho 3 - Pastejo Rotacionado)
-- 1) Crie o banco:        CREATE DATABASE pastejo;
-- 2) Conecte nele e rode este script.
-- Ordem das tabelas importa por causa das chaves estrangeiras:
--   usuarios, animal, pasto, piquete, alocado

-- ======================= LOGIN (obrigatória, NÃO conta nas 4 tabelas) =======================
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

-- ======================= ANIMAL (Yasmim) =======================
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

-- ======================= PASTO e PIQUETE (Maria Julia) =======================
-- Crie as tabelas pasto e piquete AQUI, ANTES de alocado (alocado tem FK para piquete).
-- Modelo sugerido conforme o DER do trabalho:
--
-- CREATE TABLE IF NOT EXISTS pasto (
--     pastoid BIGSERIAL,
--     descricao VARCHAR(100),
--     areatotal NUMERIC(10,2),
--     removido BOOLEAN DEFAULT false,
--     CONSTRAINT pk_pasto PRIMARY KEY (pastoid)
-- );
--
-- CREATE TABLE IF NOT EXISTS piquete (
--     piqueteid BIGSERIAL,
--     descricao VARCHAR(100),
--     latitude NUMERIC(10,6),
--     longitude NUMERIC(10,6),
--     pastoidfk BIGINT,
--     removido BOOLEAN DEFAULT false,
--     CONSTRAINT pk_piquete PRIMARY KEY (piqueteid),
--     CONSTRAINT fk_pasto FOREIGN KEY (pastoidfk) REFERENCES pasto(pastoid)
-- );

-- ======================= ALOCADO (Yasmim) - N:N entre animal e piquete =======================
CREATE TABLE IF NOT EXISTS alocado (
    alocadoid BIGSERIAL,
    animalidifk BIGINT,
    piqueteidfk BIGINT,
    datainicio DATE,
    datafinal DATE,
    removido BOOLEAN DEFAULT false,
    CONSTRAINT pk_alocado PRIMARY KEY (alocadoid),
    CONSTRAINT fk_animal FOREIGN KEY (animalidifk) REFERENCES animal(animalid)
    -- Maria Julia: descomente a linha abaixo depois de criar a tabela piquete
    -- , CONSTRAINT fk_piquete FOREIGN KEY (piqueteidfk) REFERENCES piquete(piqueteid)
);
