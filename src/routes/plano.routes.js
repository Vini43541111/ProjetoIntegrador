const express = require('express');
const router = express.Router();

// TODO [S1] RF01 - Cadastrar plano
router.post('/', (req, res) => {
  res.json({ message: 'TODO: RF01 - cadastrar plano' });
});

// TODO [S1] RF07 - Consultar planos com filtros
router.get('/', (req, res) => {
  res.json({ message: 'TODO: RF07 - consultar planos' });
});

// TODO [S1] RF02 - Editar plano
router.put('/:id', (req, res) => {
  res.json({ message: 'TODO: RF02 - editar plano' });
});

// TODO [S1] RF03 - Ativar/Desativar plano
router.patch('/:id/status', (req, res) => {
  res.json({ message: 'TODO: RF03 - ativar/desativar plano' });
});

module.exports = router;
