CREATE TABLE aluno (
    id_aluno SERIAL PRIMARY KEY,
    user_id VARCHAR(30) UNIQUE,
    ra VARCHAR(13) UNIQUE,
    nome VARCHAR(255),
    email VARCHAR(255),
    curso VARCHAR(255),
    periodo VARCHAR(20),
    email_inst_verif BOOLEAN DEFAULT FALSE
);



CREATE TABLE professor (
    id_professor SERIAL PRIMARY KEY,
    user_id VARCHAR(30) UNIQUE,
    nome VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    email_inst_verif BOOLEAN DEFAULT FALSE
);



CREATE TABLE trabalho (
    id_trabalho SERIAL PRIMARY KEY,
    titulo VARCHAR(255),
    descricao TEXT,
    nota_final NUMERIC(3, 1) 
);



CREATE TABLE banca (
    id_banca SERIAL PRIMARY KEY,
    id_trabalho INT REFERENCES trabalho(id_trabalho),
    data_hora TIMESTAMP UNIQUE
);



CREATE TABLE cargo_professor (
    id_cargo_prof SERIAL PRIMARY KEY,
    id_professor INT REFERENCES professor(id_professor),
    cargo VARCHAR(255)
);



CREATE TABLE dia_aula (
    id_dia_aula SERIAL PRIMARY KEY,
    id_professor INT REFERENCES professor(id_professor),
    dia_semana INT
);



CREATE TABLE trabalho_aluno (
    id_trab_aluno SERIAL PRIMARY KEY,
    id_aluno INT REFERENCES aluno(id_aluno),
    id_trabalho INT REFERENCES trabalho(id_trabalho)
);



CREATE TABLE horario_aula (
    id_horario_aula SERIAL PRIMARY KEY,
    id_professor INT REFERENCES professor(id_professor),
    id_dia_aula INT REFERENCES dia_aula(id_dia_aula),
    entrada TIME,
    saida TIME
);



CREATE TABLE trabalho_professor (
    id_trab_prof SERIAL PRIMARY KEY,
    id_cargo_prof INT REFERENCES cargo_professor(id_cargo_prof),
    id_trabalho INT REFERENCES trabalho(id_trabalho)
);



CREATE TABLE avaliacao (
    id_avaliacao SERIAL PRIMARY KEY,
    id_trabalho INT REFERENCES trabalho(id_trabalho),
    id_cargo_prof INT REFERENCES cargo_professor(id_cargo_prof),
    valor NUMERIC(3, 1),
    comentario TEXT
);



CREATE TABLE banca_professor (
    id_banca_prof SERIAL PRIMARY KEY,
    id_cargo_prof INT REFERENCES cargo_professor(id_cargo_prof),
    id_banca INT REFERENCES banca(id_banca)
);



CREATE TABLE certificado (
    id_certificado SERIAL PRIMARY KEY,
    id_cargo_prof INT REFERENCES cargo_professor(id_cargo_prof),
    id_banca INT REFERENCES banca(id_banca),
    data_hora_emissao TIMESTAMP,
    comentario TEXT
);


-- ALTER TABLE aluno
-- DROP COLUMN tipoUsuario;
-- ALTER TABLE aluno
-- DROP COLUMN senha;
-- ALTER TABLE aluno
-- ADD user_id VARCHAR(30) UNIQUE;
-- ALTER TABLE aluno
-- ADD email_inst_verif BOOLEAN DEFAULT FALSE;