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


// GET - Listar todas as atas de orientação
app.get('/atas_orientacao', async (req, res) => {
  try {
    const atas = await db.query('SELECT * FROM ata_orientacao');
    res.json(atas.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar as atas de orientação' });
  }
});

// GET - Obter uma ata de orientação por ID
app.get('/atas_orientacao/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const ata = await db.query('SELECT * FROM ata_orientacao WHERE id_ata = $1', [id]);
    if (ata.rows.length === 0) {
      res.status(404).json({ error: 'Ata de orientação não encontrada' });
    } else {
      res.json(ata.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter a ata de orientação' });
  }
});

// POST - Criar uma nova ata de orientação
app.post('/atas_orientacao', async (req, res) => {
  const { id_trabalho, data_reuniao, presencial, titulo, descricao } = req.body;
  try {
    const newAta = await db.query(
      'INSERT INTO ata_orientacao (id_trabalho, data_reuniao, presencial, titulo, descricao) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id_trabalho, data_reuniao, presencial, titulo, descricao]
    );
    res.status(201).json(newAta.rows[0]);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar a ata de orientação' });
  }
});

// PUT - Atualizar uma ata de orientação por ID
app.put('/atas_orientacao/:id', async (req, res) => {
  const id = req.params.id;
  const { data_reuniao, presencial, titulo, descricao } = req.body;
  try {
    const updatedAta = await db.query(
      'UPDATE ata_orientacao SET data_reuniao = $1, presencial = $2, titulo = $3, descricao = $4 WHERE id_ata = $5 RETURNING *',
      [data_reuniao, presencial, titulo, descricao, id]
    );
    if (updatedAta.rows.length === 0) {
      res.status(404).json({ error: 'Ata de orientação não encontrada' });
    } else {
      res.json(updatedAta.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar a ata de orientação' });
  }
});

// DELETE - Excluir uma ata de orientação por ID
app.delete('/atas_orientacao/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query('DELETE FROM ata_orientacao WHERE id_ata = $1', [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Ata de orientação não encontrada' });
    } else {
      res.json({ message: 'Ata de orientação excluída com sucesso' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir a ata de orientação' });
  }
});

// PATCH - Atualizar atributos específicos de uma ata de orientação por ID
app.patch('/atas_orientacao/:id', async (req, res) => {
  const id = req.params.id;
  const { data_reuniao, presencial, titulo, descricao } = req.body;
  const updateFields = [];
  const values = [];

  if (data_reuniao !== undefined) {
    updateFields.push('data_reuniao = $1');
    values.push(data_reuniao);
  }
  if (presencial !== undefined) {
    updateFields.push('presencial = $2');
    values.push(presencial);
  }
  if (titulo !== undefined) {
    updateFields.push('titulo = $3');
    values.push(titulo);
  }
  if (descricao !== undefined) {
    updateFields.push('descricao = $4');
    values.push(descricao);
  }

  if (updateFields.length === 0) {
    res.status(400).json({ error: 'Nenhum campo para atualizar fornecido' });
  } else {
    values.push(id);
    try {
      const updateQuery = `UPDATE ata_orientacao SET ${updateFields.join(', ')} WHERE id_ata = $${updateFields.length + 1} RETURNING *`;
      const updatedAta = await db.query(updateQuery, values);
      if (updatedAta.rows.length === 0) {
        res.status(404).json({ error: 'Ata de orientação não encontrada' });
      } else {
        res.json(updatedAta.rows[0]);
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar a ata de orientação' });
    }
  }
});



app.listen(process.env.MSS_PORTA_ATA, () => {
  console.log(`ata: porta ${process.env.MSS_PORTA_ATA}`);
});