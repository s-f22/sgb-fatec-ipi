const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
require("dotenv").config({ path: "../../.env" });
const app = express();
const cors = require("cors");
app.use(bodyParser.json());
// app.use(cors());

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

const port = process.env.MSS_PORTA_TEMAS; // Alterado para a porta correta

// const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");

// const VerificarToken = require("../middlewares/VerificarToken.js");

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

app.post("/temas", async (req, res) => {
  // Alterado para '/tema'
  try {
    const { id_autor, titulo, descricao } = req.body; // Alterado para os campos corretos
    const data_cadastro = new Date().toISOString();

    const query =
      "INSERT INTO tema (id_autor, titulo, descricao, data_cadastro) VALUES ($1, $2, $3, $4) RETURNING id_tema, id_autor, titulo, descricao, data_cadastro"; // Alterado para inserir na tabela "tema"
    const values = [id_autor, titulo, descricao, data_cadastro]; // Alterado para os campos corretos

    const result = await db.query(query, values);

    const tema = {
      id_tema: result.rows[0].id_tema,
      id_autor: result.rows[0].id_autor,
      titulo: result.rows[0].titulo,
      descricao: result.rows[0].descricao,
      data_cadastro: result.rows[0].data_cadastro,
    };

    res.status(201).json({ message: "Tema cadastrado com sucesso!", tema });
  } catch (error) {
    console.error("Erro ao cadastrar o tema:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.get("/temas", async (req, res) => {
  // Alterado para '/tema'
  try {
    const result = await db.query("SELECT * FROM tema"); // Alterado para selecionar da tabela "tema"
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.get("/tema/:id_tema", async (req, res) => {
  // Alterado para '/tema'
  const id_tema = req.params.id_tema;

  try {
    const result = await db.query("SELECT * FROM tema WHERE id_tema = $1", [
      id_tema,
    ]); // Alterado para buscar na tabela "tema"
    if (result.rows.length === 0) {
      res.status(404).json({ error: `Tema com ID ${id_tema} não encontrado.` });
    } else {
      const tema = {
        id_tema: result.rows[0].id_tema,
        id_autor: result.rows[0].id_autor,
        titulo: result.rows[0].titulo,
        descricao: result.rows[0].descricao,
        data_cadastro: result.rows[0].data_cadastro,
      };
      res.status(200).json(tema);
    }
  } catch (error) {
    console.error(`Erro ao buscar tema com ID ${id_tema}:`, error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.put("/tema/:id_tema", async (req, res) => {
  // Alterado para '/tema'
  try {
    const id_tema = req.params.id_tema;
    const { id_autor, titulo, descricao, data_cadastro } = req.body; // Alterado para os campos corretos
    const result = await db.query(
      "UPDATE tema SET id_autor=$1, titulo=$2, descricao=$3, data_cadastro=$4 WHERE id_tema=$5 RETURNING *",
      [id_autor, titulo, descricao, data_cadastro, id_tema] // Alterado para os campos corretos
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.delete("/tema/:id_tema", async (req, res) => {
  // Alterado para '/tema'
  try {
    const id_tema = req.params.id_tema;
    const result = await db.query("DELETE FROM tema WHERE id_tema = $1", [
      id_tema,
    ]); // Alterado para deletar da tabela "tema"

    if (result.rowCount === 1) {
      res.json({ message: "Tema deletado com sucesso" });
    } else {
      res.status(404).json({ error: "Tema não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao deletar tema:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.patch('/tema/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, disponivel } = req.body;

  try {
    // Consulta para obter o tema atual
    const querySelect = 'SELECT * FROM tema WHERE id_tema = $1';
    const resultSelect = await db.query(querySelect, [id]);

    if (resultSelect.rowCount !== 1) {
      res.status(404).json({ message: 'Tema não encontrado.' });
      return;
    }

    // Mesclar os valores atuais com os novos
    const temaAtual = resultSelect.rows[0];
    const novoTema = {
      titulo: titulo !== undefined ? titulo : temaAtual.titulo,
      descricao: descricao !== undefined ? descricao : temaAtual.descricao,
      disponivel:
        disponivel !== undefined ? disponivel : temaAtual.disponivel,
    };

    // Atualizar o tema com os novos valores mesclados
    const queryUpdate = `
      UPDATE tema
      SET
        titulo = $1,
        descricao = $2,
        disponivel = $3
      WHERE
        id_tema = $4
    `;

    const resultUpdate = await db.query(queryUpdate, [
      novoTema.titulo,
      novoTema.descricao,
      novoTema.disponivel,
      id,
    ]);

    if (resultUpdate.rowCount === 1) {
      res.status(200).json({ message: 'Tema atualizado com sucesso!' });
    } else {
      res.status(500).json({ message: 'Erro ao atualizar o tema.' });
    }
  } catch (error) {
    console.error('Erro ao atualizar o tema:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get("/tema_navigation/:id", async (req, res) => {
  try {
    const temaId = req.params.id;

    // Consultar o tema com base no ID do tema
    const temaQuery = "SELECT * FROM tema WHERE id_tema = $1";
    const temaResult = await db.query(temaQuery, [temaId]);

    if (temaResult.rows.length === 0) {
      return res.status(404).json({ error: "Tema não encontrado" });
    }

    const tema = temaResult.rows[0];

    // Consultar o aluno associado ao tema com base no ID do autor
    const alunoQuery = "SELECT * FROM aluno WHERE id_aluno = $1";
    const alunoResult = await db.query(alunoQuery, [tema.id_autor]);

    if (alunoResult.rows.length === 0) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }

    const autor_navigation = alunoResult.rows[0];

    // Construir a resposta conforme a estrutura desejada
    const response = {
      id_tema: tema.id_tema,
      autor_navigation: autor_navigation,
      titulo: tema.titulo,
      descricao: tema.descricao,
      data_cadastro: tema.data_cadastro,
    };

    res.json(response);
  } catch (error) {
    console.error("Erro ao buscar tema e aluno:", error);
    res.status(500).json({ error: "Erro ao buscar tema e aluno" });
  }
});





// app.listen(port, host, () => {
//   console.log(`Servidor rodando na porta ${port}`);
// });

// Inicie o servidor HTTPS
httpsServer.listen(port, host, () => {
  console.log(`Servidor TEMAS HTTPS, rodando na porta ${port}`);
});
