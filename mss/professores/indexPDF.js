const bodyParser = require('body-parser');
const express = require('express');
const app = express();
app.use(bodyParser.json());
const axios = require("axios")

const professor = {}
let idProfessor = 0;

app.get('/professores', (req, res) => {
  res.send(professor)
})

app.put('/professores', async (req, res) => {
  idProfessor++;
  const { nome, email } = req.body;
  professor[idProfessor] = {
    idProfessor, nome, email
  }
  await axios.post("http://localhost:4100/eventos", {
    tipo: "ProfessorCriado",
    dados: {
      idProfessor, nome, email
    },
  })
  res.status(201).send(professor[idProfessor])
})

app.post("/eventos", (req, res) => {
  console.log("4001 " + req.body.dados.idProfessor);
  res.status(200).send({ msg: "OK" })
})

app.listen(4001, () => {
  console.log('professores: 4001');
})