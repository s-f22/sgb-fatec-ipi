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



// GET - Listar todas as avaliações
app.get('/avaliacoes', async (req, res) => {
  try {
    const avaliacoes = await db.query('SELECT * FROM avaliacao');
    res.json(avaliacoes.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar as avaliações' });
  }
});

// GET - Obter uma avaliação por ID
app.get('/avaliacoes/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const avaliacao = await db.query('SELECT * FROM avaliacao WHERE id_avaliacao = $1', [id]);
    if (avaliacao.rows.length === 0) {
      res.status(404).json({ error: 'Avaliação não encontrada' });
    } else {
      res.json(avaliacao.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter a avaliação' });
  }
});

// POST - Criar uma nova avaliação
app.post('/avaliacoes', async (req, res) => {
  const { id_trabalho, id_professor, valor, comentario } = req.body;
  try {
    const newAvaliacao = await db.query(
      'INSERT INTO avaliacao (id_trabalho, id_professor, valor, comentario) VALUES ($1, $2, $3, $4) RETURNING *',
      [id_trabalho, id_professor, valor, comentario]
    );
    res.status(201).json(newAvaliacao.rows[0]);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar a avaliação' });
  }
});

// PUT - Atualizar uma avaliação por ID
app.put('/avaliacoes/:id', async (req, res) => {
  const id = req.params.id;
  const { valor, comentario } = req.body;
  try {
    const updatedAvaliacao = await db.query(
      'UPDATE avaliacao SET valor = $1, comentario = $2 WHERE id_avaliacao = $3 RETURNING *',
      [valor, comentario, id]
    );
    if (updatedAvaliacao.rows.length === 0) {
      res.status(404).json({ error: 'Avaliação não encontrada' });
    } else {
      res.json(updatedAvaliacao.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar a avaliação' });
  }
});

// DELETE - Excluir uma avaliação por ID
app.delete('/avaliacoes/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query('DELETE FROM avaliacao WHERE id_avaliacao = $1', [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Avaliação não encontrada' });
    } else {
      res.json({ message: 'Avaliação excluída com sucesso' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir a avaliação' });
  }
});

// PATCH - Atualizar atributos específicos de uma avaliação por ID
app.patch('/avaliacoes/:id', async (req, res) => {
  const id = req.params.id;
  const { valor, comentario } = req.body;
  const updateFields = [];
  const values = [];

  if (valor !== undefined) {
    updateFields.push('valor = $1');
    values.push(valor);
  }
  if (comentario !== undefined) {
    updateFields.push('comentario = $2');
    values.push(comentario);
  }

  if (updateFields.length === 0) {
    res.status(400).json({ error: 'Nenhum campo para atualizar fornecido' });
  } else {
    values.push(id);
    try {
      const updateQuery = `UPDATE avaliacao SET ${updateFields.join(', ')} WHERE id_avaliacao = $${updateFields.length + 1} RETURNING *`;
      const updatedAvaliacao = await db.query(updateQuery, values);
      if (updatedAvaliacao.rows.length === 0) {
        res.status(404).json({ error: 'Avaliação não encontrada' });
      } else {
        res.json(updatedAvaliacao.rows[0]);
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar a avaliação' });
    }
  }
});


app.listen(process.env.MSS_PORTA_AVALIACAO, () => {
  console.log(`avaliacao: porta ${process.env.MSS_PORTA_AVALIACAO}`);
});