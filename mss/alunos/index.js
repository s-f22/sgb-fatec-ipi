const express = require('express');
const bodyParser = require('body-parser');
var { Client } = require('pg');
const app = express();
require('dotenv').config({ path: '../../.env' });
app.use(bodyParser.json());

const jwt = require('jsonwebtoken');

// Middleware para verificar o token JWT
function verificarToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    console.error('Token não fornecido');
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error('Erro na verificação do token:', err);
      return res.status(401).json({ error: 'Falha na verificação do token' });
    }

    if (!decoded || !decoded.aluno) {
      console.error('Token inválido - formato incorreto:', decoded);
      return res.status(401).json({ error: 'Token inválido' });
    }

    req.aluno = decoded.aluno; // Armazena os dados do aluno no objeto de solicitação
    next();
  });
}


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
    const { ra, nome, email, curso, periodo, senha, tipoUsuario } = req.body;
    await db.query('INSERT INTO ALUNO (ra, nome, email, curso, periodo, senha, tipoUsuario) VALUES ($1, $2, $3, $4, $5, $6, $7)', [ra, nome, email, curso, periodo, senha, tipoUsuario]);

    const aluno = {nome, email}
    const token = jwt.sign({aluno}, process.env.JWT_TOKEN_SECRET, {expiresIn: '1h'});
    res.status(201).json({ message: 'Aluno cadastrado com sucesso!', token });
  } catch (error) {
    console.error('Erro ao cadastrar o aluno:', error);
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
});


app.put('/alunos/:idAluno', async (req, res) => {
  const idAluno = req.params.idAluno;
  const { ra, nome, email, curso, periodo, senha, tipoUsuario } = req.body;

  try {
    await db.query('UPDATE ALUNO SET ra = $1, nome = $2, email = $3, curso = $4, periodo = $5, senha = $6, tipoUsuario = $7 WHERE idAluno = $8', [ra, nome, email, curso, periodo, idAluno, senha, tipoUsuario]);
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


app.get('/alunos/:idAluno', verificarToken, async (req, res) => {
  res.json({message: 'Funcionalidade protegida'})
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



app.listen(process.env.MSS_PORTA_ALUNOS, () => {
  console.log(`alunos: porta ${process.env.MSS_PORTA_ALUNOS}`);
});