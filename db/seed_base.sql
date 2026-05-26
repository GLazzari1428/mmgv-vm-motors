-- vm motors - parte 1: dados iniciais (nucleo e manutencao)
-- rodar depois do schema_base.sql

INSERT INTO usuarios (id, nome, email, senha_hash) VALUES
  (1, 'Usuario Teste', 'test_user@email.com', '$2y$10$trocarPorHashRealNoBackend0000000000000000000000000');

INSERT INTO tipos_item (id, codigo, nome, icone) VALUES
  (1, 'oleo',        'Oleo do motor',   'droplet'),
  (2, 'pneu',        'Pneus',           'car'),
  (3, 'filtro',      'Filtro de ar',    'wind'),
  (4, 'correia',     'Correia dentada', 'settings'),
  (5, 'alinhamento', 'Alinhamento',     'sliders-horizontal');

INSERT INTO carros (id, usuario_id, modelo, placa, ano, cor, proxima_revisao) VALUES
  (1, 1, 'Fiat Uno',   'XXX-1B24', 2012, 'Branco', '2026-08-15'),
  (2, 1, 'Fusca Azul', 'YYY-1Z30', 1978, 'Azul',   '2026-07-02');

-- itens do fiat uno (carro 1)
INSERT INTO itens_manutencao (carro_id, tipo_item_id, ultima_troca, proxima_troca) VALUES
  (1, 1, '2026-03-10', '2026-09-10'),
  (1, 2, '2025-01-20', '2026-06-20'),
  (1, 3, '2025-02-05', '2026-02-05'),
  (1, 4, '2025-12-12', '2027-12-12'),
  (1, 5, '2026-04-01', '2026-10-01');

-- itens do fusca (carro 2)
INSERT INTO itens_manutencao (carro_id, tipo_item_id, ultima_troca, proxima_troca) VALUES
  (2, 1, '2025-09-15', '2026-03-15'),
  (2, 2, '2026-02-10', '2027-02-10'),
  (2, 3, '2026-03-22', '2026-09-22'),
  (2, 5, '2025-11-05', '2026-06-05');
