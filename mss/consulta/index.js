//MICROSERVIÇO CONSULTAS
const express = require("express");
const app = express();
app.use(express.json());

const baseConsulta = {}

const funcoes = {
  ProfessorCriado: (evento) => {
    const professor = evento.dados;
    console.log("ID DO PROFESSOR: " + professor.idProfessor)
    baseConsulta[professor.idProfessor] = { ...professor, cargosProfessor: [] };
  },
  CargoProfessorCriado: (evento) => {
    const cargoProfessor = evento.dados;
    console.log(cargoProfessor)
    if (baseConsulta[cargoProfessor.professorId]) {
      baseConsulta[cargoProfessor.professorId].cargosProfessor.push(cargoProfessor);
    }
  }
};

app.get("/professores", (req, res) => {
  res.status(200).send(baseConsulta);
});

app.get("/professores/:id", (req, res) => {
  const professorId = req.params.id;
  const professor = baseConsulta[professorId];
  if (professor) {
    res.status(200).send(professor);
  } else {
    res.status(404).send({ message: "Professor não encontrado" });
  }
});

app.post("/eventos", (req, res) => {
  const evento = req.body;
  if (funcoes[evento.tipo]) {
    funcoes[evento.tipo](evento);
  }
  res.status(200).send(baseConsulta);
});

app.listen(4101, () => console.log("consultas: porta 4101"));