// dados mock do app, sem backend por enquanto
// status do item: ok (em dia), warn (alerta), late (vencido)

export const carrosMock = [
  {
    id: 'uno',
    modelo: 'Fiat Uno',
    placa: 'XXX-1B24',
    ano: 2012,
    cor: 'Branco',
    proximaRevisao: '15/08/2026',
    itens: [
      {
        id: 'oleo',
        nome: 'Oleo do motor',
        icone: 'droplet',
        status: 'ok',
        ultimaTroca: '10/03/2026',
        proximaTroca: '10/09/2026',
      },
      {
        id: 'pneu',
        nome: 'Pneus',
        icone: 'car',
        status: 'warn',
        ultimaTroca: '20/01/2025',
        proximaTroca: '20/06/2026',
      },
      {
        id: 'filtro',
        nome: 'Filtro de ar',
        icone: 'wind',
        status: 'late',
        ultimaTroca: '05/02/2025',
        proximaTroca: '05/02/2026',
      },
      {
        id: 'correia',
        nome: 'Correia dentada',
        icone: 'settings',
        status: 'ok',
        ultimaTroca: '12/12/2025',
        proximaTroca: '12/12/2027',
      },
      {
        id: 'alinhamento',
        nome: 'Alinhamento',
        icone: 'sliders-horizontal',
        status: 'ok',
        ultimaTroca: '01/04/2026',
        proximaTroca: '01/10/2026',
      },
    ],
  },
  {
    id: 'fusca',
    modelo: 'Fusca Azul',
    placa: 'YYY-1Z30',
    ano: 1978,
    cor: 'Azul',
    proximaRevisao: '02/07/2026',
    itens: [
      {
        id: 'oleo',
        nome: 'Oleo do motor',
        icone: 'droplet',
        status: 'late',
        ultimaTroca: '15/09/2025',
        proximaTroca: '15/03/2026',
      },
      {
        id: 'pneu',
        nome: 'Pneus',
        icone: 'car',
        status: 'ok',
        ultimaTroca: '10/02/2026',
        proximaTroca: '10/02/2027',
      },
      {
        id: 'filtro',
        nome: 'Filtro de ar',
        icone: 'wind',
        status: 'ok',
        ultimaTroca: '22/03/2026',
        proximaTroca: '22/09/2026',
      },
      {
        id: 'alinhamento',
        nome: 'Alinhamento',
        icone: 'sliders-horizontal',
        status: 'warn',
        ultimaTroca: '05/11/2025',
        proximaTroca: '05/06/2026',
      },
    ],
  },
]

// resumo financeiro por carro
export const financeiroMock = {
  uno: {
    totalMes: 842.5,
    mesAnterior: 1190.0,
    categorias: [
      { id: 'manutencao', nome: 'Manutencao', icone: 'wrench', valor: 380.0 },
      { id: 'combustivel', nome: 'Combustivel', icone: 'droplet', valor: 312.5 },
      { id: 'seguro', nome: 'Seguro', icone: 'check-circle', valor: 90.0 },
      { id: 'ipva', nome: 'IPVA', icone: 'info', valor: 0 },
      { id: 'multas', nome: 'Multas', icone: 'x-circle', valor: 60.0 },
      { id: 'outros', nome: 'Outros', icone: 'wallet', valor: 0 },
    ],
    transacoes: [
      {
        id: 't1',
        categoria: 'combustivel',
        icone: 'droplet',
        descricao: 'Posto Ipiranga',
        data: '18/05/2026',
        valor: 152.5,
      },
      {
        id: 't2',
        categoria: 'manutencao',
        icone: 'wrench',
        descricao: 'Troca de oleo e filtro',
        data: '10/05/2026',
        valor: 230.0,
      },
      {
        id: 't3',
        categoria: 'multas',
        icone: 'x-circle',
        descricao: 'Excesso de velocidade',
        data: '06/05/2026',
        valor: 60.0,
      },
      {
        id: 't4',
        categoria: 'combustivel',
        icone: 'droplet',
        descricao: 'Posto Shell',
        data: '02/05/2026',
        valor: 160.0,
      },
      {
        id: 't5',
        categoria: 'seguro',
        icone: 'check-circle',
        descricao: 'Parcela do seguro',
        data: '01/05/2026',
        valor: 90.0,
      },
      {
        id: 't6',
        categoria: 'manutencao',
        icone: 'wrench',
        descricao: 'Pastilha de freio',
        data: '28/04/2026',
        valor: 150.0,
      },
    ],
  },
  fusca: {
    totalMes: 470.0,
    mesAnterior: 320.0,
    categorias: [
      { id: 'manutencao', nome: 'Manutencao', icone: 'wrench', valor: 280.0 },
      { id: 'combustivel', nome: 'Combustivel', icone: 'droplet', valor: 190.0 },
      { id: 'seguro', nome: 'Seguro', icone: 'check-circle', valor: 0 },
      { id: 'ipva', nome: 'IPVA', icone: 'info', valor: 0 },
      { id: 'multas', nome: 'Multas', icone: 'x-circle', valor: 0 },
      { id: 'outros', nome: 'Outros', icone: 'wallet', valor: 0 },
    ],
    transacoes: [
      {
        id: 'f1',
        categoria: 'manutencao',
        icone: 'wrench',
        descricao: 'Regulagem do carburador',
        data: '15/05/2026',
        valor: 280.0,
      },
      {
        id: 'f2',
        categoria: 'combustivel',
        icone: 'droplet',
        descricao: 'Posto BR',
        data: '12/05/2026',
        valor: 100.0,
      },
      {
        id: 'f3',
        categoria: 'combustivel',
        icone: 'droplet',
        descricao: 'Posto Ipiranga',
        data: '03/05/2026',
        valor: 90.0,
      },
    ],
  },
}

// usuario mock pra tela de perfil
export const usuarioMock = {
  nome: 'Gustavo Lazzari',
  email: 'gustavo@email.com',
}
