const express = require('express');
const router = express.Router();
const planoController = require('../controllers/plano.controller');

router.post('/', planoController.cadastrar);
router.get('/', planoController.consultar);
router.put('/:id', planoController.editar);
router.patch('/:id/status', planoController.alterarStatus);

module.exports = router;
