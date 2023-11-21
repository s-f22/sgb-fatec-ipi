const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config({ path: '../../.env' });
app.use(bodyParser.json());
const { Pool } = require('pg');

// const jwt = require('jsonwebtoken');

const cors = require('cors');
// app.use(cors());


const https = require('https');
const fs = require('fs');

const corsOptions = {
  origin: 'https://s-f22.github.io',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: false,
  optionsSuccessStatus: 204,
  allowedHeaders: "*",
};
app.use(cors(corsOptions));


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


// const VerificarToken = require('../middlewares/VerificarToken.js');
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



// POST
app.post('/grupos', (req, res) => {
  const { id_aluno, id_trabalho } = req.body;

  db.query('INSERT INTO grupo (id_aluno, id_trabalho) VALUES ($1, $2) RETURNING *', [id_aluno, id_trabalho], (error, result) => {
    if (error) {
      res.status(500).json({ error: 'Erro ao criar um novo grupo' });
    } else {
      res.status(201).json(result.rows[0]);
    }
  });
});


// GET
app.get('/grupos', (req, res) => {
  db.query('SELECT * FROM grupo', (error, result) => {
    if (error) {
      res.status(500).json({ error: 'Erro ao obter os grupos' });
    } else {
      res.status(200).json(result.rows);
    }
  });
});


// GET BY ID
app.get('/grupos/:id', (req, res) => {
  const id_grupo = req.params.id;

  db.query('SELECT * FROM grupo WHERE id_grupo = $1', [id_grupo], (error, result) => {
    if (error) {
      res.status(500).json({ error: 'Erro ao obter o grupo' });
    } else if (result.rows.length === 0) {
      res.status(404).json({ error: 'Grupo não encontrado' });
    } else {
      res.status(200).json(result.rows[0]);
    }
  });
});


// PUT
app.put('/grupos/:id',  (req, res) => {
  const id_grupo = req.params.id;
  const { id_aluno, id_trabalho } = req.body;

  db.query('UPDATE grupo SET id_aluno = $1, id_trabalho = $2 WHERE id_grupo = $3 RETURNING *', [id_aluno, id_trabalho, id_grupo], (error, result) => {
    if (error) {
      res.status(500).json({ error: 'Erro ao atualizar o grupo' });
    } else if (result.rows.length === 0) {
      res.status(404).json({ error: 'Grupo não encontrado' });
    } else {
      res.status(200).json(result.rows[0]);
    }
  });
});


// PATCH
app.patch('/grupos/:id', (req, res) => {
  const id_grupo = req.params.id;
  const updates = req.body;

  db.query('UPDATE grupo SET id_aluno = COALESCE($1, id_aluno), id_trabalho = COALESCE($2, id_trabalho) WHERE id_grupo = $3 RETURNING *', [updates.id_aluno, updates.id_trabalho, id_grupo], (error, result) => {
    if (error) {
      res.status(500).json({ error: 'Erro ao atualizar o grupo' });
    } else if (result.rows.length === 0) {
      res.status(404).json({ error: 'Grupo não encontrado' });
    } else {
      res.status(200).json(result.rows[0]);
    }
  });
});


// DELETE
app.delete('/grupos/:id', (req, res) => {
  const id_grupo = req.params.id;

  db.query('DELETE FROM grupo WHERE id_grupo = $1 RETURNING *', [id_grupo], (error, result) => {
    if (error) {
      res.status(500).json({ error: 'Erro ao deletar o grupo' });
    } else if (result.rows.length === 0) {
      res.status(404).json({ error: 'Grupo não encontrado' });
    } else {
      res.status(200).json({ message: 'Grupo deletado com sucesso' });
    }
  });
});



app.get("/grupo_por_trabalho/:id_trabalho", async (req, res) => {
  
  const idTrabalho = req.params.id_trabalho;

  try {
    const result = await db.query(
      "SELECT * FROM grupo WHERE id_trabalho = $1",
      [idTrabalho]
    );

    const grupos = result.rows;

    const alunosPromises = grupos.map(async (grupo) => {
      const alunoResult = await db.query(
        "SELECT * FROM aluno WHERE id_aluno = $1",
        [grupo.id_aluno]
      );
      const aluno = alunoResult.rows[0];
      return {
        id_grupo: grupo.id_grupo,
        aluno_navigation: aluno,
        id_trabalho: grupo.id_trabalho,
      };
    });

    const alunosComInformacoes = await Promise.all(alunosPromises);

    res.json(alunosComInformacoes);
  } catch (error) {
    console.error("Erro ao buscar grupos por trabalho:", error);
    res.status(500).json({ error: "Erro ao buscar grupos por trabalho" });
  } 
});


const port = process.env.MSS_PORTA_GRUPOS

// app.listen(port, host, () => {
//   console.log(`Servidor rodando na porta ${port}`);
// });

// Inicie o servidor HTTPS
httpsServer.listen(port, host, () => {
  console.log(`Servidor GRUPOS HTTPS, rodando na porta ${port}`);
});