const express = require('express');
const planoRoutes = require('./routes/plano.routes');
const vinculoRoutes = require('./routes/vinculo.routes');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', modulo: 'G9 - Convenios' });
});

app.use('/planos', planoRoutes);
app.use('/pacientes', vinculoRoutes);

module.exports = app;
