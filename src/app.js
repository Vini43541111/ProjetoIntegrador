const express = require('express');
const planoRoutes = require('./routes/plano.routes');
const vinculoRoutes = require('./routes/vinculo.routes');
const coberturaRoutes = require('./routes/cobertura.routes');

const app = express();

// Middleware para interpretar JSON no corpo das requisições
app.use(express.json());

// Healthcheck simples
app.get('/health', (req, res) => {
  res.json({ status: 'ok', modulo: 'G9 - Convenios' });
});

// Rotas do módulo
app.use('/planos', planoRoutes);
app.use('/pacientes', vinculoRoutes);
app.use('/cobertura', coberturaRoutes);

// Tratamento centralizado de erros
app.use((err, req, res, next) => {
  console.error('[erro]', err.message);
  const status = err.status || 500;
  res.json({ status: 'error', message: err.message || 'Erro interno' });
});

module.exports = app;
