const jwt = require('../alunos/node_modules/jsonwebtoken');
require('../alunos/node_modules/dotenv/lib/main').config({ path: '../../.env' });

// Middleware para verificar o token JWT

VerificarToken = (req, res, next) => {
  
  let token = req.headers.authorization;
  
  if (!token) {
    console.error('Token não fornecido');
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error('Erro na verificação do token:', err);
      // console.log(`TOKEN: ${token} | secret: ${process.env.JWT_TOKEN_SECRET}`)
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
module.exports = VerificarToken;