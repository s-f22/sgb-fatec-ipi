const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config({ path: '../../.env' });
const app = express();
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

const port = process.env.MSS_PORTA_HORARIO_AULA;

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


app.post('/horario_aula', async (req, res) => {
  try {
    const { id_professor, id_dia_aula, entrada, saida } = req.body;

    const query = 'INSERT INTO horario_aula (id_professor, id_dia_aula, entrada, saida) VALUES ($1, $2, $3, $4) RETURNING id_horario_aula, id_professor, id_dia_aula, entrada, saida';
    const values = [id_professor, id_dia_aula, entrada, saida];

    const result = await db.query(query, values);

    const horarioAula = {
      id_horario_aula: result.rows[0].id_horario_aula,
      id_professor: result.rows[0].id_professor,
      id_dia_aula: result.rows[0].id_dia_aula,
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
    const result = await db.query('SELECT * FROM horario_aula');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/horario_aula/:id_horario_aula', async (req, res) => {
  const id_horario_aula = req.params.id_horario_aula;

  try {
    const result = await db.query('SELECT * FROM horario_aula WHERE id_horario_aula = $1', [id_horario_aula]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: `Horário de aula com ID ${id_horario_aula} não encontrado.` });
    } else {
      const horarioAula = {
        id_horario_aula: result.rows[0].idhorarioaula,
        id_professor: result.rows[0].idprofessor,
        id_dia_aula: result.rows[0].iddiaaula,
        entrada: result.rows[0].entrada,
        saida: result.rows[0].saida
      };
      res.status(200).json(horarioAula);
    }
  } catch (error) {
    console.error(`Erro ao buscar horário de aula com ID ${id_horario_aula}:`, error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.put('/horario_aula/:id_horario_aula', async (req, res) => {
  try {
    const id_horario_aula = req.params.id_horario_aula;
    const { id_professor, id_dia_aula, entrada, saida } = req.body;
    const result = await db.query(
      'UPDATE horario_aula SET id_professor=$1, id_dia_aula=$2, entrada=$3, saida=$4 WHERE id_horario_aula=$5 RETURNING *',
      [id_professor, id_dia_aula, entrada, saida, id_horario_aula]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.delete('/horario_aula/:id_horario_aula', async (req, res) => {
  try {
    const id_horario_aula = req.params.id_horario_aula;

    // Validar se id_horario_aula é um número
    if (isNaN(id_horario_aula)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const result = await db.query('DELETE FROM horario_aula WHERE id_horario_aula=$1', [id_horario_aula]);

    // Verificar se algum registro foi excluído
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'ID não encontrado' });
    }

    res.json({ message: 'Horário de aula deletado com sucesso' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
