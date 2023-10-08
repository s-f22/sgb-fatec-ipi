const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config({ path: '../../.env' });
app.use(bodyParser.json());
const { Pool } = require('pg');

const jwt = require('jsonwebtoken');
const cors = require('cors');
app.use(cors());


const VerificarToken = require('../middlewares/VerificarToken.js');
//const AuthCheck = require('../middlewares/AuthCheck.js');


const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_SERVER,
  database: process.env.DB_USER,
  password: process.env.DB_PWD,
  port: process.env.DB_PORT,
});

// POST
app.post('/bancas', (req, res) => {
  const { id_trabalho, data_hora, comentarios } = req.body;

  const query = 'INSERT INTO banca (id_trabalho, data_hora, comentarios) VALUES ($1, $2, $3) RETURNING *';
  const values = [id_trabalho, data_hora, comentarios];

  db.query(query, values)
    .then(result => {
      res.status(201).json(result.rows[0]);
    })
    .catch(error => {
      res.status(500).json({ error: 'Erro ao criar a banca.', error });
    });
});



// GET
app.get('/bancas', (req, res) => {
  db.query('SELECT * FROM banca')
    .then(result => {
      res.json(result.rows);
    })
    .catch(error => {
      res.status(500).json({ error: 'Erro ao obter as bancas.' });
    });
});



// GET BY ID
app.get('/bancas/:id', (req, res) => {
  const id_banca = req.params.id;

  db.query('SELECT * FROM banca WHERE id_banca = $1', [id_banca])
    .then(result => {
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Banca não encontrada.' });
      } else {
        res.json(result.rows[0]);
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Erro ao obter a banca.' });
    });
});



// PUT
app.put('/bancas/:id', (req, res) => {
  const id_banca = req.params.id;
  const { id_trabalho, data_hora, comentarios } = req.body;

  const query = 'UPDATE banca SET id_trabalho = $1, data_hora = $2, comentarios = $3 WHERE id_banca = $4 RETURNING *';
  const values = [id_trabalho, data_hora, comentarios, id_banca];

  db.query(query, values)
    .then(result => {
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Banca não encontrada.' });
      } else {
        res.json(result.rows[0]);
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Erro ao atualizar a banca.' });
    });
});



// PATCH
app.patch('/bancas/:id', (req, res) => {
  const id_banca = req.params.id;
  const { id_trabalho, data_hora, comentarios } = req.body;

  const query = 'UPDATE banca SET id_trabalho = $1, data_hora = $2, comentarios = $3 WHERE id_banca = $4 RETURNING *';
  const values = [id_trabalho, data_hora, comentarios, id_banca];

  db.query(query, values)
    .then(result => {
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Banca não encontrada.' });
      } else {
        res.json(result.rows[0]);
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Erro ao atualizar a banca.' });
    });
});


// DELETE
app.delete('/bancas/:id', (req, res) => {
  const id_banca = req.params.id;

  db.query('DELETE FROM banca WHERE id_banca = $1', [id_banca])
    .then(result => {
      if (result.rowCount === 0) {
        res.status(404).json({ error: 'Banca não encontrada.' });
      } else {
        res.json({ message: 'Banca excluída com sucesso.' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Erro ao excluir a banca.' });
    });
});




app.listen(process.env.MSS_PORTA_BANCAS, () => {
  console.log(`bancas: porta ${process.env.MSS_PORTA_BANCAS}`);
});