const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Plano = sequelize.define('Plano', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING(120),
    allowNull: false,
    unique: true,
  },
  tipo: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  validade: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('ATIVO', 'INATIVO', 'VENCIDO'),
    allowNull: false,
    defaultValue: 'ATIVO',
  },
}, {
  tableName: 'plano',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: 'atualizado_em',
});

module.exports = Plano;
