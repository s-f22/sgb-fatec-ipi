const express = require('express');
const bodyParser = require('body-parser');
var { Client } = require('pg');
const app = express();
require('dotenv').config({ path: '../../.env' });
app.use(bodyParser.json());

const jwt = require('jsonwebtoken');



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

  app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
  
    try {
      const result = await db.query('SELECT * FROM ALUNO WHERE email = $1', [email]);
  
      if (result.rows.length === 0) {
        res.status(401).json({ error: 'Email ou senha incorretos' });
        return;
      }
  
      const aluno = result.rows[0];
      if (senha !== aluno.senha) {
        res.status(401).json({ error: 'Email ou senha incorretos' });
        return;
      }
  
      const token = jwt.sign({ aluno }, process.env.JWT_TOKEN_SECRET, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login bem-sucedido', token });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });


  app.listen(process.env.MSS_PORTA_LOGIN, () => {
    console.log(`logins: porta ${process.env.MSS_PORTA_LOGIN}`);
  });