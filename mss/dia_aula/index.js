const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config({ path: '../../.env' });
const app = express();
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

const port = process.env.MSS_PORTA_DIA_AULA;

// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');

// const VerificarToken = require('../middlewares/VerificarToken.js');

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

app.post('/dia_aula', async (req, res) => {
  try {
    const { id_professor, dia_semana } = req.body;

    const query = 'INSERT INTO dia_aula (id_professor, dia_semana) VALUES ($1, $2) RETURNING id_dia_aula, id_professor, dia_semana';
    const values = [id_professor, dia_semana];

    const result = await db.query(query, values);

    const diaAula = {
      id_dia_aula: result.rows[0].id_dia_aula,
      id_professor: result.rows[0].id_professor,
      dia_semana: result.rows[0].dia_semana
    };

    res.status(201).json({ message: 'Dia de aula cadastrado com sucesso!', diaAula });
  } catch (error) {
    console.error('Erro ao cadastrar o dia de aula:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/dia_aula', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM dia_aula');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/dia_aula/:id_dia_aula', async (req, res) => {
  const id_dia_aula = req.params.id_dia_aula;

  try {
    const result = await db.query('SELECT * FROM dia_aula WHERE id_dia_aula = $1', [id_dia_aula]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: `Dia de aula com ID ${id_dia_aula} não encontrado.` });
    } else {
      const diaAula = {
        id_dia_aula: result.rows[0].id_dia_aula,
        id_professor: result.rows[0].id_professor,
        dia_semana: result.rows[0].diasemana
      };
      res.status(200).json(diaAula);
    }
  } catch (error) {
    console.error(`Erro ao buscar dia de aula com ID ${id_dia_aula}:`, error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.put('/dia_aula/:id_dia_aula', async (req, res) => {
  try {
    const id_dia_aula = req.params.id_dia_aula;
    const { id_professor, dia_semana } = req.body;
    const result = await db.query(
      'UPDATE dia_aula SET id_professor=$1, dia_semana=$2 WHERE id_dia_aula=$3 RETURNING *',
      [id_professor, dia_semana, id_dia_aula]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.delete('/dia_aula/:id_dia_aula', async (req, res) => {
  try {
    const id_dia_aula = req.params.id_dia_aula;
    const result = await db.query('DELETE FROM dia_aula WHERE id_dia_aula = $1', [id_dia_aula]);

    if (result.rowCount === 1) {
      res.json({ message: 'Dia de aula deletado com sucesso' });
    } else {
      res.status(404).json({ error: 'Dia de aula não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao deletar dia de aula:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
