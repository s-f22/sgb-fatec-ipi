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


-- Aluno 1
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('vinicius01', '1234567890123', 'Vinícius Soares Leite', 'vinicius@example.com', 'Engenharia de Software', '2º período', TRUE, 'abc123', 1, TRUE);

-- Aluno 2
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('luna02', '9876543210987', 'Luna', 'luna@example.com', 'Ciência da Computação', '3º período', TRUE, 'def456', 1, TRUE);

-- Aluno 3
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('ricardo03', '3456789012345', 'Ricardo', 'ricardo@example.com', 'Administração', '4º período', TRUE, 'ghi789', 1, TRUE);

-- Aluno 4
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('joicy04', '5678901234567', 'Joicy Nunes', 'joicy@example.com', 'Psicologia', '2º período', TRUE, 'jkl012', 1, TRUE);

-- Aluno 5
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('gabriel05', '8901234567890', 'Gabriel Martins', 'gabriel@example.com', 'Medicina', '3º período', TRUE, 'mno345', 1, TRUE);

-- Aluno 6
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('arthur06', '0123456789012', 'Arthur Hayakawa', 'arthur@example.com', 'Engenharia Elétrica', '4º período', TRUE, 'pqr678', 1, TRUE);

-- Aluno 7
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('ellen07', '2345678901234', 'Ellen Souza', 'ellen@example.com', 'Arquitetura', '2º período', TRUE, 'stu901', 1, TRUE);

-- Aluno 8
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('luiz08', '4567890123456', 'Luiz Henrique Silva', 'luiz@example.com', 'Direito', '3º período', TRUE, 'vwx234', 1, TRUE);

-- Aluno 9
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('olavo09', '6789012345678', 'Olavo Nardari Leandro', 'olavo@example.com', 'Economia', '4º período', TRUE, 'yzab567', 1, TRUE);

-- Aluno 10
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('samuel10', '8901234567890', 'SAMUEL FIGUEIREDO SILVEIRA', 'samuel@example.com', 'Engenharia Civil', '5º período', TRUE, 'cdefgh789', 1, TRUE);
-- Aluno 11
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('cicero11', '0123456789123', 'CICERO CRISTIANO RODRIGUES DA MOTA', 'cicero@example.com', 'Ciências Contábeis', '2º período', TRUE, 'ijklmn123', 1, TRUE);

-- Aluno 12
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('guilherme12', '1234567891234', 'GUILHERME FARIA DOS REIS', 'guilherme@example.com', 'Engenharia Mecânica', '3º período', TRUE, 'opqrst456', 1, TRUE);

-- Aluno 13
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('miguel13', '2345678912345', 'MIGUEL AUGUSTO DE SOUSA BORGES', 'miguel@example.com', 'Medicina Veterinária', '4º período', TRUE, 'uvwxyz789', 1, TRUE);

-- Aluno 14
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('wathanan14', '3456789123456', 'WATHANAN LUCAS SANTOS', 'wathanan@example.com', 'Biologia', '2º período', TRUE, 'abc123xyz', 1, TRUE);

-- Aluno 15
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('wellington15', '4567891234567', 'WELLINGTON MENDES SILVA', 'wellington@example.com', 'Engenharia Química', '3º período', TRUE, 'def456uvw', 1, TRUE);

-- Aluno 16
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('jessica16', '5678912345678', 'JESSICA EMANUELE FERREIRA', 'jessica@example.com', 'Letras', '4º período', TRUE, 'ghijk789lmn', 1, TRUE);

-- Aluno 17
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('iasmin17', '6789123456789', 'IASMIN MOREIRA DIAS DA COSTA', 'iasmin@example.com', 'Psicologia', '2º período', TRUE, 'opqrs123tuv', 1, TRUE);

-- Aluno 18
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('beatriz18', '7891234567890', 'BEATRIZ LIRA GONZAGA', 'beatriz@example.com', 'Engenharia Ambiental', '3º período', TRUE, 'wxyz456abc', 1, TRUE);

-- Aluno 19
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('camila19', '8912345678901', 'CAMILA DOS SANTOS FARIAS', 'camila@example.com', 'Arquitetura', '4º período', TRUE, 'defghi789jkl', 1, TRUE);

-- Aluno 20
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('erika20', '9123456789012', 'ERIKA ARAUJO SILVA', 'erika@example.com', 'Administração', '5º período', TRUE, 'mnopqrs123tuv', 1, TRUE);

-- Aluno 21
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('leonardo21', '1234567890123', 'LEONARDO DO CARMO SOUTO', 'leonardo@example.com', 'Engenharia de Produção', '2º período', TRUE, 'abc123def', 1, TRUE);

-- Aluno 22
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('ed21', '2345678901234', 'ED CARLOS SANTOS E SILVA', 'ed@example.com', 'Medicina', '3º período', TRUE, 'def456ghi', 1, TRUE);

-- Aluno 23
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('marcelo23', '3456789012345', 'MARCELO ACERBI MEGALE', 'marcelo@example.com', 'Engenharia Elétrica', '4º período', TRUE, 'jklmnopqr', 1, TRUE);

-- Aluno 24
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('marco24', '4567890123456', 'MARCO ANTONIO PICHELLI', 'marco@example.com', 'Arquitetura', '2º período', TRUE, 'stuvwx789yz', 1, TRUE);

-- Aluno 25
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('eliakin25', '5678901234567', 'ELIAKIN ARAUJO MARTINS', 'eliakin@example.com', 'Letras', '3º período', TRUE, 'abcd123efgh', 1, TRUE);

-- Aluno 26
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('phillipe26', '6789012345678', 'PHILLIPE ZAMPINI', 'phillipe@example.com', 'Ciências da Computação', '4º período', TRUE, 'ijkl567mnop', 1, TRUE);

-- Aluno 27
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('matheus27', '7890123456789', 'MATHEUS SOBRINHO CHAGAS', 'matheus@example.com', 'Engenharia Química', '2º período', TRUE, 'qrst789uvwx', 1, TRUE);

-- Aluno 28
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('fabio28', '8901234567890', 'FABIO JESUS CAVALCANTE', 'fabio@example.com', 'Administração', '3º período', TRUE, 'yzab123cdef', 1, TRUE);

-- Aluno 29
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('jonathan29', '9012345678901', 'JONATHAN PEREIRA DA SILVA', 'jonathan@example.com', 'Economia', '4º período', TRUE, 'ghijk789lmn', 1, TRUE);

-- Aluno 30
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('luana30', '1234567890123', 'LUANA CIBELLE DE SOUSA SILVA', 'luana@example.com', 'Ciências Biológicas', '5º período', TRUE, 'opqrs123tuv', 1, TRUE);

-- Aluno 31
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('gabriel31', '2345678901234', 'GABRIEL LINHARES DA SILVA', 'gabriel@example.com', 'Engenharia Ambiental', '2º período', TRUE, 'cdefg123hij', 1, TRUE);

-- Aluno 32
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('rodrigo32', '3456789012345', 'Rodrigo Rivaldo Pinheiro', 'rodrigo@example.com', 'Medicina', '3º período', TRUE, 'klmno456pqr', 1, TRUE);

-- Aluno 33
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('jeovane33', '4567890123456', 'JEOVANE APOSTOLO DE OLIVEIRA', 'jeovane@example.com', 'Engenharia de Produção', '4º período', TRUE, 'stuvw789xyz', 1, TRUE);

-- Aluno 34
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('giulia34', '5678901234567', 'GIULIA GOMES SOUSA CANGUEIRO', 'giulia@example.com', 'Ciências da Computação', '2º período', TRUE, 'abcd123efgh', 1, TRUE);

-- Aluno 35
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('jullia35', '6789012345678', 'JULLIA APARECIDA DA COSTA MAIA', 'jullia@example.com', 'Engenharia Civil', '3º período', TRUE, 'ijkl567mnop', 1, TRUE);

-- Aluno 36
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('gabriel36', '7890123456789', 'GABRIEL ALMEIDA E SILVA', 'gabriel@example.com', 'Administração', '4º período', TRUE, 'qrst789uvwx', 1, TRUE);

-- Aluno 37
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('gabriel37', '8901234567890', 'GABRIEL LINHARES DA SILVA', 'gabriel@example.com', 'Direito', '2º período', TRUE, 'yzab123cdef', 1, TRUE);

-- Aluno 38
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('gustavo38', '9012345678901', 'GUSTAVO DA SILVEIRA MORAES DUPIN', 'gustavo@example.com', 'Ciências Biológicas', '3º período', TRUE, 'ghijk789lmn', 1, TRUE);

-- Aluno 39
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('pablo39', '1234567890123', 'PABLO LUIZ CARDOSO DA SILVA', 'pablo@example.com', 'Engenharia Elétrica', '4º período', TRUE, 'opqrs123tuv', 1, TRUE);

-- Aluno 40
INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, email_inst_verif, codigo, tipo_usuario, ativo)
VALUES ('renata40', '2345678901234', 'RENATA SOUZA PRADO', 'renata@example.com', 'Engenharia de Software', '5º período', TRUE, 'wxyz456abc', 1, TRUE);







-- Script 1
INSERT INTO tema (id_autor, titulo, descricao, data_cadastro, disponivel)
VALUES (53, 'Tema 1', 'Descrição do Tema 1', CURRENT_TIMESTAMP, TRUE);

-- Script 2
INSERT INTO tema (id_autor, titulo, descricao, data_cadastro, disponivel)
VALUES (54, 'Tema 2', 'Descrição do Tema 2', CURRENT_TIMESTAMP, TRUE);

-- Script 3
INSERT INTO tema (id_autor, titulo, descricao, data_cadastro, disponivel)
VALUES (55, 'Tema 3', 'Descrição do Tema 3', CURRENT_TIMESTAMP, TRUE);

-- Script 4
INSERT INTO tema (id_autor, titulo, descricao, data_cadastro, disponivel)
VALUES (56, 'Tema 4', 'Descrição do Tema 4', CURRENT_TIMESTAMP, TRUE);

-- Script 5
INSERT INTO tema (id_autor, titulo, descricao, data_cadastro, disponivel)
VALUES (57, 'Tema 5', 'Descrição do Tema 5', CURRENT_TIMESTAMP, TRUE);

-- Script 6
INSERT INTO tema (id_autor, titulo, descricao, data_cadastro, disponivel)
VALUES (58, 'Tema 6', 'Descrição do Tema 6', CURRENT_TIMESTAMP, TRUE);

-- Script 7
INSERT INTO tema (id_autor, titulo, descricao, data_cadastro, disponivel)
VALUES (59, 'Tema 7', 'Descrição do Tema 7', CURRENT_TIMESTAMP, TRUE);

-- Script 8
INSERT INTO tema (id_autor, titulo, descricao, data_cadastro, disponivel)
VALUES (60, 'Tema 8', 'Descrição do Tema 8', CURRENT_TIMESTAMP, TRUE);

-- Script 9
INSERT INTO tema (id_autor, titulo, descricao, data_cadastro, disponivel)
VALUES (61, 'Tema 9', 'Descrição do Tema 9', CURRENT_TIMESTAMP, TRUE);

-- Script 10
INSERT INTO tema (id_autor, titulo, descricao, data_cadastro, disponivel)
VALUES (53, 'Tema 10', 'Descrição do Tema 10', CURRENT_TIMESTAMP, TRUE);







-- Script 1
INSERT INTO professor (user_id, nome, email, email_inst_verif, coordenador, codigo, tipo_usuario, ativo)
VALUES ('prof1', 'Silva Oliveira', 'silva@example.com', TRUE, FALSE, 'abc123', 2, TRUE);

-- Script 2
INSERT INTO professor (user_id, nome, email, email_inst_verif, coordenador, codigo, tipo_usuario, ativo)
VALUES ('prof2', 'Santos Lima', 'santos@example.com', TRUE, FALSE, 'def456', 2, TRUE);

-- Script 3
INSERT INTO professor (user_id, nome, email, email_inst_verif, coordenador, codigo, tipo_usuario, ativo)
VALUES ('prof3', 'Oliveira Costa', 'oliveira@example.com', TRUE, TRUE, 'ghi789', 2, TRUE);

-- Script 4
INSERT INTO professor (user_id, nome, email, email_inst_verif, coordenador, codigo, tipo_usuario, ativo)
VALUES ('prof4', 'Costa Lima', 'costa@example.com', TRUE, FALSE, 'jkl012', 2, TRUE);

-- Script 5
INSERT INTO professor (user_id, nome, email, email_inst_verif, coordenador, codigo, tipo_usuario, ativo)
VALUES ('prof5', 'Lima Almeida', 'lima@example.com', TRUE, FALSE, 'mno345', 2, TRUE);

-- Script 6
INSERT INTO professor (user_id, nome, email, email_inst_verif, coordenador, codigo, tipo_usuario, ativo)
VALUES ('prof6', 'Almeida Pereira', 'almeida@example.com', TRUE, FALSE, 'pqr678', 2, TRUE);

-- Script 7
INSERT INTO professor (user_id, nome, email, email_inst_verif, coordenador, codigo, tipo_usuario, ativo)
VALUES ('prof7', 'Pereira Silva', 'pereira@example.com', TRUE, TRUE, 'stu901', 2, TRUE);

-- Script 8
INSERT INTO professor (user_id, nome, email, email_inst_verif, coordenador, codigo, tipo_usuario, ativo)
VALUES ('prof8', 'Silva Lima', 'silva2@example.com', TRUE, FALSE, 'vwx234', 2, TRUE);

-- Script 9
INSERT INTO professor (user_id, nome, email, email_inst_verif, coordenador, codigo, tipo_usuario, ativo)
VALUES ('prof9', 'Martins Costa', 'martins@example.com', TRUE, FALSE, 'yzab567', 2, TRUE);

-- Script 10
INSERT INTO professor (user_id, nome, email, email_inst_verif, coordenador, codigo, tipo_usuario, ativo)
VALUES ('prof10', 'Santos Oliveira', 'santos2@example.com', TRUE, FALSE, 'cdefgh789', 2, TRUE);








-- Script 1
INSERT INTO trabalho (id_orientador, id_tema, nota_final, previsao_defesa, banca_agendada)
VALUES (10, 2, 8.5, '2023-05', FALSE);

-- Script 2
INSERT INTO trabalho (id_orientador, id_tema, nota_final, previsao_defesa, banca_agendada)
VALUES (11, 3, 7.8, '2023-06', TRUE);

-- Script 3
INSERT INTO trabalho (id_orientador, id_tema, nota_final, previsao_defesa, banca_agendada)
VALUES (12, 4, 9.2, '2023-07', FALSE);

-- Script 4
INSERT INTO trabalho (id_orientador, id_tema, nota_final, previsao_defesa, banca_agendada)
VALUES (13, 5, 8.0, '2023-08', TRUE);

-- Script 5
INSERT INTO trabalho (id_orientador, id_tema, nota_final, previsao_defesa, banca_agendada)
VALUES (14, 6, 9.5, '2023-09', FALSE);

-- Script 6
INSERT INTO trabalho (id_orientador, id_tema, nota_final, previsao_defesa, banca_agendada)
VALUES (15, 7, 7.3, '2023-10', TRUE);

-- Script 7
INSERT INTO trabalho (id_orientador, id_tema, nota_final, previsao_defesa, banca_agendada)
VALUES (16, 8, 8.9, '2023-11', FALSE);

-- Script 8
INSERT INTO trabalho (id_orientador, id_tema, nota_final, previsao_defesa, banca_agendada)
VALUES (17, 9, 9.8, '2023-12', TRUE);

-- Script 9
INSERT INTO trabalho (id_orientador, id_tema, nota_final, previsao_defesa, banca_agendada)
VALUES (18, 10, 7.2, '2024-01', FALSE);

-- Script 10
INSERT INTO trabalho (id_orientador, id_tema, nota_final, previsao_defesa, banca_agendada)
VALUES (19, 11, 8.7, '2024-02', TRUE);






-- Script 1
INSERT INTO grupo (id_aluno, id_trabalho)
VALUES (53, 1);

-- Script 2
INSERT INTO grupo (id_aluno, id_trabalho)
VALUES (54, 1);

-- Script 3
INSERT INTO grupo (id_aluno, id_trabalho)
VALUES (55, 1);

-- Script 4
INSERT INTO grupo (id_aluno, id_trabalho)
VALUES (56, 1);



-- Script 9
INSERT INTO grupo (id_aluno, id_trabalho)
VALUES (61, 2);

-- Script 10
INSERT INTO grupo (id_aluno, id_trabalho)
VALUES (53, 2);

-- Script 11
INSERT INTO grupo (id_aluno, id_trabalho)
VALUES (54, 2);

-- Script 12
INSERT INTO grupo (id_aluno, id_trabalho)
VALUES (55, 2);



-- Script 13
INSERT INTO grupo (id_aluno, id_trabalho)
VALUES (56, 3);

-- Script 14
INSERT INTO grupo (id_aluno, id_trabalho)
VALUES (57, 3);

-- Script 15
INSERT INTO grupo (id_aluno, id_trabalho)
VALUES (58, 3);

-- Script 16
INSERT INTO grupo (id_aluno, id_trabalho)
VALUES (59, 3);


-- Script 17
INSERT INTO grupo (id_aluno, id_trabalho)
VALUES (60, 4);

-- Script 18
INSERT INTO grupo (id_aluno, id_trabalho)
VALUES (61, 4);

-- Script 19
INSERT INTO grupo (id_aluno, id_trabalho)
VALUES (53, 4);

-- Script 20
INSERT INTO grupo (id_aluno, id_trabalho)
VALUES (54, 4);




-- Script 21
INSERT INTO grupo (id_aluno, id_trabalho)
VALUES (55, 5);

-- Script 22
INSERT INTO grupo (id_aluno, id_trabalho)
VALUES (56, 5);

-- Script 23
INSERT INTO grupo (id_aluno, id_trabalho)
VALUES (57, 5);

-- Script 24
INSERT INTO grupo (id_aluno, id_trabalho)
VALUES (58, 5);
