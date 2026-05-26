SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- usuarios do app
CREATE TABLE usuarios (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome          VARCHAR(120) NOT NULL,
  email         VARCHAR(160) NOT NULL,
  senha_hash    VARCHAR(255) NOT NULL,
  criado_em     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuarios_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- carros de cada usuario
CREATE TABLE carros (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id      INT UNSIGNED NOT NULL,
  modelo          VARCHAR(80) NOT NULL,
  placa           VARCHAR(10) NOT NULL,
  ano             SMALLINT UNSIGNED NULL,
  cor             VARCHAR(40) NULL,
  proxima_revisao DATE NULL,
  criado_em       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_carros_usuario_placa (usuario_id, placa),
  KEY idx_carros_usuario (usuario_id),
  CONSTRAINT fk_carros_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- tipos de item de manutencao (lookup): oleo, pneu, filtro, etc
CREATE TABLE tipos_item (
  id     INT UNSIGNED NOT NULL AUTO_INCREMENT,
  codigo VARCHAR(40) NOT NULL,
  nome   VARCHAR(80) NOT NULL,
  icone  VARCHAR(40) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tipos_item_codigo (codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- item de manutencao acompanhado por carro
CREATE TABLE itens_manutencao (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  carro_id      INT UNSIGNED NOT NULL,
  tipo_item_id  INT UNSIGNED NOT NULL,
  ultima_troca  DATE NULL,
  proxima_troca DATE NULL,
  criado_em     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_item_carro_tipo (carro_id, tipo_item_id),
  KEY idx_item_carro (carro_id),
  KEY idx_item_tipo (tipo_item_id),
  CONSTRAINT fk_item_carro FOREIGN KEY (carro_id)
    REFERENCES carros (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_item_tipo FOREIGN KEY (tipo_item_id)
    REFERENCES tipos_item (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- status calculado de cada item, sem coluna fixa
-- late: proxima_troca ja passou
-- warn: vence nos proximos 30 dias
-- ok: tem folga ou sem data definida
CREATE OR REPLACE VIEW vw_itens_status AS
SELECT
  im.id,
  im.carro_id,
  ti.codigo AS tipo_codigo,
  ti.nome   AS tipo_nome,
  ti.icone  AS tipo_icone,
  im.ultima_troca,
  im.proxima_troca,
  CASE
    WHEN im.proxima_troca IS NULL THEN 'ok'
    WHEN im.proxima_troca < CURDATE() THEN 'late'
    WHEN im.proxima_troca <= CURDATE() + INTERVAL 30 DAY THEN 'warn'
    ELSE 'ok'
  END AS status
FROM itens_manutencao im
JOIN tipos_item ti ON ti.id = im.tipo_item_id;
