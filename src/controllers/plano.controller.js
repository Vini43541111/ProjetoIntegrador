const Plano = require('../models/Plano');
const RegraCobertura = require('../models/RegraCobertura');
const { Op } = require('sequelize');

async function cadastrar(req, res) {
  try {
    const { nome, tipo, validade, regras } = req.body;

    if (!nome || !tipo || !validade) {
      return res.status(400).json({
        status: 'error',
        message: 'Campos obrigatorios: nome, tipo, validade',
      });
    }

    const existente = await Plano.findOne({ where: { nome } });
    if (existente) {
      return res.status(409).json({
        status: 'error',
        message: 'Ja existe um plano com esse nome',
      });
    }

    const plano = await Plano.create({ nome, tipo, validade });

    if (Array.isArray(regras)) {
      for (const r of regras) {
        await RegraCobertura.create({
          plano_id: plano.id,
          procedimento: r.procedimento,
          tipo_cobertura: r.tipo_cobertura,
          percentual: r.percentual || 0,
        });
      }
    }

    return res.status(201).json({ status: 'success', data: plano });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
}

async function editar(req, res) {
  try {
    const { id } = req.params;
    const { nome, tipo, validade } = req.body;

    const plano = await Plano.findByPk(id);
    if (!plano) {
      return res.status(404).json({ status: 'error', message: 'Plano nao encontrado' });
    }

    if (nome && nome !== plano.nome) {
      const duplicado = await Plano.findOne({ where: { nome, id: { [Op.ne]: id } } });
      if (duplicado) {
        return res.status(409).json({ status: 'error', message: 'Ja existe um plano com esse nome' });
      }
    }

    await plano.update({
      nome: nome ?? plano.nome,
      tipo: tipo ?? plano.tipo,
      validade: validade ?? plano.validade,
    });

    return res.json({ status: 'success', data: plano });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
}

async function alterarStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validos = ['ATIVO', 'INATIVO', 'VENCIDO'];
    if (!validos.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Status invalido. Use ATIVO, INATIVO ou VENCIDO',
      });
    }

    const plano = await Plano.findByPk(id);
    if (!plano) {
      return res.status(404).json({ status: 'error', message: 'Plano nao encontrado' });
    }

    await plano.update({ status });
    return res.json({ status: 'success', data: plano });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
}

async function consultar(req, res) {
  try {
    const { nome, tipo, status } = req.query;
    const where = {};

    if (nome) where.nome = { [Op.iLike]: `%${nome}%` };
    if (tipo) where.tipo = tipo;
    if (status) where.status = status;

    const planos = await Plano.findAll({
      where,
      include: [{ model: RegraCobertura, as: 'regras' }],
      order: [['nome', 'ASC']],
    });

    return res.json({ status: 'success', data: planos });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
}

module.exports = { cadastrar, editar, alterarStatus, consultar };
