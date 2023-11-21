const express = require("express");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config({ path: "../../.env" });
app.use(bodyParser.json());
const { Pool } = require("pg");

// const jwt = require("jsonwebtoken");
const cors = require("cors");

const corsOptions = {
  origin: 'https://s-f22.github.io',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: false,
  optionsSuccessStatus: 204,
  allowedHeaders: "*",
};
app.use(cors(corsOptions));


const https = require('https');
const fs = require('fs');

const host = '0.0.0.0'

// Caminhos para os arquivos de chave privada e certificado
const privateKeyPath = '../certs/key.pem';
const certificatePath = '../certs/cert.pem';

// Carregue os arquivos de chave privada e certificado
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const certificate = fs.readFileSync(certificatePath, 'utf8');

// Configurações para criar um servidor HTTPS
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);

// const VerificarToken = require("../middlewares/VerificarToken.js");
//const AuthCheck = require('../middlewares/AuthCheck.js');

const config = {
  user: process.env.DB_config_user,
  host: process.env.DB_config_host,
  database: process.env.DB_config_database,
  password: process.env.DB_config_password,
  port: process.env.DB_config_port,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.DB_config_ca,
  },
};
const db = new Pool(config);

// CADASTRAR
app.post("/trabalhos", (req, res) => {
  const { id_orientador, id_tema, previsao_defesa } = req.body;

  db.query(
    "INSERT INTO trabalho (id_orientador, id_tema, previsao_defesa) VALUES ($1, $2, $3) RETURNING *",
    [id_orientador, id_tema, previsao_defesa],
    (error, result) => {
      if (error) {
        res.status(500).json({ error: "Erro ao criar um novo trabalho" });
      } else {
        res.status(201).json(result.rows[0]);
      }
    }
  );
});

// LISTAR
app.get("/trabalhos", (req, res) => {
  db.query("SELECT * FROM trabalho", (error, result) => {
    if (error) {
      res.status(500).json({ error: "Erro ao obter os trabalhos" });
    } else {
      res.status(200).json(result.rows);
    }
  });
});

// LISTA POR ID
app.get("/trabalhos/:id", (req, res) => {
  const id_trabalho = req.params.id;

  db.query(
    "SELECT * FROM trabalho WHERE id_trabalho = $1",
    [id_trabalho],
    (error, result) => {
      if (error) {
        res.status(500).json({ error: "Erro ao obter o trabalho" });
      } else if (result.rows.length === 0) {
        res.status(404).json({ error: "Trabalho não encontrado" });
      } else {
        res.status(200).json(result.rows[0]);
      }
    }
  );
});

// ATUALIZAR
app.put("/trabalhos/:id", (req, res) => {
  const id_trabalho = req.params.id;
  const { id_orientador, id_tema, previsao_defesa } = req.body;

  db.query(
    "UPDATE trabalho SET id_orientador = $1, id_tema = $2, previsao_defesa = $3 WHERE id_trabalho = $4 RETURNING *",
    [id_orientador, id_tema, previsao_defesa, id_trabalho],
    (error, result) => {
      if (error) {
        res.status(500).json({ error: "Erro ao atualizar o trabalho" });
      } else if (result.rows.length === 0) {
        res.status(404).json({ error: "Trabalho não encontrado" });
      } else {
        res.status(200).json(result.rows[0]);
      }
    }
  );
});

// ATUALIZAÇÃO PARCIAL
// Endpoint PATCH para atualizar um trabalho
app.patch("/trabalhos/:id", async (req, res) => {
  const { id } = req.params;
  const { nota_final, previsao_defesa, banca_agendada } = req.body;

  try {
    // Consulta para obter o trabalho atual
    const querySelect = "SELECT * FROM trabalho WHERE id_trabalho = $1";
    const resultSelect = await db.query(querySelect, [id]);

    if (resultSelect.rowCount !== 1) {
      res.status(404).json({ message: "Trabalho não encontrado." });
      return;
    }

    // Mesclar os valores atuais com os novos
    const trabalhoAtual = resultSelect.rows[0];
    const novoTrabalho = {
      nota_final:
        nota_final !== undefined ? nota_final : trabalhoAtual.nota_final,
      previsao_defesa:
        previsao_defesa !== undefined
          ? previsao_defesa
          : trabalhoAtual.previsao_defesa,
      banca_agendada:
        banca_agendada !== undefined
          ? banca_agendada
          : trabalhoAtual.banca_agendada,
    };

    // Atualizar o trabalho com os novos valores mesclados
    const queryUpdate = `
      UPDATE trabalho
      SET
        nota_final = $1,
        previsao_defesa = $2,
        banca_agendada = $3
      WHERE
        id_trabalho = $4
    `;

    const resultUpdate = await db.query(queryUpdate, [
      novoTrabalho.nota_final,
      novoTrabalho.previsao_defesa,
      novoTrabalho.banca_agendada,
      id,
    ]);

    if (resultUpdate.rowCount === 1) {
      res.status(200).json({ message: "Trabalho atualizado com sucesso!" });
    } else {
      res.status(500).json({ message: "Erro ao atualizar o trabalho." });
    }
  } catch (error) {
    console.error("Erro ao atualizar o trabalho:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// DELETE
app.delete("/trabalhos/:id", (req, res) => {
  const id_trabalho = req.params.id;

  db.query(
    "DELETE FROM trabalho WHERE id_trabalho = $1 RETURNING *",
    [id_trabalho],
    (error, result) => {
      if (error) {
        res.status(500).json({ error: "Erro ao deletar o trabalho" });
      } else if (result.rows.length === 0) {
        res.status(404).json({ error: "Trabalho não encontrado" });
      } else {
        res.status(200).json({ message: "Trabalho deletado com sucesso" });
      }
    }
  );
});

app.get("/trabalhos_navigation/:id", async (req, res) => {
  try {
    const trabalhoId = req.params.id;

    // Consultar o trabalho com base no ID do trabalho
    const trabalhoQuery = "SELECT * FROM trabalho WHERE id_trabalho = $1";
    const trabalhoResult = await db.query(trabalhoQuery, [trabalhoId]);

    if (trabalhoResult.rows.length === 0) {
      return res.status(404).json({ error: "Trabalho não encontrado" });
    }

    const trabalho = trabalhoResult.rows[0];

    // Consultar o professor associado ao trabalho com base no ID do orientador
    const professorQuery = "SELECT * FROM professor WHERE id_professor = $1";
    const professorResult = await db.query(professorQuery, [
      trabalho.id_orientador,
    ]);

    if (professorResult.rows.length === 0) {
      return res.status(404).json({ error: "Professor não encontrado" });
    }

    const orientador_navigation = professorResult.rows[0];

    // Consultar o tema associado ao trabalho com base no ID do tema
    const temaQuery = "SELECT * FROM tema WHERE id_tema = $1";
    const temaResult = await db.query(temaQuery, [trabalho.id_tema]);

    if (temaResult.rows.length === 0) {
      return res.status(404).json({ error: "Tema não encontrado" });
    }

    const tema_navigation = temaResult.rows[0];

    // Consultar o aluno associado ao tema com base no ID do autor do tema
    const alunoQuery = "SELECT * FROM aluno WHERE id_aluno = $1";
    const alunoResult = await db.query(alunoQuery, [tema_navigation.id_autor]);

    if (alunoResult.rows.length === 0) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }

    const autor_navigation = alunoResult.rows[0];

    // Consultar o grupo associado ao trabalho com base no ID do trabalho
    const grupoQuery = "SELECT * FROM grupo WHERE id_trabalho = $1";
    const grupoResult = await db.query(grupoQuery, [trabalho.id_trabalho]);

    if (grupoResult.rows.length === 0) {
      return res.status(404).json({ error: "Grupo não encontrado" });
    }

    const grupo_navigation = grupoResult.rows;

    // Para cada grupo, consultar os detalhes do aluno
    for (const grupo of grupo_navigation) {
      const alunoQuery = "SELECT * FROM aluno WHERE id_aluno = $1";
      const alunoResult = await db.query(alunoQuery, [grupo.id_aluno]);

      if (alunoResult.rows.length === 0) {
        return res.status(404).json({ error: "Aluno não encontrado" });
      }

      grupo.aluno_navigation = alunoResult.rows[0];
    }

    // Construir a resposta conforme a estrutura desejada
    const response = {
      id_trabalho: trabalho.id_trabalho,
      orientador_navigation: orientador_navigation,
      tema_navigation: {
        id_tema: tema_navigation.id_tema,
        autor_navigation: autor_navigation,
        titulo: tema_navigation.titulo,
        descricao: tema_navigation.descricao,
        data_cadastro: tema_navigation.data_cadastro,
      },
      nota_final: trabalho.nota_final,
      previsao_defesa: trabalho.previsao_defesa,
      banca_agendada: trabalho.banca_agendada,
      grupo_navigation: grupo_navigation,
    };

    res.json(response);
  } catch (error) {
    console.error("Erro ao buscar trabalho, professor, tema e aluno:", error);
    res
      .status(500)
      .json({ error: "Erro ao buscar trabalho, professor, tema e aluno" });
  }
});


app.get("/trabalhos_navigation", async (req, res) => {
  try {
    // Consultar todos os trabalhos
    const trabalhosQuery = "SELECT * FROM trabalho";
    const trabalhosResult = await db.query(trabalhosQuery);

    if (trabalhosResult.rows.length === 0) {
      return res.status(404).json({ error: "Nenhum trabalho encontrado" });
    }

    // Mapear os resultados para construir a lista de trabalhos
    const trabalhos = [];

    for (const trabalho of trabalhosResult.rows) {
      const trabalhoResponse = {
        id_trabalho: trabalho.id_trabalho,
        orientador_navigation: {}, // Preencher com as informações do orientador
        tema_navigation: {}, // Preencher com as informações do tema
        nota_final: trabalho.nota_final,
        previsao_defesa: trabalho.previsao_defesa,
        banca_agendada: trabalho.banca_agendada,
        grupo_navigation: [], // Preencher com as informações dos grupos
      };

      // Consultar informações do orientador
      const professorQuery = "SELECT * FROM professor WHERE id_professor = $1";
      const professorResult = await db.query(professorQuery, [trabalho.id_orientador]);

      if (professorResult.rows.length > 0) {
        trabalhoResponse.orientador_navigation = professorResult.rows[0];
      }

      // Consultar informações do tema
      const temaQuery = "SELECT * FROM tema WHERE id_tema = $1";
      const temaResult = await db.query(temaQuery, [trabalho.id_tema]);

      if (temaResult.rows.length > 0) {
        trabalhoResponse.tema_navigation = temaResult.rows[0];
      }

      // Consultar informações dos grupos relacionados ao trabalho
      const grupoQuery = "SELECT * FROM grupo WHERE id_trabalho = $1";
      const grupoResult = await db.query(grupoQuery, [trabalho.id_trabalho]);

      for (const grupo of grupoResult.rows) {
        const alunoQuery = "SELECT * FROM aluno WHERE id_aluno = $1";
        const alunoResult = await db.query(alunoQuery, [grupo.id_aluno]);

        if (alunoResult.rows.length > 0) {
          grupo.aluno_navigation = alunoResult.rows[0];
        }

        trabalhoResponse.grupo_navigation.push(grupo);
      }

      trabalhos.push(trabalhoResponse);
    }

    res.json(trabalhos);
  } catch (error) {
    console.error("Erro ao buscar a lista de trabalhos:", error);
    res.status(500).json({ error: "Erro ao buscar a lista de trabalhos" });
  }
});

const port = process.env.MSS_PORTA_TRABALHOS

// app.listen(port, host, () => {
//   console.log(`Servidor rodando na porta ${port}`);
// });

// Inicie o servidor HTTPS
httpsServer.listen(port, host, () => {
  console.log(`Servidor TRABALHOS HTTPS, rodando na porta ${port}`);
});
