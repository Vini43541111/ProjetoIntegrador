const app = require('./express-app');
const sequelize = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 3009;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('[db] conexao com PostgreSQL estabelecida');

    await sequelize.sync();
    console.log('[db] modelos sincronizados');

    app.listen(PORT, () => {
      console.log(`[server] modulo G9 - Convenios rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error('[server] falha ao iniciar:', err.message);
    process.exit(1);
  }
}

start();
