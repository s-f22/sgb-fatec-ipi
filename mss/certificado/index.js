const express = require("express");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config({ path: "../../.env" });
app.use(bodyParser.json());
const { Pool } = require("pg");

const jwt = require("jsonwebtoken");
const cors = require("cors");
app.use(cors());

const VerificarToken = require("../middlewares/VerificarToken.js");
//const AuthCheck = require('../middlewares/AuthCheck.js');

const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_SERVER,
  database: process.env.DB_USER,
  password: process.env.DB_PWD,
  port: process.env.DB_PORT,
});

// GET - Listar todos os certificados
app.get("/certificados", async (req, res) => {
  try {
    const certificados = await db.query("SELECT * FROM certificado");
    res.json(certificados.rows);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar os certificados" });
  }
});

// GET - Obter um certificado por ID
app.get("/certificados/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const certificado = await db.query(
      "SELECT * FROM certificado WHERE id_certificado = $1",
      [id]
    );
    if (certificado.rows.length === 0) {
      res.status(404).json({ error: "Certificado não encontrado" });
    } else {
      res.json(certificado.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter o certificado" });
  }
});

// POST - Criar um novo certificado
app.post("/certificados", async (req, res) => {
  const { id_prof_emissor, id_banca, data_hora_emissao, comentario } = req.body;
  try {
    const newCertificado = await db.query(
      "INSERT INTO certificado (id_prof_emissor, id_banca, data_hora_emissao, comentario) VALUES ($1, $2, $3, $4) RETURNING *",
      [id_prof_emissor, id_banca, data_hora_emissao, comentario]
    );
    res.status(201).json(newCertificado.rows[0]);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar o certificado" });
  }
});

// PUT - Atualizar um certificado por ID
app.put("/certificados/:id", async (req, res) => {
  const id = req.params.id;
  const { data_hora_emissao, comentario } = req.body;
  try {
    const updatedCertificado = await db.query(
      "UPDATE certificado SET data_hora_emissao = $1, comentario = $2 WHERE id_certificado = $3 RETURNING *",
      [data_hora_emissao, comentario, id]
    );
    if (updatedCertificado.rows.length === 0) {
      res.status(404).json({ error: "Certificado não encontrado" });
    } else {
      res.json(updatedCertificado.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o certificado" });
  }
});

// DELETE - Excluir um certificado por ID
app.delete("/certificados/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query(
      "DELETE FROM certificado WHERE id_certificado = $1",
      [id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Certificado não encontrado" });
    } else {
      res.json({ message: "Certificado excluído com sucesso" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o certificado" });
  }
});

// PATCH - Atualizar atributos específicos de um certificado por ID
app.patch("/certificados/:id", async (req, res) => {
  const id = req.params.id;
  const { data_hora_emissao, comentario } = req.body;
  const updateFields = [];
  const values = [];

  if (data_hora_emissao !== undefined) {
    updateFields.push("data_hora_emissao = $1");
    values.push(data_hora_emissao);
  }
  if (comentario !== undefined) {
    updateFields.push("comentario = $2");
    values.push(comentario);
  }

  if (updateFields.length === 0) {
    res.status(400).json({ error: "Nenhum campo para atualizar fornecido" });
  } else {
    values.push(id);
    try {
      const updateQuery = `UPDATE certificado SET ${updateFields.join(
        ", "
      )} WHERE id_certificado = $${updateFields.length + 1} RETURNING *`;
      const updatedCertificado = await db.query(updateQuery, values);
      if (updatedCertificado.rows.length === 0) {
        res.status(404).json({ error: "Certificado não encontrado" });
      } else {
        res.json(updatedCertificado.rows[0]);
      }
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar o certificado" });
    }
  }
});


app.listen(process.env.MSS_PORTA_CERTIFICADO, () => {
  console.log(`certificado: porta ${process.env.MSS_PORTA_CERTIFICADO}`);
});
