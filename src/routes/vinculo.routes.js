const express = require('express');
const router = express.Router();

// TODO [S2] RF04 - Vincular paciente a plano
router.post('/:id/plano', (req, res) => {
  res.json({ message: 'TODO: RF04 - vincular paciente' });
});

// TODO [S2] RF05 - Atualizar vínculo do paciente
router.put('/:id/plano', (req, res) => {
  res.json({ message: 'TODO: RF05 - atualizar vinculo' });
});

// TODO [S2] RF08 - Consultar vínculo do paciente
router.get('/:id/plano', (req, res) => {
  res.json({ message: 'TODO: RF08 - consultar vinculo' });
});

module.exports = router;
