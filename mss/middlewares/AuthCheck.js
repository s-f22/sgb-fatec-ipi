const { expressjwt: jwt } = require('../alunos/node_modules/express-jwt');
const jwksRsa = require('../alunos/node_modules/jwks-rsa');
require('../alunos/node_modules/dotenv/lib/main').config({ path: '../../.env' });


// const AuthCheck = jwt({
//   secret: jwksRsa.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`
//   }),
//   audience: `${process.env.REACT_APP_AUTH0_API_IDENTIFIER}`,
//   issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
//   algorithms: ['RS256']
// });

// module.exports = AuthCheck;


const AuthCheck = (req, res, next) => {
  jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`
    }),
    audience: `${process.env.REACT_APP_AUTH0_API_IDENTIFIER}`,
    issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
    algorithms: ['RS256']
  })(req, res, (err) => {
    if (err) {
      res.status(401).json({ error: 'Não autorizado' }); // Retorna erro 401 em formato JSON
    } else {
      next(); // Chama o próximo middleware (ou rota)
    }
  });
};

module.exports = AuthCheck;
