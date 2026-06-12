SET NAMES utf8mb4;

-- colunas extras pra plano premium e foto de perfil/carro.
-- fotos guardadas como base64 em MEDIUMTEXT pra evitar storage de arquivos.

ALTER TABLE usuarios
  ADD COLUMN plano        ENUM('free','premium') NOT NULL DEFAULT 'free' AFTER senha_hash,
  ADD COLUMN plano_ciclo  ENUM('mensal','anual') NULL AFTER plano,
  ADD COLUMN plano_inicio DATETIME NULL AFTER plano_ciclo,
  ADD COLUMN plano_fim    DATETIME NULL AFTER plano_inicio,
  ADD COLUMN foto         MEDIUMTEXT NULL AFTER plano_fim;

ALTER TABLE carros
  ADD COLUMN foto MEDIUMTEXT NULL AFTER cor;
