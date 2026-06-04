const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 3009;

app.listen(PORT, () => {
  console.log(`[server] modulo G9 - Convenios rodando na porta ${PORT}`);
});
