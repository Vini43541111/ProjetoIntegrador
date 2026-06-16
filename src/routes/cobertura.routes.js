const express = require('express');
const router = express.Router();
const coberturaController = require('../controllers/cobertura.controller');

router.get('/', coberturaController.validarCobertura);

module.exports = router;
