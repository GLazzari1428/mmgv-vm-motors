-- vm motors - parte 2: dados iniciais (financeiro)
-- rodar depois do schema_financeiro.sql
-- usa os carros 1 (fiat uno) e 2 (fusca) criados na parte 1

INSERT INTO categorias_financeiras (id, codigo, nome, icone) VALUES
  (1, 'manutencao',  'Manutencao',  'wrench'),
  (2, 'combustivel', 'Combustivel', 'droplet'),
  (3, 'seguro',      'Seguro',      'check-circle'),
  (4, 'ipva',        'IPVA',        'info'),
  (5, 'multas',      'Multas',      'x-circle'),
  (6, 'outros',      'Outros',      'wallet');

-- transacoes do fiat uno (carro 1)
INSERT INTO transacoes (carro_id, categoria_id, descricao, data, valor) VALUES
  (1, 2, 'Posto Ipiranga',         '2026-05-18', 152.50),
  (1, 1, 'Troca de oleo e filtro', '2026-05-10', 230.00),
  (1, 5, 'Excesso de velocidade',  '2026-05-06', 60.00),
  (1, 2, 'Posto Shell',            '2026-05-02', 160.00),
  (1, 3, 'Parcela do seguro',      '2026-05-01', 90.00),
  (1, 1, 'Pastilha de freio',      '2026-04-28', 150.00);

-- transacoes do fusca (carro 2)
INSERT INTO transacoes (carro_id, categoria_id, descricao, data, valor) VALUES
  (2, 1, 'Regulagem do carburador', '2026-05-15', 280.00),
  (2, 2, 'Posto BR',                '2026-05-12', 100.00),
  (2, 2, 'Posto Ipiranga',          '2026-05-03', 90.00);
