--CREATE DATABASE SGB_FATEC_IPI
--GO

USE SGB_FATEC_IPI
GO

-- Criar tabela "aluno"
CREATE TABLE aluno (
    id_aluno INT IDENTITY(1,1) PRIMARY KEY,
    user_id NVARCHAR(30) UNIQUE,
    ra NVARCHAR(13) UNIQUE,
    nome NVARCHAR(255),
    email NVARCHAR(255) UNIQUE,
    curso NVARCHAR(255),
    periodo NVARCHAR(20),
    email_inst_verif BIT DEFAULT 0,
    codigo NVARCHAR(40),
    tipo_usuario INT DEFAULT 1,
    ativo BIT DEFAULT 1
);
GO

-- Criar tabela "professor"
CREATE TABLE professor (
    id_professor INT IDENTITY(1,1) PRIMARY KEY,
    user_id NVARCHAR(30) UNIQUE,
    nome NVARCHAR(255),
    email NVARCHAR(255) UNIQUE,
    email_inst_verif BIT DEFAULT 0,
    coordenador BIT DEFAULT 0,
    codigo NVARCHAR(40),
    tipo_usuario INT DEFAULT 2,
    ativo BIT DEFAULT 1
);
GO

-- Criar tabela "tema"
CREATE TABLE tema (
    id_tema INT IDENTITY(1,1) PRIMARY KEY,
    id_autor INT REFERENCES aluno(id_aluno),
    titulo NVARCHAR(255),
    descricao NVARCHAR(MAX),
    data_cadastro DATETIME,
    disponivel BIT DEFAULT 1
);
GO

-- Criar tabela "dia_aula"
CREATE TABLE dia_aula (
    id_dia_aula INT IDENTITY(1,1) PRIMARY KEY,
    id_professor INT REFERENCES professor(id_professor),
    dia_semana INT
);
GO

-- Criar tabela "horario_aula"
CREATE TABLE horario_aula (
    id_horario_aula INT IDENTITY(1,1) PRIMARY KEY,
    id_professor INT REFERENCES professor(id_professor),
    id_dia_aula INT REFERENCES dia_aula(id_dia_aula),
    entrada TIME,
    saida TIME
);
GO

-- Criar tabela "trabalho"
CREATE TABLE trabalho (
    id_trabalho INT IDENTITY(1,1) PRIMARY KEY,
    id_orientador INT REFERENCES professor(id_professor),
    id_tema INT REFERENCES tema(id_tema),
    nota_final NUMERIC(3, 1),
    previsao_defesa CHAR(7),
    banca_agendada BIT DEFAULT 0
);
GO

-- Criar tabela "banca"
CREATE TABLE banca (
    id_banca INT IDENTITY(1,1) PRIMARY KEY,
    id_trabalho INT REFERENCES trabalho(id_trabalho),
    data_hora DATETIME UNIQUE,
    comentarios NVARCHAR(MAX)
);
GO

-- Criar tabela "ata_orientacao"
CREATE TABLE ata_orientacao (
    id_ata INT IDENTITY(1,1) PRIMARY KEY,
    id_trabalho INT REFERENCES trabalho(id_trabalho),
    data_reuniao DATETIME,
    presencial BIT,
    titulo NVARCHAR(255),
    descricao NVARCHAR(MAX)
);
GO

-- Criar tabela "grupo"
CREATE TABLE grupo (
    id_grupo INT IDENTITY(1,1) PRIMARY KEY,
    id_aluno INT REFERENCES aluno(id_aluno),
    id_trabalho INT REFERENCES trabalho(id_trabalho)
);
GO

-- Criar tabela "avaliacao"
CREATE TABLE avaliacao (
    id_avaliacao INT IDENTITY(1,1) PRIMARY KEY,
    id_trabalho INT REFERENCES trabalho(id_trabalho),
    id_professor INT REFERENCES professor(id_professor),
    valor NUMERIC(3, 1),
    comentario NVARCHAR(MAX)
);
GO

-- Criar tabela "certificado"
CREATE TABLE certificado (
    id_certificado INT IDENTITY(1,1) PRIMARY KEY,
    id_prof_emissor INT REFERENCES professor(id_professor),
    id_banca INT REFERENCES banca(id_banca),
    data_hora_emissao DATETIME,
    comentario NVARCHAR(MAX)
);
GO

-- Criar tabela "convidado"
CREATE TABLE convidado (
    id_convidado INT IDENTITY(1,1) PRIMARY KEY,
    id_professor INT REFERENCES professor(id_professor),
    id_banca INT REFERENCES banca(id_banca)
);
GO
