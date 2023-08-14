const bodyParser = require('body-parser');
const express = require('express');
const app = express();
app.use(bodyParser.json());
const aluno = {}
let idAluno = 0;

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

app.listen(4000, () => {
  console.log('alunos: porta 4000');
});