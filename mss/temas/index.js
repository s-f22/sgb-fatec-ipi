const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config({ path: '../../.env' });
const app = express();
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());

const port = process.env.MSS_PORTA_TEMAS; // Alterado para a porta correta

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const VerificarToken = require('../middlewares/VerificarToken.js');

// Configuração do banco de dados
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_SERVER,
  database: process.env.DB_USER,
  password: process.env.DB_PWD,
  port: process.env.DB_PORT,
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.post('/temas', async (req, res) => { // Alterado para '/tema'
  try {
    const { id_autor, titulo, descricao } = req.body; // Alterado para os campos corretos
    const data_cadastro = new Date().toISOString()

    const query = 'INSERT INTO tema (id_autor, titulo, descricao, data_cadastro) VALUES ($1, $2, $3, $4) RETURNING id_tema, id_autor, titulo, descricao, data_cadastro'; // Alterado para inserir na tabela "tema"
    const values = [id_autor, titulo, descricao, data_cadastro]; // Alterado para os campos corretos

    const result = await pool.query(query, values);

    const tema = {
      id_tema: result.rows[0].id_tema,
      id_autor: result.rows[0].id_autor,
      titulo: result.rows[0].titulo,
      descricao: result.rows[0].descricao,
      data_cadastro: result.rows[0].data_cadastro
    };

    res.status(201).json({ message: 'Tema cadastrado com sucesso!', tema });
  } catch (error) {
    console.error('Erro ao cadastrar o tema:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/temas', async (req, res) => { // Alterado para '/tema'
  try {
    const result = await pool.query('SELECT * FROM tema'); // Alterado para selecionar da tabela "tema"
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/tema/:id_tema', async (req, res) => { // Alterado para '/tema'
  const id_tema = req.params.id_tema;

  try {
    const result = await pool.query('SELECT * FROM tema WHERE id_tema = $1', [id_tema]); // Alterado para buscar na tabela "tema"
    if (result.rows.length === 0) {
      res.status(404).json({ error: `Tema com ID ${id_tema} não encontrado.` });
    } else {
      const tema = {
        id_tema: result.rows[0].id_tema,
        id_autor: result.rows[0].id_autor,
        titulo: result.rows[0].titulo,
        descricao: result.rows[0].descricao,
        data_cadastro: result.rows[0].data_cadastro
      };
      res.status(200).json(tema);
    }
  } catch (error) {
    console.error(`Erro ao buscar tema com ID ${id_tema}:`, error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.put('/tema/:id_tema', async (req, res) => { // Alterado para '/tema'
  try {
    const id_tema = req.params.id_tema;
    const { id_autor, titulo, descricao, data_cadastro } = req.body; // Alterado para os campos corretos
    const result = await pool.query(
      'UPDATE tema SET id_autor=$1, titulo=$2, descricao=$3, data_cadastro=$4 WHERE id_tema=$5 RETURNING *',
      [id_autor, titulo, descricao, data_cadastro, id_tema] // Alterado para os campos corretos
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.delete('/tema/:id_tema', async (req, res) => { // Alterado para '/tema'
  try {
    const id_tema = req.params.id_tema;
    const result = await pool.query('DELETE FROM tema WHERE id_tema = $1', [id_tema]); // Alterado para deletar da tabela "tema"

    if (result.rowCount === 1) {
      res.json({ message: 'Tema deletado com sucesso' });
    } else {
      res.status(404).json({ error: 'Tema não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao deletar tema:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
