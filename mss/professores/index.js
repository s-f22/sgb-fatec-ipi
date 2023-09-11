const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config({ path: '../../.env' });
const app = express();
app.use(bodyParser.json());

const port = process.env.MSS_PORTA_PROFESSORES;


const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


const VerificarToken = require('../middlewares/VerificarToken.js');
//const AuthCheck = require('../middlewares/AuthCheck.js');

// Configuração do banco de dados
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_SERVER,
  database: process.env.DB_USER,
  password: process.env.DB_PWD,
  port: process.env.DB_PORT,
});



app.post('/professores', async (req, res) => {
  try {
    const { userId, nome, email } = req.body;

    const query = 'INSERT INTO professor (userId, nome, email) VALUES ($1, $2, $3) RETURNING idProfessor, userId, nome, email, dispOrient, emailInstVerif';
    const values = [userId, nome, email];

    const result = await pool.query(query, values);

    const professor = {
      idProfessor: result.rows[0].idprofessor,
      userId: result.rows[0].userid,
      nome: result.rows[0].nome,
      email: result.rows[0].email,
      dispOrient: result.rows[0].disporient,
      emailInstVerif: result.rows[0].emailinstverif
    };

    res.status(201).json({ message: 'Professor cadastrado com sucesso!', professor });

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
                  <p>Olá, professor ${nome.split(' ')[0]}</p>
                  <p>Bem vindo ao Sistema Gerenciador de Bancas da FATEC Ipiranga!</p>
                  <p>Para confirmar seu cadastro e validar seu e-mail institucional, por favor, clique no link abaixo:</p>
                  <p><a href="http://localhost:3000/VerifyEmailProfessor/${professor.idProfessor}">Clique aqui para validar o cadastro</a></p>
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
    console.error('Erro ao cadastrar o professor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});



app.get('/professores', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM professor');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});



app.get('/professores/:idProfessor', async (req, res) => {
  const idProfessor = req.params.idProfessor;

  try {
    const result = await pool.query('SELECT * FROM professor WHERE idProfessor = $1', [idProfessor]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: `Professor com ID ${idProfessor} não encontrado.` });
    } else {
      const professor = {
        idProfessor: result.rows[0].idprofessor,
        userId: result.rows[0].userid,
        nome: result.rows[0].nome,
        email: result.rows[0].email,
        dispOrient: result.rows[0].disporient,
        emailInstVerif: result.rows[0].emailinstverif
      };
      res.status(200).json(professor);
    }
  } catch (error) {
    console.error(`Erro ao buscar professor com ID ${idProfessor}:`, error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});




app.put('/professores/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { userId, nome, email, dispOrient, emailInstVerif } = req.body;
    const result = await pool.query(
      'UPDATE professor SET userId=$1, nome=$2, email=$3, dispOrient=$4, emailInstVerif=$5 WHERE idProfessor=$6 RETURNING *',
      [userId, nome, email, dispOrient, emailInstVerif, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});



app.patch('/professores/:idProfessor', async (req, res) => {
  try {
    const idProfessor = req.params.idProfessor;
    const { emailInstVerif } = req.body;

    if (emailInstVerif !== true) {
      return res.status(400).json({ error: 'O atributo emailInstVerif deve ser true para a atualização.' });
    }

    const query = 'UPDATE professor SET emailInstVerif = $1 WHERE idProfessor = $2 RETURNING *';
    const values = [emailInstVerif, idProfessor];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }

    const professor = {
      idProfessor: result.rows[0].idprofessor,
      userId: result.rows[0].userid,
      nome: result.rows[0].nome,
      email: result.rows[0].email,
      dispOrient: result.rows[0].disporient,
      emailInstVerif: result.rows[0].emailinstverif
    };
    
    res.json({ message: 'Professor atualizado com sucesso!', professor });
  } catch (error) {
    console.error('Erro ao atualizar o professor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});




app.delete('/professores/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query('DELETE FROM professor WHERE idProfessor=$1', [id]);
    res.json({ message: 'Professor deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
