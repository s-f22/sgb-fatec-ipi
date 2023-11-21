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
app.post('/convidados', (req, res) => {
  const { id_professor, id_banca } = req.body;

  const query = 'INSERT INTO convidado (id_professor, id_banca) VALUES ($1, $2) RETURNING *';
  const values = [id_professor, id_banca];

  db.query(query, values)
    .then(result => {
      res.status(201).json(result.rows[0]);
    })
    .catch(error => {
      res.status(500).json({ error: 'Erro ao criar o convidado.' });
    });
});


// GET
app.get('/convidados', (req, res) => {
  db.query('SELECT * FROM convidado')
    .then(result => {
      res.json(result.rows);
    })
    .catch(error => {
      res.status(500).json({ error: 'Erro ao obter os convidados.' });
    });
});


// GET BY ID
app.get('/convidados/:id', (req, res) => {
  const id_convidado = req.params.id;

  db.query('SELECT * FROM convidado WHERE id_convidado = $1', [id_convidado])
    .then(result => {
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Convidado não encontrado.' });
      } else {
        res.json(result.rows[0]);
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Erro ao obter o convidado.' });
    });
});


// PUT
app.put('/convidados/:id', (req, res) => {
  const id_convidado = req.params.id;
  const { id_professor, id_banca } = req.body;

  const query = 'UPDATE convidado SET id_professor = $1, id_banca = $2 WHERE id_convidado = $3 RETURNING *';
  const values = [id_professor, id_banca, id_convidado];

  db.query(query, values)
    .then(result => {
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Convidado não encontrado.' });
      } else {
        res.json(result.rows[0]);
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Erro ao atualizar o convidado.' });
    });
});


// PATCH
app.patch('/convidados/:id', (req, res) => {
  const id_convidado = req.params.id;
  const { id_professor, id_banca } = req.body;

  const query = 'UPDATE convidado SET id_professor = $1, id_banca = $2 WHERE id_convidado = $3 RETURNING *';
  const values = [id_professor, id_banca, id_convidado];

  db.query(query, values)
    .then(result => {
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Convidado não encontrado.' });
      } else {
        res.json(result.rows[0]);
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Erro ao atualizar o convidado.' });
    });
});


// DELETE
app.delete('/convidados/:id', (req, res) => {
  const id_convidado = req.params.id;

  db.query('DELETE FROM convidado WHERE id_convidado = $1', [id_convidado])
    .then(result => {
      if (result.rowCount === 0) {
        res.status(404).json({ error: 'Convidado não encontrado.' });
      } else {
        res.json({ message: 'Convidado excluído com sucesso.' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Erro ao excluir o convidado.' });
    });
});


app.get("/convidados_por_banca/:id_banca", async (req, res) => {
  const idBanca = req.params.id_banca;

  try {
    const result = await db.query(
      "SELECT * FROM convidado WHERE id_banca = $1",
      [idBanca]
    );

    const convidados = result.rows;

    const professoresPromises = convidados.map(async (convidado) => {
      const professorResult = await db.query(
        "SELECT * FROM professor WHERE id_professor = $1",
        [convidado.id_professor]
      );
      const professor = professorResult.rows[0];
      return {
        id_convidado: convidado.id_convidado,
        professor_navigation: professor,
        id_banca: convidado.id_banca,
      };
    });

    const professoresConvidados = await Promise.all(professoresPromises);

    res.json(professoresConvidados);
  } catch (error) {
    console.error("Erro ao buscar professores convidados por banca:", error);
    res.status(500).json({ error: "Erro ao buscar professores convidados por banca" });
  } 
  // finally {
  //   db.end();
  // }
});


const port = process.env.MSS_PORTA_CONVIDADOS

// app.listen(port, host, () => {
//   console.log(`Servidor rodando na porta ${port}`);
// });

// Inicie o servidor HTTPS
httpsServer.listen(port, host, () => {
  console.log(`Servidor CONVIDADOS HTTPS, rodando na porta ${port}`);
});