const axios = require('axios');
require('dotenv').config();

const g1 = axios.create({
  baseURL: process.env.G1_BASE_URL,
  timeout: 60000,
});

let tokenCache = null;
let tokenExpiraEm = 0;

async function obterToken() {
  const agora = Date.now();
  if (tokenCache && agora < tokenExpiraEm) {
    return tokenCache;
  }

  try {
    const resp = await g1.post('/login', {
      usuario: process.env.G1_USUARIO,
      senha: process.env.G1_SENHA,
    });
    tokenCache = resp.data.token;
    tokenExpiraEm = agora + 7 * 60 * 60 * 1000;
    return tokenCache;
  } catch (err) {
    const e = new Error('Falha ao autenticar no modulo G1');
    e.status = 502;
    throw e;
  }
}

async function buscarPaciente(idPaciente) {
  const token = await obterToken();

  try {
    const resp = await g1.get(`/paciente/${idPaciente}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return resp.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      const e = new Error('Paciente nao encontrado no G1');
      e.status = 404;
      throw e;
    }
    if (err.response && err.response.status === 401) {
      tokenCache = null;
      const e = new Error('Token invalido na comunicacao com o G1');
      e.status = 502;
      throw e;
    }
    const e = new Error('Modulo G1 indisponivel');
    e.status = 503;
    throw e;
  }
}

module.exports = { obterToken, buscarPaciente };
