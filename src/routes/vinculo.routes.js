const express = require('express');
const router = express.Router();
const vinculoController = require('../controllers/vinculo.controller');

router.post('/:id/plano', vinculoController.vincular);
router.put('/:id/plano', vinculoController.atualizar);
router.get('/:id/plano', vinculoController.consultar);

module.exports = router;
