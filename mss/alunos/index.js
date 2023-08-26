const express = require('express');
const bodyParser = require('body-parser');
var { Client } = require('pg');
const app = express();
require('dotenv').config({ path: '../../.env' });
app.use(bodyParser.json());

const db = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_SERVER,
  database: process.env.DB_USER,
  password: process.env.DB_PWD,
  port: process.env.DB_PORT
})

db.connect()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida');
  })
  .catch((err) => {
    console.error('Erro ao conectar ao banco de dados', err)
  })



app.post('/alunos', async (req, res) => {
  try {
    const { ra, nome, email, curso, periodo } = req.body;
    await db.query('INSERT INTO ALUNO (ra, nome, email, curso, periodo) VALUES ($1, $2, $3, $4, $5)', [ra, nome, email, curso, periodo]);

    res.status(201).json({ message: 'Aluno cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar o aluno:', error);
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
});


app.put('/alunos/:idAluno', async (req, res) => {
  const idAluno = req.params.idAluno;
  const { ra, nome, email, curso, periodo } = req.body;

  try {
    await db.query('UPDATE ALUNO SET ra = $1, nome = $2, email = $3, curso = $4, periodo = $5 WHERE idAluno = $6', [ra, nome, email, curso, periodo, idAluno]);
    res.status(200).json({ message: `Aluno com ID ${idAluno} atualizado com sucesso!` });
  } catch (error) {
    console.error(`Erro ao atualizar aluno com ID ${idAluno}:`, error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


app.delete('/alunos/:idAluno', async (req, res) => {
  const idAluno = req.params.idAluno;

  try {
    await db.query('DELETE FROM ALUNO WHERE idAluno = $1', [idAluno]);
    res.status(200).json({ message: `Aluno com ID ${idAluno} deletado com sucesso!` });
  } catch (error) {
    console.error(`Erro ao deletar aluno com ID ${idAluno}:`, error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


app.get('/alunos', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM ALUNO');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


app.get('/alunos/:idAluno', async (req, res) => {
  const idAluno = req.params.idAluno;

  try {
    const result = await db.query('SELECT * FROM ALUNO WHERE idAluno = $1', [idAluno]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: `Aluno com ID ${idAluno} não encontrado.` });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error(`Erro ao buscar aluno com ID ${idAluno}:`, error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});



app.listen(4000, () => {
  console.log('alunos: porta 4000');
});