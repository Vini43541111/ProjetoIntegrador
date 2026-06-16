const VinculoPaciente = require('../models/VinculoPaciente');
const Plano = require('../models/Plano');
const RegraCobertura = require('../models/RegraCobertura');

async function validarCobertura(req, res) {
  try {
    const { paciente, procedimento } = req.query;

    if (!paciente || !procedimento) {
      return res.status(400).json({
        status: 'error',
        message: 'Parametros obrigatorios: paciente e procedimento',
      });
    }

    const vinculo = await VinculoPaciente.findOne({
      where: { paciente_id: paciente, ativo: true },
      include: [{ model: Plano, as: 'plano' }],
    });

    if (!vinculo) {
      return res.status(404).json({
        status: 'error',
        message: 'Paciente nao possui plano vinculado',
      });
    }

    if (vinculo.plano.status !== 'ATIVO') {
      return res.status(400).json({
        status: 'error',
        message: 'O plano do paciente esta inativo',
      });
    }

    const regra = await RegraCobertura.findOne({
      where: {
        plano_id: vinculo.plano_id,
        procedimento,
      },
    });

    if (!regra) {
      return res.status(404).json({
        status: 'error',
        message: 'Procedimento desconhecido para este plano',
        paciente_id: Number(paciente),
        procedimento,
      });
    }

    return res.json({
      status: 'success',
      data: {
        paciente_id: Number(paciente),
        procedimento,
        plano: vinculo.plano.nome,
        cobertura: regra.tipo_cobertura,
        percentual: regra.percentual,
      },
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
}

module.exports = { validarCobertura };
