const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Plano = require('./Plano');

const RegraCobertura = sequelize.define('RegraCobertura', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  plano_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Plano,
      key: 'id',
    },
  },
  procedimento: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  tipo_cobertura: {
    type: DataTypes.ENUM('TOTAL', 'PARCIAL', 'INEXISTENTE'),
    allowNull: false,
  },
  percentual: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'regra_cobertura',
  timestamps: false,
});

Plano.hasMany(RegraCobertura, { foreignKey: 'plano_id', as: 'regras' });
RegraCobertura.belongsTo(Plano, { foreignKey: 'plano_id', as: 'plano' });

module.exports = RegraCobertura;
