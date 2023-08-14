const bodyParser = require('body-parser');
const express = require('express')
const app = express();
app.use(bodyParser.json());
const axios = require('axios')

const cargosPorProfessorId = {};

const { v4: uuidv4 } = require('uuid')

app.put('/professores/:id/cargos', async (req, res) => {

    const id_Cargo_Prof = uuidv4();
    const { cargo } = req.body
    const cargosDoProfessor = cargosPorProfessorId[req.params.id] || [];

    cargosDoProfessor.push({ id: id_Cargo_Prof, cargo })

    cargosPorProfessorId[req.params.id] = cargosDoProfessor;

    await axios.post('http://localhost:4100/eventos', {
      tipo: "CargoProfessorCriado",
      dados: {
         id_Cargo_Prof, cargo, professorId: req.params.id
      }
    })
    res.status(201).send(cargosDoProfessor)
  })

app.get('/professores/:id/cargos', (req, res) => {
  res.send(cargosPorProfessorId[req.params.id] || [])
})

app.post("/eventos", (req, res) => {
  console.log(req.body);
  res.status(200).send({ msg: "OK" })
})

app.listen(4002, (() => {
  console.log('cargosProfesssor: 4002');
}))