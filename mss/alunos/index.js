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
  port: 5432
})

db.connect()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida');
  })
  .catch((err) => {
    console.error('Erro ao conectar ao banco de dados', err)
  })


const aluno = {}
let idAluno = 0;


app.get('/alunos', (req, res) => {
  res.send(aluno)
});

app.post('/alunos', async (req, res) => {
  try {
    const { ra, nome, email, curso, periodo } = req.body;
    await db.query('INSERT INTO ALUNO (ra, nome, email, curso, periodo) VALUES ($1, $2, $3, $4, $5)', [ra, nome, email, curso, periodo]);

    res.status(201).json({ message: 'Aluno cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar o aluno:', error);
    res.status(500).json({error: 'Erro interno do servidor'})
  }
});

// app.put('/alunos', (req, res) => {
//   idAluno++;
//   const { ra, nome, email, curso } = req.body;
//   aluno[idAluno] = {
//     ra, nome, email, curso
//   }
//   res.status(201).send(aluno[idAluno]);
// });



app.listen(4000, () => {
  console.log('alunos: porta 4000');
});