const jwt = require('jsonwebtoken');
require('dotenv').config();

// TODO [S2] Middleware de autenticação JWT entre módulos.
// Valida o token enviado no header Authorization: Bearer <token>.
function autenticarJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ status: 'error', message: 'Token nao fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload;
    next();
  } catch (err) {
    return res.json({ status: 'error', message: 'Token invalido' });
  }
}

module.exports = autenticarJWT;
