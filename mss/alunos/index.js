const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config({ path: '../../.env' });
const app = express();
app.use(bodyParser.json());
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid')
const cors = require('cors');
// app.use(cors());

const https = require('https');
const fs = require('fs');

const corsOptions = {
  origin: 'https://s-f22.github.io',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: false,
  optionsSuccessStatus: 204,
  allowedHeaders: "*",
};
app.use(cors(corsOptions));


const host = '0.0.0.0'

// Caminhos para os arquivos de chave privada e certificado
const privateKeyPath = '../certs/key.pem';
const certificatePath = '../certs/cert.pem';

// Carregue os arquivos de chave privada e certificado
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const certificate = fs.readFileSync(certificatePath, 'utf8');

// Configurações para criar um servidor HTTPS
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);



// const VerificarToken = require('../middlewares/VerificarToken.js');
//const AuthCheck = require('../middlewares/AuthCheck.js');



const config = {
  user: process.env.DB_config_user,
  host: process.env.DB_config_host,
  database: process.env.DB_config_database,
  password: process.env.DB_config_password,
  port: process.env.DB_config_port,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.DB_config_ca,
  },
};
const db = new Pool(config);


app.post('/alunos', async (req, res) => {
  try {

    const codigo = uuidv4();
    const { user_id, ra, nome, email, curso, periodo } = req.body;

    const query = 'INSERT INTO aluno (user_id, ra, nome, email, curso, periodo, codigo) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_aluno, user_id, ra, nome, email, curso, periodo';
    const values = [user_id, ra, nome, email, curso, periodo, codigo];

    const result = await db.query(query, values);

    const aluno = {
      id_aluno: result.rows[0].id_aluno,
      nome: result.rows[0].nome,
      email: result.rows[0].email,
      codigo: codigo
    };

    // VERIFICAR COM PROF se seria necessario ou interssante gerar um token próprio do nosso serviço, ou se seria melhor utilizar o do auth0
    // const token = jwt.sign({ aluno }, process.env.JWT_TOKEN_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'aluno cadastrado com sucesso!' });

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
            <p><a href="http://localhost:3000/VerifyEmailaluno/${aluno.id_aluno}/${aluno.codigo}">Clique aqui para validar o cadastro</a></p>
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



app.put('/alunos/:id_aluno', async (req, res) => {
  try {
    const id_aluno = req.params.id_aluno;
    const { user_id, ra, nome, email, curso, periodo, email_inst_verif } = req.body;
    const query = 'UPDATE aluno SET user_id = $1, ra = $2, nome = $3, email = $4, curso = $5, periodo = $6, email_inst_verif = $7 WHERE id_aluno = $8 RETURNING *';
    const values = [user_id, ra, nome, email, curso, periodo, email_inst_verif, id_aluno];

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'aluno não encontrado' });
    }

    const aluno = { id_aluno: result.rows[0].id_aluno, nome: result.rows[0].nome, email: result.rows[0].email };
    res.json({ message: 'aluno atualizado com sucesso!', aluno });
  } catch (error) {
    console.error('Erro ao atualizar o aluno:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});



app.patch('/alunos/:id_aluno/:codigo', async (req, res) => {
  try {
    const id_aluno = req.params.id_aluno;
    const codigo = req.params.codigo;
    const { email_inst_verif } = req.body;

    const queryCheckCode = 'SELECT id_aluno FROM aluno WHERE id_aluno = $1 AND codigo = $2';
    const checkCodeValues = [id_aluno, codigo];
    const codeCheckResult = await db.query(queryCheckCode, checkCodeValues);

    if (codeCheckResult.rows.length === 0) {
      return res.status(400).json({ error: 'Código inválido' });
    }

    const query = 'UPDATE aluno SET email_inst_verif = $1 WHERE id_aluno = $2 RETURNING *';
    const values = [email_inst_verif, id_aluno];

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'aluno não encontrado' });
    }

    const aluno = {
      id_aluno: result.rows[0].id_aluno,
      nome: result.rows[0].nome,
      email: result.rows[0].email
    };

    res.json({ message: 'aluno atualizado com sucesso!', aluno });
    
  } catch (error) {
    console.error('Erro ao atualizar o aluno:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});




app.delete('/alunos/:id_aluno', async (req, res) => {
  try {
    const id_aluno = req.params.id_aluno;
    const result = await db.query('DELETE FROM aluno WHERE id_aluno = $1 RETURNING *', [id_aluno]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'aluno não encontrado' });
    }

    const aluno = { id_aluno: result.rows[0].id_aluno, nome: result.rows[0].nome, email: result.rows[0].email };
    res.json({ message: 'aluno removido com sucesso!', aluno });
  } catch (error) {
    console.error('Erro ao remover o aluno:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});



app.get('/alunos', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM aluno');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao obter os alunos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});



// // app.get('/alunos/:id_aluno', VerificarToken, async (req, res) => {
// app.get('/alunos/:id_aluno', async (req, res) => {

//   const id_aluno = req.params.id_aluno;

//   try {
//     const result = await db.query('SELECT * FROM aluno WHERE id_aluno = $1', [id_aluno]);
//     if (result.rows.length === 0) {
//       res.status(404).json({ error: `aluno com ID ${id_aluno} não encontrado.` });
//     } else {
//       res.status(200).json(result.rows[0]);
//     }
//   } catch (error) {
//     console.error(`Erro ao buscar aluno com ID ${id_aluno}:`, error);
//     res.status(500).json({ error: 'Erro interno do servidor' });
//   }
// });


// app.get('/alunos/:user_id', VerificarToken, async (req, res) => {
  app.get('/alunos/:user_id', async (req, res) => {

    const user_id = req.params.user_id;
  
    try {
      const result = await db.query('SELECT * FROM aluno WHERE user_id = $1', [user_id]);
      if (result.rows.length === 0) {
        res.status(404).json({ error: `aluno com user_id ${user_id} não encontrado.` });
      } else {
        res.status(200).json(result.rows[0]);
      }
    } catch (error) {
      console.error(`Erro ao buscar aluno com user_id ${user_id}:`, error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

const port = process.env.MSS_PORTA_ALUNOS

// app.listen(port, host, () => {
//   console.log(`Servidor rodando na porta ${port}`);
// });

// Inicie o servidor HTTPS
httpsServer.listen(port, host, () => {
  console.log(`Servidor ALUNOS HTTPS, rodando na porta ${port}`);
});