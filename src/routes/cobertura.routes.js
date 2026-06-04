const express = require('express');
const router = express.Router();

// TODO [S3] RF06 - Validar cobertura de procedimento
// Consumido por G10 (Faturamento) e G13 (Autorização)
// Ex: GET /cobertura?paciente=1&procedimento=CONSULTA_CLINICA
router.get('/', (req, res) => {
  const { paciente, procedimento } = req.query;
  res.json({
    message: 'TODO: RF06 - validar cobertura',
    recebido: { paciente, procedimento },
  });
});

module.exports = router;
