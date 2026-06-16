-- =====================================================================
-- Artefatos de Banco de Dados — Modulo G9 (Convenios)
-- PostgreSQL | nomes sem acento, snake_case
-- =====================================================================


-- =====================================================================
-- VIEW: vw_planos_ativos_cobertura
-- Mostra os planos ativos junto com suas regras de cobertura.
-- Usada pelo sistema na tela de consulta de planos e na conferencia
-- de coberturas disponiveis.
-- =====================================================================
CREATE OR REPLACE VIEW vw_planos_ativos_cobertura AS
SELECT
  p.id            AS plano_id,
  p.nome          AS plano_nome,
  p.tipo          AS plano_tipo,
  p.validade      AS plano_validade,
  rc.procedimento AS procedimento,
  rc.tipo_cobertura AS tipo_cobertura,
  rc.percentual   AS percentual
FROM plano p
LEFT JOIN regra_cobertura rc ON rc.plano_id = p.id
WHERE p.status = 'ATIVO';


-- =====================================================================
-- STORED PROCEDURE (FUNCTION): fn_validar_cobertura
-- Recebe o id do paciente e o codigo do procedimento.
-- Retorna o tipo de cobertura e o percentual do plano vinculado.
-- Usada pelo endpoint RF06 (validacao de cobertura) consumido por
-- G10 (Faturamento) e G13 (Autorizacao).
--
-- Em PostgreSQL usamos FUNCTION (equivalente a stored procedure que
-- retorna dados).
-- =====================================================================
CREATE OR REPLACE FUNCTION fn_validar_cobertura(
  p_paciente_id INTEGER,
  p_procedimento VARCHAR
)
RETURNS TABLE (
  cobertura VARCHAR,
  percentual INTEGER,
  plano_nome VARCHAR
) AS $$
DECLARE
  v_plano_id INTEGER;
  v_plano_status VARCHAR;
  v_plano_nome VARCHAR;
BEGIN
  SELECT vp.plano_id, pl.status, pl.nome
    INTO v_plano_id, v_plano_status, v_plano_nome
  FROM vinculo_paciente vp
  JOIN plano pl ON pl.id = vp.plano_id
  WHERE vp.paciente_id = p_paciente_id
    AND vp.ativo = TRUE
  LIMIT 1;

  IF v_plano_id IS NULL THEN
    RAISE EXCEPTION 'Paciente nao possui plano vinculado';
  END IF;

  IF v_plano_status <> 'ATIVO' THEN
    RAISE EXCEPTION 'O plano do paciente esta inativo';
  END IF;

  RETURN QUERY
  SELECT rc.tipo_cobertura::VARCHAR, rc.percentual, v_plano_nome
  FROM regra_cobertura rc
  WHERE rc.plano_id = v_plano_id
    AND rc.procedimento = p_procedimento;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Procedimento desconhecido para este plano';
  END IF;
END;
$$ LANGUAGE plpgsql;


-- =====================================================================
-- TRIGGER: trg_log_alteracao_plano
-- Registra em uma tabela de auditoria toda alteracao de status de um
-- plano (atende ao RNF06 de rastreabilidade).
-- =====================================================================

-- Tabela de auditoria que a trigger alimenta
CREATE TABLE IF NOT EXISTS log_plano (
  id            SERIAL PRIMARY KEY,
  plano_id      INTEGER NOT NULL,
  status_antigo VARCHAR(20),
  status_novo   VARCHAR(20),
  alterado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Funcao executada pela trigger
CREATE OR REPLACE FUNCTION fn_log_alteracao_plano()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO log_plano (plano_id, status_antigo, status_novo)
    VALUES (OLD.id, OLD.status, NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Associa a funcao ao evento de UPDATE na tabela plano
DROP TRIGGER IF EXISTS trg_log_alteracao_plano ON plano;
CREATE TRIGGER trg_log_alteracao_plano
AFTER UPDATE ON plano
FOR EACH ROW
EXECUTE FUNCTION fn_log_alteracao_plano();
