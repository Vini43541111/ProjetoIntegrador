const { Pool } = require('pg');
require('dotenv').config();

// Pool de conexões com o PostgreSQL.
// As credenciais vêm do arquivo .env (ver .env.example).
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.on('connect', () => {
  console.log('[db] conexão com PostgreSQL estabelecida');
});

pool.on('error', (err) => {
  console.error('[db] erro inesperado no pool de conexões', err);
});

// Helper para executar queries em qualquer lugar do projeto.
async function query(text, params) {
  return pool.query(text, params);
}

module.exports = { pool, query };
