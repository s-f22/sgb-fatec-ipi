const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config({ path: '../../.env' });
const app = express();
app.use(bodyParser.json());

const port = process.env.MSS_PORTA_HORARIO_AULA;

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

app.post('/horario_aula', async (req, res) => {
  try {
    const { idProfessor, idDiaAula, entrada, saida } = req.body;

    const query = 'INSERT INTO horario_aula (idProfessor, idDiaAula, entrada, saida) VALUES ($1, $2, $3, $4) RETURNING idHorarioAula, idProfessor, idDiaAula, entrada, saida';
    const values = [idProfessor, idDiaAula, entrada, saida];

    const result = await pool.query(query, values);

    const horarioAula = {
      idHorarioAula: result.rows[0].idhorarioaula,
      idProfessor: result.rows[0].idprofessor,
      idDiaAula: result.rows[0].iddiaaula,
      entrada: result.rows[0].entrada,
      saida: result.rows[0].saida
    };

    res.status(201).json({ message: 'Horário de aula cadastrado com sucesso!', horarioAula });
  } catch (error) {
    console.error('Erro ao cadastrar o horário de aula:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/horario_aula', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM horario_aula');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/horario_aula/:idHorarioAula', async (req, res) => {
  const idHorarioAula = req.params.idHorarioAula;

  try {
    const result = await pool.query('SELECT * FROM horario_aula WHERE idHorarioAula = $1', [idHorarioAula]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: `Horário de aula com ID ${idHorarioAula} não encontrado.` });
    } else {
      const horarioAula = {
        idHorarioAula: result.rows[0].idhorarioaula,
        idProfessor: result.rows[0].idprofessor,
        idDiaAula: result.rows[0].iddiaaula,
        entrada: result.rows[0].entrada,
        saida: result.rows[0].saida
      };
      res.status(200).json(horarioAula);
    }
  } catch (error) {
    console.error(`Erro ao buscar horário de aula com ID ${idHorarioAula}:`, error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.put('/horario_aula/:idHorarioAula', async (req, res) => {
  try {
    const idHorarioAula = req.params.idHorarioAula;
    const { idProfessor, idDiaAula, entrada, saida } = req.body;
    const result = await pool.query(
      'UPDATE horario_aula SET idProfessor=$1, idDiaAula=$2, entrada=$3, saida=$4 WHERE idHorarioAula=$5 RETURNING *',
      [idProfessor, idDiaAula, entrada, saida, idHorarioAula]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.delete('/horario_aula/:idHorarioAula', async (req, res) => {
  try {
    const idHorarioAula = req.params.idHorarioAula;
    const result = await pool.query('DELETE FROM horario_aula WHERE idHorarioAula=$1', [idHorarioAula]);
    res.json({ message: 'Horário de aula deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
