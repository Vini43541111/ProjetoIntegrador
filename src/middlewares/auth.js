const jwt = require('jsonwebtoken');
require('dotenv').config();

function autenticarJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'Token nao fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload;
    next();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'Token invalido ou expirado' });
  }
}

module.exports = autenticarJWT;
