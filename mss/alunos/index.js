const express = require('express');
const bodyParser = require('body-parser');
var { Client } = require('pg');
const app = express();
require('dotenv').config({ path: '../../.env' });
app.use(bodyParser.json());

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


const VerificarToken = require('../middlewares/VerificarToken.js');
//const AuthCheck = require('../middlewares/AuthCheck.js');



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

    const { userId, ra, nome, email, curso, periodo } = req.body;

    const query = 'INSERT INTO ALUNO (userId, ra, nome, email, curso, periodo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING idAluno, userId, ra, nome, email, curso, periodo';
    const values = [userId, ra, nome, email, curso, periodo];

    const result = await db.query(query, values);

    const aluno = { idAluno: result.rows[0].idaluno, nome: result.rows[0].nome, email: result.rows[0].email };

    // VERIFICAR COM PROF se seria necessario ou interssante gerar um token próprio do nosso serviço, ou se seria melhor utilizar o do auth0
    const token = jwt.sign({ aluno }, process.env.JWT_TOKEN_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'Aluno cadastrado com sucesso!', token });

    if (res.status(201)) {

      // Envio de email ao usuário com link de validação
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.REACT_APP_EMAIL_USER,
          pass: process.env.REACT_APP_EMAIL_PWD
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const mailOptions = {
        from: process.env.REACT_APP_EMAIL_USER,
        to: email,
        subject: "Bem vindo ao SGB - FATEC Ipiranga",
        html: `
            <p>Olá, ${nome.split(' ')[0]}</p>
            <p>Bem vindo ao Sistema Gerenciador de Bancas da FATEC Ipiranga!</p>
            <p>Para confirmar seu cadastro e validar seu e-mail institucional, por favor, clique no link abaixo:</p>
            <p><a href="http://localhost:3000/VerifyEmailAluno/${aluno.idAluno}">Clique aqui para validar o cadastro</a></p>
            <p>Atenciosamente,</p>
            <p>Equipe SGB</p>
        `
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error)
        } else {
          console.log("Email enviado:", info.response)
        }
      })
    }

  } catch (error) {
    console.error('Erro ao cadastrar o aluno:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});



app.put('/alunos/:idAluno', async (req, res) => {
  try {
    const idAluno = req.params.idAluno;
    const { userId, ra, nome, email, curso, periodo, emailInstVerif } = req.body;
    const query = 'UPDATE ALUNO SET userId = $1, ra = $2, nome = $3, email = $4, curso = $5, periodo = $6, emailInstVerif = $7 WHERE idAluno = $8 RETURNING *';
    const values = [userId, ra, nome, email, curso, periodo, emailInstVerif, idAluno];

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    const aluno = { idAluno: result.rows[0].idAluno, nome: result.rows[0].nome, email: result.rows[0].email };
    res.json({ message: 'Aluno atualizado com sucesso!', aluno });
  } catch (error) {
    console.error('Erro ao atualizar o aluno:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});



app.patch('/alunos/:idAluno', async (req, res) => {
  try {
    const idAluno = req.params.idAluno;
    const { emailInstVerif } = req.body;

    if (emailInstVerif !== true) {
      return res.status(400).json({ error: 'O atributo emailInstVerif deve ser true para a atualização.' });
    }

    const query = 'UPDATE ALUNO SET emailInstVerif = $1 WHERE idAluno = $2 RETURNING *';
    const values = [emailInstVerif, idAluno];

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    const aluno = { idAluno: result.rows[0].idAluno, nome: result.rows[0].nome, email: result.rows[0].email };
    res.json({ message: 'Aluno atualizado com sucesso!', aluno });
  } catch (error) {
    console.error('Erro ao atualizar o aluno:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});



app.delete('/alunos/:idAluno', async (req, res) => {
  try {
    const idAluno = req.params.idAluno;
    const result = await db.query('DELETE FROM ALUNO WHERE idAluno = $1 RETURNING *', [idAluno]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    const aluno = { idAluno: result.rows[0].idAluno, nome: result.rows[0].nome, email: result.rows[0].email };
    res.json({ message: 'Aluno removido com sucesso!', aluno });
  } catch (error) {
    console.error('Erro ao remover o aluno:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});



app.get('/alunos', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM ALUNO');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao obter os alunos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});



// app.get('/alunos/:idAluno', VerificarToken, async (req, res) => {
app.get('/alunos/:idAluno', async (req, res) => {

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