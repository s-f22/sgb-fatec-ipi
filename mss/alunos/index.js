const bodyParser = require('body-parser');
const express = require('express');
require('dotenv').config({ path: '../../.env' });
var pg = require('pg');
const app = express();
app.use(bodyParser.json());

const aluno = {}
let idAluno = 0;

const url = process.env.DB_URL

app.get('/alunos', (req, res) => {
  res.send(aluno)
});

app.put('/alunos', (req, res) => {
  idAluno++;
  const { ra, nome, email, curso } = req.body;
  aluno[idAluno] = {
    ra, nome, email, curso
  }
  res.status(201).send(aluno[idAluno]);
});

var conString = url 
var client = new pg.Client(conString);
client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  client.query("INSERT INTO ALUNO (ra, nome, email, curso, periodo) VALUES ('1234567890123', 'João Silva', 'joao.silva@example.com', 'Engenharia de Computação','manhã')", function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0]);
    
    client.end();
  });
});

app.listen(4000, () => {
  console.log('alunos: porta 4000');
});