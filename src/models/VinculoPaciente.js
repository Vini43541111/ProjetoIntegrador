const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Plano = require('./Plano');

const VinculoPaciente = sequelize.define('VinculoPaciente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  paciente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  plano_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Plano,
      key: 'id',
    },
  },
  data_inicio: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  data_fim: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: 'vinculo_paciente',
  timestamps: false,
});

Plano.hasMany(VinculoPaciente, { foreignKey: 'plano_id', as: 'vinculos' });
VinculoPaciente.belongsTo(Plano, { foreignKey: 'plano_id', as: 'plano' });

module.exports = VinculoPaciente;
