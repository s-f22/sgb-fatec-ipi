const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config({ path: '../../.env' });
const app = express();
app.use(bodyParser.json());

const port = process.env.MSS_PORTA_DIA_AULA;

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

app.post('/dia_aula', async (req, res) => {
  try {
    const { idProfessor, diaSemana } = req.body;

    const query = 'INSERT INTO dia_aula (idProfessor, diaSemana) VALUES ($1, $2) RETURNING idDiaAula, idProfessor, diaSemana';
    const values = [idProfessor, diaSemana];

    const result = await pool.query(query, values);

    const diaAula = {
      idDiaAula: result.rows[0].iddiaaula,
      idProfessor: result.rows[0].idprofessor,
      diaSemana: result.rows[0].diasemana
    };

    res.status(201).json({ message: 'Dia de aula cadastrado com sucesso!', diaAula });
  } catch (error) {
    console.error('Erro ao cadastrar o dia de aula:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/dia_aula', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM dia_aula');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/dia_aula/:idDiaAula', async (req, res) => {
  const idDiaAula = req.params.idDiaAula;

  try {
    const result = await pool.query('SELECT * FROM dia_aula WHERE idDiaAula = $1', [idDiaAula]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: `Dia de aula com ID ${idDiaAula} não encontrado.` });
    } else {
      const diaAula = {
        idDiaAula: result.rows[0].iddiaaula,
        idProfessor: result.rows[0].idprofessor,
        diaSemana: result.rows[0].diasemana
      };
      res.status(200).json(diaAula);
    }
  } catch (error) {
    console.error(`Erro ao buscar dia de aula com ID ${idDiaAula}:`, error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.put('/dia_aula/:idDiaAula', async (req, res) => {
  try {
    const idDiaAula = req.params.idDiaAula;
    const { idProfessor, diaSemana } = req.body;
    const result = await pool.query(
      'UPDATE dia_aula SET idProfessor=$1, diaSemana=$2 WHERE idDiaAula=$3 RETURNING *',
      [idProfessor, diaSemana, idDiaAula]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.delete('/dia_aula/:idDiaAula', async (req, res) => {
  try {
    const idDiaAula = req.params.idDiaAula;
    const result = await pool.query('DELETE FROM dia_aula WHERE idDiaAula=$1', [idDiaAula]);
    res.json({ message: 'Dia de aula deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
