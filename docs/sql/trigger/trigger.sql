-- PostgreSQL
-- Crie a função que será chamada pelo gatilho
CREATE OR REPLACE FUNCTION verifica_intervalo_banca()
RETURNS TRIGGER AS $$
BEGIN
  -- Verifica se o novo horário de banca está dentro do intervalo mínimo de 30 minutos
  IF EXISTS (
    SELECT 1
    FROM BANCA
    WHERE ABS(EXTRACT(EPOCH FROM NEW.dataHora - dataHora)) < 1800  -- 1800 segundos = 30 minutos
  ) THEN
    RAISE EXCEPTION 'Intervalo mínimo de 30 minutos entre bancas não atendido.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crie o gatilho que chama a função antes de inserir uma nova banca
CREATE TRIGGER verifica_intervalo_banca_trigger
BEFORE INSERT ON BANCA
FOR EACH ROW
EXECUTE FUNCTION verifica_intervalo_banca();