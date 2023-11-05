const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
require("dotenv").config({ path: "../../.env" });
const app = express();
const cors = require("cors");
app.use(bodyParser.json());
app.use(cors());

const port = process.env.MSS_PORTA_TEMAS; // Alterado para a porta correta

const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const VerificarToken = require("../middlewares/VerificarToken.js");

// Configuração do banco de dados
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_SERVER,
  database: process.env.DB_USER,
  password: process.env.DB_PWD,
  port: process.env.DB_PORT,
});

app.post("/temas", async (req, res) => {
  // Alterado para '/tema'
  try {
    const { id_autor, titulo, descricao } = req.body; // Alterado para os campos corretos
    const data_cadastro = new Date().toISOString();

    const query =
      "INSERT INTO tema (id_autor, titulo, descricao, data_cadastro) VALUES ($1, $2, $3, $4) RETURNING id_tema, id_autor, titulo, descricao, data_cadastro"; // Alterado para inserir na tabela "tema"
    const values = [id_autor, titulo, descricao, data_cadastro]; // Alterado para os campos corretos

    const result = await pool.query(query, values);

    const tema = {
      id_tema: result.rows[0].id_tema,
      id_autor: result.rows[0].id_autor,
      titulo: result.rows[0].titulo,
      descricao: result.rows[0].descricao,
      data_cadastro: result.rows[0].data_cadastro,
    };

    res.status(201).json({ message: "Tema cadastrado com sucesso!", tema });
  } catch (error) {
    console.error("Erro ao cadastrar o tema:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.get("/temas", async (req, res) => {
  // Alterado para '/tema'
  try {
    const result = await pool.query("SELECT * FROM tema"); // Alterado para selecionar da tabela "tema"
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.get("/tema/:id_tema", async (req, res) => {
  // Alterado para '/tema'
  const id_tema = req.params.id_tema;

  try {
    const result = await pool.query("SELECT * FROM tema WHERE id_tema = $1", [
      id_tema,
    ]); // Alterado para buscar na tabela "tema"
    if (result.rows.length === 0) {
      res.status(404).json({ error: `Tema com ID ${id_tema} não encontrado.` });
    } else {
      const tema = {
        id_tema: result.rows[0].id_tema,
        id_autor: result.rows[0].id_autor,
        titulo: result.rows[0].titulo,
        descricao: result.rows[0].descricao,
        data_cadastro: result.rows[0].data_cadastro,
      };
      res.status(200).json(tema);
    }
  } catch (error) {
    console.error(`Erro ao buscar tema com ID ${id_tema}:`, error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.put("/tema/:id_tema", async (req, res) => {
  // Alterado para '/tema'
  try {
    const id_tema = req.params.id_tema;
    const { id_autor, titulo, descricao, data_cadastro } = req.body; // Alterado para os campos corretos
    const result = await pool.query(
      "UPDATE tema SET id_autor=$1, titulo=$2, descricao=$3, data_cadastro=$4 WHERE id_tema=$5 RETURNING *",
      [id_autor, titulo, descricao, data_cadastro, id_tema] // Alterado para os campos corretos
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.delete("/tema/:id_tema", async (req, res) => {
  // Alterado para '/tema'
  try {
    const id_tema = req.params.id_tema;
    const result = await pool.query("DELETE FROM tema WHERE id_tema = $1", [
      id_tema,
    ]); // Alterado para deletar da tabela "tema"

    if (result.rowCount === 1) {
      res.json({ message: "Tema deletado com sucesso" });
    } else {
      res.status(404).json({ error: "Tema não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao deletar tema:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.patch('/tema/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, disponivel } = req.body;

  try {
    // Consulta para obter o tema atual
    const querySelect = 'SELECT * FROM tema WHERE id_tema = $1';
    const resultSelect = await pool.query(querySelect, [id]);

    if (resultSelect.rowCount !== 1) {
      res.status(404).json({ message: 'Tema não encontrado.' });
      return;
    }

    // Mesclar os valores atuais com os novos
    const temaAtual = resultSelect.rows[0];
    const novoTema = {
      titulo: titulo !== undefined ? titulo : temaAtual.titulo,
      descricao: descricao !== undefined ? descricao : temaAtual.descricao,
      disponivel:
        disponivel !== undefined ? disponivel : temaAtual.disponivel,
    };

    // Atualizar o tema com os novos valores mesclados
    const queryUpdate = `
      UPDATE tema
      SET
        titulo = $1,
        descricao = $2,
        disponivel = $3
      WHERE
        id_tema = $4
    `;

    const resultUpdate = await pool.query(queryUpdate, [
      novoTema.titulo,
      novoTema.descricao,
      novoTema.disponivel,
      id,
    ]);

    if (resultUpdate.rowCount === 1) {
      res.status(200).json({ message: 'Tema atualizado com sucesso!' });
    } else {
      res.status(500).json({ message: 'Erro ao atualizar o tema.' });
    }
  } catch (error) {
    console.error('Erro ao atualizar o tema:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get("/tema_navigation/:id", async (req, res) => {
  try {
    const temaId = req.params.id;

    // Consultar o tema com base no ID do tema
    const temaQuery = "SELECT * FROM tema WHERE id_tema = $1";
    const temaResult = await pool.query(temaQuery, [temaId]);

    if (temaResult.rows.length === 0) {
      return res.status(404).json({ error: "Tema não encontrado" });
    }

    const tema = temaResult.rows[0];

    // Consultar o aluno associado ao tema com base no ID do autor
    const alunoQuery = "SELECT * FROM aluno WHERE id_aluno = $1";
    const alunoResult = await pool.query(alunoQuery, [tema.id_autor]);

    if (alunoResult.rows.length === 0) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }

    const autor_navigation = alunoResult.rows[0];

    // Construir a resposta conforme a estrutura desejada
    const response = {
      id_tema: tema.id_tema,
      autor_navigation: autor_navigation,
      titulo: tema.titulo,
      descricao: tema.descricao,
      data_cadastro: tema.data_cadastro,
      disponivel: tema.disponivel
    };

    res.json(response);
  } catch (error) {
    console.error("Erro ao buscar tema e aluno:", error);
    res.status(500).json({ error: "Erro ao buscar tema e aluno" });
  }
});


// Endpoint para buscar a lista de temas com autor_navigation
app.get('/tema_navigation', async (req, res) => {
  try {
    const temas = await pool.query(`
      SELECT t.id_tema, t.titulo, t.descricao, t.data_cadastro, t.disponivel,
             a.id_aluno, a.user_id, a.ra, a.nome, a.email, a.curso, a.periodo, a.email_inst_verif, a.codigo, a.tipo_usuario, a.ativo
      FROM tema t
      JOIN aluno a ON t.id_autor = a.id_aluno
    `);

    if (temas.rowCount === 0) {
      return res.status(404).json({ error: 'Nenhum tema encontrado' });
    }

    const temasFormatados = temas.rows.map((tema) => ({
      id_tema: tema.id_tema,
      titulo: tema.titulo,
      descricao: tema.descricao,
      data_cadastro: tema.data_cadastro,
      disponivel: tema.disponivel,
      autor_navigation: {
        id_aluno: tema.id_aluno,
        user_id: tema.user_id,
        ra: tema.ra,
        nome: tema.nome,
        email: tema.email,
        curso: tema.curso,
        periodo: tema.periodo,
        email_inst_verif: tema.email_inst_verif,
        codigo: tema.codigo,
        tipo_usuario: tema.tipo_usuario,
        ativo: tema.ativo,
      },
    }));

    res.json(temasFormatados);
  } catch (error) {
    console.error('Erro ao buscar temas:', error);
    res.status(500).json({ error: 'Erro ao buscar temas' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
