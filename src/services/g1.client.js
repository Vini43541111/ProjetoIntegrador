const axios = require('axios');
require('dotenv').config();

// TODO [S2] Cliente HTTP para consumir a API do módulo G1 (Pacientes).
// IMPORTANTE: o endpoint e o formato de resposta abaixo são uma PROPOSTA
// e devem ser confirmados com o grupo do G1.
const g1 = axios.create({
  baseURL: process.env.G1_BASE_URL,
  timeout: 5000,
});

// Busca um paciente por ID no módulo G1.
// Retorna os dados do paciente, ou lança erro se não existir / G1 indisponível.
async function buscarPaciente(pacienteId, token) {
  try {
    const resp = await g1.get(`/pacientes/${pacienteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return resp.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      const e = new Error('Paciente nao encontrado no G1');
      e.status = 404;
      throw e;
    }
    const e = new Error('Modulo G1 indisponivel');
    e.status = 503;
    throw e;
  }
}

module.exports = { buscarPaciente };
