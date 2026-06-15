const VinculoPaciente = require('../models/VinculoPaciente');
const Plano = require('../models/Plano');
const g1Client = require('../services/g1.client');

async function vincular(req, res) {
  try {
    const pacienteId = req.params.id;
    const { plano_id } = req.body;

    if (!plano_id) {
      return res.status(400).json({ status: 'error', message: 'plano_id e obrigatorio' });
    }

    let paciente;
    try {
      paciente = await g1Client.buscarPaciente(pacienteId);
    } catch (err) {
      return res.status(err.status || 503).json({ status: 'error', message: err.message });
    }

    const plano = await Plano.findByPk(plano_id);
    if (!plano) {
      return res.status(404).json({ status: 'error', message: 'Plano nao encontrado' });
    }
    if (plano.status !== 'ATIVO') {
      return res.status(400).json({ status: 'error', message: 'Nao e possivel vincular a um plano inativo' });
    }

    const vinculoAtivo = await VinculoPaciente.findOne({
      where: { paciente_id: pacienteId, ativo: true },
    });
    if (vinculoAtivo) {
      return res.status(409).json({
        status: 'error',
        message: 'Paciente ja possui vinculo ativo. Use a atualizacao de vinculo.',
      });
    }

    const vinculo = await VinculoPaciente.create({
      paciente_id: pacienteId,
      plano_id,
    });

    return res.status(201).json({
      status: 'success',
      data: { vinculo, paciente: { idpaciente: paciente.idpaciente, nome: paciente.nome } },
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
}

async function atualizar(req, res) {
  try {
    const pacienteId = req.params.id;
    const { plano_id } = req.body;

    if (!plano_id) {
      return res.status(400).json({ status: 'error', message: 'plano_id e obrigatorio' });
    }

    const vinculoAtual = await VinculoPaciente.findOne({
      where: { paciente_id: pacienteId, ativo: true },
    });
    if (!vinculoAtual) {
      return res.status(400).json({
        status: 'error',
        message: 'Paciente nao possui vinculo ativo. Use a criacao de vinculo.',
      });
    }

    const novoPlano = await Plano.findByPk(plano_id);
    if (!novoPlano) {
      return res.status(404).json({ status: 'error', message: 'Plano nao encontrado' });
    }
    if (novoPlano.status !== 'ATIVO') {
      return res.status(400).json({ status: 'error', message: 'Nao e possivel vincular a um plano inativo' });
    }

    await vinculoAtual.update({
      ativo: false,
      data_fim: new Date().toISOString().slice(0, 10),
    });

    const novoVinculo = await VinculoPaciente.create({
      paciente_id: pacienteId,
      plano_id,
    });

    return res.json({ status: 'success', data: novoVinculo });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
}

async function consultar(req, res) {
  try {
    const pacienteId = req.params.id;

    const vinculo = await VinculoPaciente.findOne({
      where: { paciente_id: pacienteId, ativo: true },
      include: [{ model: Plano, as: 'plano' }],
    });

    if (!vinculo) {
      return res.status(404).json({
        status: 'error',
        message: 'Paciente nao possui plano vinculado',
      });
    }

    return res.json({ status: 'success', data: vinculo });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
}

module.exports = { vincular, atualizar, consultar };
