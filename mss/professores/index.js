const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config({ path: '../../.env' });
const app = express();
app.use(bodyParser.json());
// const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid')
const cors = require('cors');
app.use(cors());

const port = process.env.MSS_PORTA_PROFESSORES;

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




app.post('/professores', async (req, res) => {
  try {

    const codigo = uuidv4();

    const { user_id, nome, email, coordenador } = req.body;

    const query = 'INSERT INTO professor (user_id, nome, email, coordenador, codigo) VALUES ($1, $2, $3, $4, $5) RETURNING id_professor, user_id, nome, email, coordenador';
    const values = [user_id, nome, email, coordenador, codigo];

    const result = await db.query(query, values);
    console.log("RESULT:", result.rows)

    const professor = {
      id_professor: result.rows[0].id_professor,
      // user_id: result.rows[0].user_id, // Corrigido
      nome: result.rows[0].nome,
      email: result.rows[0].email,
      codigo: codigo
      // email_inst_verif: result.rows[0].email_inst_verif // Corrigido
    };
    
    res.status(201).json({ message: 'professor cadastrado com sucesso!', professor });
    

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
                  <p>Caso tenha solicitado permissão de coordenador, aguarde aprovação do administrador. Enquanto isso, para confirmar seu cadastro e validar seu e-mail institucional, por favor, clique no link abaixo:</p>
                  <p><a href="http://localhost:3000/VerifyEmailProfessor/${professor.id_professor}/${professor.codigo}">Clique aqui para validar o cadastro</a></p>
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
    const result = await db.query('SELECT * FROM professor');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});



// app.get('/professores/:id_professor', async (req, res) => {
//   const id_professor = req.params.id_professor;

//   try {
//     const result = await db.query('SELECT * FROM professor WHERE id_professor = $1', [id_professor]);
//     console.log(result.rows[0])
//     if (result.rows.length === 0) {
//       res.status(404).json({ error: `Professor com ID ${id_professor} não encontrado.` });
//     } else {
//       const professor = {
//         id_professor: result.rows[0].id_professor,
//         user_id: result.rows[0].user_id,
//         nome: result.rows[0].nome,
//         email: result.rows[0].email,
//         email_inst_verif: result.rows[0].email_inst_verif
//       };

//       res.status(200).json(professor);
//     }
//   } catch (error) {
//     console.error(`Erro ao buscar professor com ID ${id_professor}:`, error);
//     res.status(500).json({ error: 'Erro interno do servidor' });
//   }
// });


app.get('/professores/:user_id', async (req, res) => {

  const user_id = req.params.user_id;

  try {
    const result = await db.query('SELECT * FROM professor WHERE user_id = $1', [user_id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: `professor com user_id ${user_id} não encontrado.` });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error(`Erro ao buscar professor com user_id ${user_id}:`, error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});




app.put('/professores/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { user_id, nome, email, email_inst_verif } = req.body;
    const result = await db.query(
      'UPDATE professor SET user_id=$1, nome=$2, email=$3, email_inst_verif=$4 WHERE id_professor=$5 RETURNING *',
      [user_id, nome, email, email_inst_verif, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});



app.patch('/professores/:id_professor/:codigo', async (req, res) => {
  try {
    const id_professor = req.params.id_professor;
    const codigo = req.params.codigo;
    const { email_inst_verif } = req.body;

    const queryCheckCode = 'SELECT id_professor FROM professor WHERE id_professor = $1 AND codigo = $2';
    const checkCodeValues = [id_professor, codigo];
    const codeCheckResult = await db.query(queryCheckCode, checkCodeValues);

    if (codeCheckResult.rows.length === 0) {
      return res.status(400).json({ error: 'Código inválido' });
    }

    const query = 'UPDATE professor SET email_inst_verif = $1 WHERE id_professor = $2 RETURNING *';
    const values = [email_inst_verif, id_professor];

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }

    const professor = {
      id_professor: result.rows[0].id_professor,
      // user_id: result.rows[0].userid,
      nome: result.rows[0].nome,
      email: result.rows[0].email,
      // email_inst_verif: result.rows[0].emailinstverif
    };

    res.json({ message: 'professor atualizado com sucesso!', professor });
  } catch (error) {
    console.error('Erro ao atualizar o professor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});




app.delete('/professores/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.query('DELETE FROM professor WHERE id_professor=$1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }
    res.json({ message: 'Professor deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
