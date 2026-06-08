SET NAMES utf8mb4;
SET time_zone = '-03:00';

-- categorias financeiras : manutencao, combustivel, etc
CREATE TABLE categorias_financeiras (
  id     INT UNSIGNED NOT NULL AUTO_INCREMENT,
  codigo VARCHAR(40) NOT NULL,
  nome   VARCHAR(80) NOT NULL,
  icone  VARCHAR(40) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categorias_codigo (codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- transacoes financeiras por carro
CREATE TABLE transacoes (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  carro_id      INT UNSIGNED NOT NULL,
  categoria_id  INT UNSIGNED NOT NULL,
  descricao     VARCHAR(160) NOT NULL,
  data          DATE NOT NULL,
  valor         DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  criado_em     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_transacoes_carro (carro_id),
  KEY idx_transacoes_categoria (categoria_id),
  KEY idx_transacoes_data (data),
  CONSTRAINT fk_transacoes_carro FOREIGN KEY (carro_id)
    REFERENCES carros (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_transacoes_categoria FOREIGN KEY (categoria_id)
    REFERENCES categorias_financeiras (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- gasto por carro, categoria e mes (alimenta o resumo do financeiro)
CREATE OR REPLACE VIEW vw_gastos_mensais AS
SELECT
  t.carro_id,
  cf.codigo AS categoria_codigo,
  cf.nome   AS categoria_nome,
  DATE_FORMAT(t.data, '%Y-%m-01') AS mes,
  SUM(t.valor) AS total
FROM transacoes t
JOIN categorias_financeiras cf ON cf.id = t.categoria_id
GROUP BY t.carro_id, cf.codigo, cf.nome, DATE_FORMAT(t.data, '%Y-%m-01');
