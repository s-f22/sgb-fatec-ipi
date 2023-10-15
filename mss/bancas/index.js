const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config({ path: '../../.env' });
app.use(bodyParser.json());
const { Pool } = require('pg');

const jwt = require('jsonwebtoken');
const cors = require('cors');
app.use(cors());


const VerificarToken = require('../middlewares/VerificarToken.js');
//const AuthCheck = require('../middlewares/AuthCheck.js');


const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_SERVER,
  database: process.env.DB_USER,
  password: process.env.DB_PWD,
  port: process.env.DB_PORT,
});

// POST
app.post('/bancas', (req, res) => {
  const { id_trabalho, data_hora, comentarios } = req.body;

  const query = 'INSERT INTO banca (id_trabalho, data_hora, comentarios) VALUES ($1, $2, $3) RETURNING *';
  const values = [id_trabalho, data_hora, comentarios];

  db.query(query, values)
    .then(result => {
      res.status(201).json(result.rows[0]);
    })
    .catch(error => {
      res.status(500).json({ error: 'Erro ao criar a banca.', error });
    });
});



// GET
app.get('/bancas', (req, res) => {
  db.query('SELECT * FROM banca')
    .then(result => {
      res.json(result.rows);
    })
    .catch(error => {
      res.status(500).json({ error: 'Erro ao obter as bancas.' });
    });
});



// GET BY ID
app.get('/bancas/:id', (req, res) => {
  const id_banca = req.params.id;

  db.query('SELECT * FROM banca WHERE id_banca = $1', [id_banca])
    .then(result => {
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Banca não encontrada.' });
      } else {
        res.json(result.rows[0]);
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Erro ao obter a banca.' });
    });
});



// PUT
app.put('/bancas/:id', (req, res) => {
  const id_banca = req.params.id;
  const { id_trabalho, data_hora, comentarios } = req.body;

  const query = 'UPDATE banca SET id_trabalho = $1, data_hora = $2, comentarios = $3 WHERE id_banca = $4 RETURNING *';
  const values = [id_trabalho, data_hora, comentarios, id_banca];

  db.query(query, values)
    .then(result => {
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Banca não encontrada.' });
      } else {
        res.json(result.rows[0]);
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Erro ao atualizar a banca.' });
    });
});



// PATCH
app.patch('/bancas/:id', (req, res) => {
  const id_banca = req.params.id;
  const { id_trabalho, data_hora, comentarios } = req.body;

  const query = 'UPDATE banca SET id_trabalho = $1, data_hora = $2, comentarios = $3 WHERE id_banca = $4 RETURNING *';
  const values = [id_trabalho, data_hora, comentarios, id_banca];

  db.query(query, values)
    .then(result => {
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Banca não encontrada.' });
      } else {
        res.json(result.rows[0]);
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Erro ao atualizar a banca.' });
    });
});


// DELETE
app.delete('/bancas/:id', (req, res) => {
  const id_banca = req.params.id;

  db.query('DELETE FROM banca WHERE id_banca = $1', [id_banca])
    .then(result => {
      if (result.rowCount === 0) {
        res.status(404).json({ error: 'Banca não encontrada.' });
      } else {
        res.json({ message: 'Banca excluída com sucesso.' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Erro ao excluir a banca.' });
    });
});


app.get("/bancas_navigation/:id", async (req, res) => {
  try {
    const bancaId = req.params.id;

    // Consultar a banca com base no ID da banca
    const bancaQuery = "SELECT * FROM banca WHERE id_banca = $1";
    const bancaResult = await db.query(bancaQuery, [bancaId]);

    if (bancaResult.rows.length === 0) {
      return res.status(404).json({ error: "Banca não encontrada" });
    }

    const banca = bancaResult.rows[0];

    // Consultar o trabalho associado à banca com base no ID do trabalho
    const trabalhoQuery = "SELECT * FROM trabalho WHERE id_trabalho = $1";
    const trabalhoResult = await db.query(trabalhoQuery, [banca.id_trabalho]);

    if (trabalhoResult.rows.length === 0) {
      return res.status(404).json({ error: "Trabalho não encontrado" });
    }

    const trabalho_navigation = trabalhoResult.rows[0];

    // Consultar o professor associado ao trabalho com base no ID do orientador
    const professorQuery = "SELECT * FROM professor WHERE id_professor = $1";
    const professorResult = await db.query(professorQuery, [trabalho_navigation.id_orientador]);

    if (professorResult.rows.length === 0) {
      return res.status(404).json({ error: "Professor não encontrado" });
    }

    const orientador_navigation = professorResult.rows[0];

    // Consultar o tema associado ao trabalho com base no ID do tema
    const temaQuery = "SELECT * FROM tema WHERE id_tema = $1";
    const temaResult = await db.query(temaQuery, [trabalho_navigation.id_tema]);

    if (temaResult.rows.length === 0) {
      return res.status(404).json({ error: "Tema não encontrado" });
    }

    const tema_navigation = temaResult.rows[0];

    // Consultar o aluno associado ao tema com base no ID do autor do tema
    const alunoQuery = "SELECT * FROM aluno WHERE id_aluno = $1";
    const alunoResult = await db.query(alunoQuery, [tema_navigation.id_autor]);

    if (alunoResult.rows.length === 0) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }

    const autor_navigation = alunoResult.rows[0];

    // Construir a resposta conforme a estrutura desejada
    const response = {
      id_banca: banca.id_banca,
      trabalho_navigation: {
        id_trabalho: trabalho_navigation.id_trabalho,
        orientador_navigation: orientador_navigation,
        tema_navigation: {
          id_tema: tema_navigation.id_tema,
          autor_navigation: autor_navigation,
          titulo: tema_navigation.titulo,
          descricao: tema_navigation.descricao,
          data_cadastro: tema_navigation.data_cadastro,
        },
        nota_final: trabalho_navigation.nota_final,
        previsao_defesa: trabalho_navigation.previsao_defesa,
        banca_agendada: trabalho_navigation.banca_agendada,
      },
      data_hora: banca.data_hora,
      comentarios: banca.comentarios,
    };

    res.json(response);
  } catch (error) {
    console.error("Erro ao buscar banca, trabalho, professor, tema e aluno:", error);
    res.status(500).json({ error: "Erro ao buscar banca, trabalho, professor, tema e aluno" });
  }
});


app.get("/bancas_navigation", async (req, res) => {
  try {
    // Consultar todas as bancas
    const bancasQuery = "SELECT * FROM banca";
    const bancasResult = await db.query(bancasQuery);

    if (bancasResult.rows.length === 0) {
      return res.status(404).json({ error: "Nenhuma banca encontrada" });
    }

    const bancas = bancasResult.rows.map(async (banca) => {
      // Consultar o trabalho associado à banca com base no ID do trabalho
      const trabalhoQuery = "SELECT * FROM trabalho WHERE id_trabalho = $1";
      const trabalhoResult = await db.query(trabalhoQuery, [banca.id_trabalho]);

      if (trabalhoResult.rows.length === 0) {
        return res.status(404).json({ error: "Trabalho não encontrado" });
      }

      const trabalho_navigation = trabalhoResult.rows[0];

      // Consultar o professor associado ao trabalho com base no ID do orientador
      const professorQuery = "SELECT * FROM professor WHERE id_professor = $1";
      const professorResult = await db.query(professorQuery, [trabalho_navigation.id_orientador]);

      if (professorResult.rows.length === 0) {
        return res.status(404).json({ error: "Professor não encontrado" });
      }

      const orientador_navigation = professorResult.rows[0];

      // Consultar o tema associado ao trabalho com base no ID do tema
      const temaQuery = "SELECT * FROM tema WHERE id_tema = $1";
      const temaResult = await db.query(temaQuery, [trabalho_navigation.id_tema]);

      if (temaResult.rows.length === 0) {
        return res.status(404).json({ error: "Tema não encontrado" });
      }

      const tema_navigation = temaResult.rows[0];

      // Consultar o aluno associado ao tema com base no ID do autor do tema
      const alunoQuery = "SELECT * FROM aluno WHERE id_aluno = $1";
      const alunoResult = await db.query(alunoQuery, [tema_navigation.id_autor]);

      if (alunoResult.rows.length === 0) {
        return res.status(404).json({ error: "Aluno não encontrado" });
      }

      const autor_navigation = alunoResult.rows[0];

      // Construir a resposta conforme a estrutura desejada
      const response = {
        id_banca: banca.id_banca,
        trabalho_navigation: {
          id_trabalho: trabalho_navigation.id_trabalho,
          orientador_navigation: orientador_navigation,
          tema_navigation: {
            id_tema: tema_navigation.id_tema,
            autor_navigation: autor_navigation,
            titulo: tema_navigation.titulo,
            descricao: tema_navigation.descricao,
            data_cadastro: tema_navigation.data_cadastro,
          },
          nota_final: trabalho_navigation.nota_final,
          previsao_defesa: trabalho_navigation.previsao_defesa,
          banca_agendada: trabalho_navigation.banca_agendada,
        },
        data_hora: banca.data_hora,
        comentarios: banca.comentarios,
      };

      return response;
    });

    // Esperar que todas as consultas sejam concluídas
    const bancasResponse = await Promise.all(bancas);

    res.json(bancasResponse);
  } catch (error) {
    console.error("Erro ao buscar bancas, trabalho, professor, tema e aluno:", error);
    res.status(500).json({ error: "Erro ao buscar bancas, trabalho, professor, tema e aluno" });
  }
});





app.listen(process.env.MSS_PORTA_BANCAS, () => {
  console.log(`bancas: porta ${process.env.MSS_PORTA_BANCAS}`);
});