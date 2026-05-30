INSERT INTO usuarios (id, nome, email, senha_hash) VALUES
  (1, 'Usuário Teste', 'test_user@email.com', '$2y$10$trocarPorHashRealNoBackend0000000000000000000000000');

INSERT INTO tipos_item (id, codigo, nome, icone) VALUES
  (1, 'oleo',        'Óleo do motor',   'droplet'),
  (2, 'pneu',        'Pneus',           'car'),
  (3, 'filtro',      'Filtro de ar',    'wind'),
  (4, 'correia',     'Correia dentada', 'settings'),
  (5, 'alinhamento', 'Alinhamento',     'sliders-horizontal');

INSERT INTO carros (id, usuario_id, modelo, placa, ano, cor, proxima_revisao) VALUES
  (1, 1, 'Fiat Uno',   'XXX-1B24', 2012, 'Branco', '2026-08-15'),
  (2, 1, 'Fusca Azul', 'YYY-1Z30', 1978, 'Azul',   '2026-07-02');

-- itens do fiat uno (carro 1)
INSERT INTO itens_manutencao (carro_id, tipo_item_id, ultima_troca, proxima_troca, km) VALUES
  (1, 1, '2026-03-10', '2026-09-10', 73200),
  (1, 2, '2025-01-20', '2026-06-20', 68000),
  (1, 3, '2025-02-05', '2026-02-05', 69500),
  (1, 4, '2025-12-12', '2027-12-12', 71000),
  (1, 5, '2026-04-01', '2026-10-01', 73800);

-- itens do fusca (carro 2)
INSERT INTO itens_manutencao (carro_id, tipo_item_id, ultima_troca, proxima_troca, km) VALUES
  (2, 1, '2025-09-15', '2026-03-15', 148500),
  (2, 2, '2026-02-10', '2027-02-10', 151200),
  (2, 3, '2026-03-22', '2026-09-22', 152000),
  (2, 5, '2025-11-05', '2026-06-05', 149800);

-- historico de trocas (itens 1 a 5 do fiat uno, 6 a 9 do fusca) pra demo dos graficos
INSERT INTO historico_manutencao (item_id, ultima_troca, proxima_troca, km) VALUES
  (1, '2024-09-10', '2025-03-10', 61000),
  (1, '2025-03-10', '2025-09-10', 67000),
  (1, '2025-09-12', '2026-03-10', 70000),
  (1, '2026-03-10', '2026-09-10', 73200),
  (2, '2024-01-20', '2025-01-20', 55000),
  (2, '2025-01-20', '2026-06-20', 68000),
  (3, '2024-02-05', '2025-02-05', 56500),
  (3, '2025-02-05', '2026-02-05', 69500),
  (4, '2023-12-12', '2025-12-12', 48000),
  (4, '2025-12-12', '2027-12-12', 71000),
  (5, '2024-10-01', '2025-04-01', 62000),
  (5, '2025-04-01', '2025-10-01', 66500),
  (5, '2025-10-05', '2026-04-01', 70800),
  (5, '2026-04-01', '2026-10-01', 73800),
  (6, '2025-03-15', '2025-09-15', 144000),
  (6, '2025-09-15', '2026-03-15', 148500),
  (8, '2025-03-22', '2026-03-22', 149000),
  (8, '2026-03-22', '2026-09-22', 152000);
