-- =====================================================================
-- Migration 001 — Estrutura inicial do banco do módulo G9 (Convênios)
-- Banco: PostgreSQL
-- Padrão: nomes sem acento, snake_case
--
-- TODO [S1] / [BD]: revisar e completar conforme o diagrama físico.
-- Este é o esqueleto inicial — ajustar tipos, constraints e regras.
-- =====================================================================

-- Tabela: plano
CREATE TABLE IF NOT EXISTS plano (
  id            SERIAL PRIMARY KEY,
  nome          VARCHAR(120) NOT NULL UNIQUE,
  tipo          VARCHAR(50)  NOT NULL,
  validade      DATE         NOT NULL,
  status        VARCHAR(20)  NOT NULL DEFAULT 'ATIVO',
  criado_em     TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Tabela: regra_cobertura
CREATE TABLE IF NOT EXISTS regra_cobertura (
  id              SERIAL PRIMARY KEY,
  plano_id        INTEGER NOT NULL REFERENCES plano(id),
  procedimento    VARCHAR(100) NOT NULL,
  tipo_cobertura  VARCHAR(20)  NOT NULL, -- TOTAL | PARCIAL | INEXISTENTE
  percentual      INTEGER      NOT NULL DEFAULT 0
);

-- Tabela: vinculo_paciente
CREATE TABLE IF NOT EXISTS vinculo_paciente (
  id            SERIAL PRIMARY KEY,
  paciente_id   INTEGER NOT NULL,  -- referência externa ao módulo G1
  plano_id      INTEGER NOT NULL REFERENCES plano(id),
  data_inicio   DATE    NOT NULL DEFAULT CURRENT_DATE,
  data_fim      DATE,
  ativo         BOOLEAN NOT NULL DEFAULT TRUE
);
