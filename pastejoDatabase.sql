-- Tabela de login
CREATE TABLE IF NOT EXISTS usuarios (
    usuarioId BIGSERIAL,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    deleted BOOLEAN DEFAULT false,
    CONSTRAINT pk_usuarios PRIMARY KEY (usuarioId)
);

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- usuário de teste
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

-- Inserção animal
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

-- Pasto
CREATE TABLE IF NOT EXISTS pasto(
    pastoid BIGSERIAL,
    nomePasto VARCHAR(100),
    areatotal REAL
    removido BOOLEAN DEFAULT false
    CONSTRAINT pk_pastoid PRIMARY KEY (pastoid)
)

-- Inserção em pasto
INSERT INTO pasto (nomePasto, areatotal) VALUES ('Pasto A', 1000.0),
                                                ('Pasto B', 50.0);
