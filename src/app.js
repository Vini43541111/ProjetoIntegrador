const express = require('express');
const planoRoutes = require('./routes/plano.routes');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', modulo: 'G9 - Convenios' });
});

app.use('/planos', planoRoutes);

module.exports = app;
