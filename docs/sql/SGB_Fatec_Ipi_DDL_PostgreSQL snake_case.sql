CREATE TABLE aluno (
    id_aluno SERIAL PRIMARY KEY,
    user_id VARCHAR(30) UNIQUE,
    ra VARCHAR(13) UNIQUE,
    nome VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    curso VARCHAR(255),
    periodo VARCHAR(20),
    email_inst_verif BOOLEAN DEFAULT FALSE,
    codigo VARCHAR(40),
    tipo_usuario INT DEFAULT 1,
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE professor (
    id_professor SERIAL PRIMARY KEY,
    user_id VARCHAR(30) UNIQUE,
    nome VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    email_inst_verif BOOLEAN DEFAULT FALSE,
    coordenador BOOLEAN DEFAULT FALSE,
    codigo VARCHAR(40),
    tipo_usuario INT DEFAULT 2,
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE tema (
    id_tema SERIAL PRIMARY KEY,
    id_autor INT REFERENCES aluno(id_aluno),
    titulo VARCHAR(255),
    descricao TEXT,
    data_cadastro TIMESTAMP,
    disponivel BOOLEAN DEFAULT TRUE
)

CREATE TABLE dia_aula (
    id_dia_aula SERIAL PRIMARY KEY,
    id_professor INT REFERENCES professor(id_professor),
    dia_semana INT
);

CREATE TABLE horario_aula (
    id_horario_aula SERIAL PRIMARY KEY,
    id_professor INT REFERENCES professor(id_professor),
    id_dia_aula INT REFERENCES dia_aula(id_dia_aula),
    entrada TIME,
    saida TIME
);

CREATE TABLE trabalho (
    id_trabalho SERIAL PRIMARY KEY,
    id_orientador INT REFERENCES professor(id_professor),
    id_tema INT REFERENCES tema(id_tema),
    nota_final NUMERIC(3, 1),
    previsao_defesa CHAR(7),
    banca_agendada BOOLEAN DEFAULT FALSE
);

CREATE TABLE banca (
    id_banca SERIAL PRIMARY KEY,
    id_trabalho INT REFERENCES trabalho(id_trabalho),
    data_hora TIMESTAMP UNIQUE,
    comentarios TEXT,
    foi_avaliada BOOLEAN DEFAULT FALSE
);

CREATE TABLE ata_orientacao (
    id_ata SERIAL PRIMARY KEY,
    id_trabalho INT REFERENCES trabalho(id_trabalho),
    data_reuniao TIMESTAMP,
    presencial BOOLEAN,
    titulo VARCHAR(255),
    descricao TEXT
)

CREATE TABLE grupo (
    id_grupo SERIAL PRIMARY KEY,
    id_aluno INT REFERENCES aluno(id_aluno),
    id_trabalho INT REFERENCES trabalho(id_trabalho)
);

CREATE TABLE avaliacao (
    id_avaliacao SERIAL PRIMARY KEY,
    id_trabalho INT REFERENCES trabalho(id_trabalho),
    id_professor INT REFERENCES professor(id_professor),
    valor NUMERIC(3, 1),
    comentario TEXT
);

CREATE TABLE certificado (
    id_certificado SERIAL PRIMARY KEY,
    id_prof_emissor INT REFERENCES professor(id_professor),
    id_banca INT REFERENCES banca(id_banca),
    data_hora_emissao TIMESTAMP,
    comentario TEXT
);

CREATE TABLE convidado (
    id_convidado SERIAL PRIMARY KEY,
    id_professor INT REFERENCES professor(id_professor),
    id_banca INT REFERENCES banca(id_banca)
)

-- ALTER TABLE aluno
-- DROP COLUMN tipoUsuario;
-- ALTER TABLE aluno
-- DROP COLUMN senha;
-- ALTER TABLE aluno
-- ADD user_id VARCHAR(30) UNIQUE;
-- ALTER TABLE aluno
-- ADD email_inst_verif BOOLEAN DEFAULT FALSE;

-- UPDATE aluno
-- SET user_id = '65037fd25186049fb2a47aa4'
-- WHERE id_aluno = 1;

--DELETE FROM aluno;