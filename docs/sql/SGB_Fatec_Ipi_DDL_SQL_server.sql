-- Tabela ALUNO
CREATE TABLE ALUNO (
    idAluno INT IDENTITY(1,1) PRIMARY KEY,
    ra VARCHAR(13) UNIQUE,
    nome VARCHAR(255),
    email VARCHAR(255),
    curso VARCHAR(255),
    periodo VARCHAR(20)
);
GO

-- Tabela PROFESSOR
CREATE TABLE PROFESSOR (
    idProfessor INT IDENTITY(1,1) PRIMARY KEY,
    nome VARCHAR(255),
    email VARCHAR(255) UNIQUE
);
GO

-- Tabela TRABALHO
CREATE TABLE TRABALHO (
    idTrabalho INT IDENTITY(1,1) PRIMARY KEY,
    titulo VARCHAR(255),
    descricao TEXT,
    notaFinal DECIMAL(3, 1) CHECK (notaFinal >= 0 AND notaFinal <= 10)
);
GO

-- Tabela BANCA
CREATE TABLE BANCA (
    idBanca INT IDENTITY(1,1) PRIMARY KEY,
    idTrabalho INT REFERENCES TRABALHO(idTrabalho),
    dataHora DATETIME UNIQUE
);
GO

-- Tabela CARGO-PROFESSOR
CREATE TABLE CARGO_PROFESSOR (
    id_Cargo_Prof INT IDENTITY(1,1) PRIMARY KEY,
    idProfessor INT REFERENCES PROFESSOR(idProfessor),
    cargo VARCHAR(255)
);
GO

-- Tabela DIA-AULA
CREATE TABLE DIA_AULA (
    idDiaAula INT IDENTITY(1,1) PRIMARY KEY,
    idProfessor INT REFERENCES PROFESSOR(idProfessor),
    diaSemana VARCHAR(20)
);
GO

-- Tabela TRABALHO-ALUNO
CREATE TABLE TRABALHO_ALUNO (
    id_Trab_Aluno INT IDENTITY(1,1) PRIMARY KEY,
    idAluno INT REFERENCES ALUNO(idAluno),
    idTrabalho INT REFERENCES TRABALHO(idTrabalho)
);
GO

-- Tabela HORARIO-AULA
CREATE TABLE HORARIO_AULA (
    idHorarioAula INT IDENTITY(1,1) PRIMARY KEY,
    idProfessor INT REFERENCES PROFESSOR(idProfessor),
    idDiaAula INT REFERENCES DIA_AULA(idDiaAula),
    entrada TIME,
    saida TIME
);
GO

-- Tabela TRABALHO-PROFESSOR
CREATE TABLE TRABALHO_PROFESSOR (
    id_Trab_Prof INT IDENTITY(1,1) PRIMARY KEY,
    id_Cargo_Prof INT REFERENCES CARGO_PROFESSOR(id_Cargo_Prof),
    idTrabalho INT REFERENCES TRABALHO(idTrabalho)
);
GO

-- Tabela AVALIACAO
CREATE TABLE AVALIACAO (
    idAvaliacao INT IDENTITY(1,1) PRIMARY KEY,
    idTrabalho INT REFERENCES TRABALHO(idTrabalho),
    id_Cargo_Prof INT REFERENCES CARGO_PROFESSOR(id_Cargo_Prof),
    valor DECIMAL(3, 1) CHECK (valor >= 0 AND valor <= 10),
    comentario TEXT
);
GO

-- Tabela BANCA-PROFESSOR
CREATE TABLE BANCA_PROFESSOR (
    id_Banca_Prof INT IDENTITY(1,1) PRIMARY KEY,
    id_Cargo_Prof INT REFERENCES CARGO_PROFESSOR(id_Cargo_Prof),
    idBanca INT REFERENCES BANCA(idBanca)
);
GO

-- Tabela CERTIFICADO
CREATE TABLE CERTIFICADO (
    idCertificado INT IDENTITY(1,1) PRIMARY KEY,
    id_Cargo_Prof INT REFERENCES CARGO_PROFESSOR(id_Cargo_Prof),
    idBanca INT REFERENCES BANCA(idBanca),
    dataHoraEmissao DATETIME,
    comentario TEXT
);
GO
