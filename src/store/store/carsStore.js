import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { carrosMock } from '@utils/mockData'

// itens base que todo carro novo comeca acompanhando
function itensBase() {
  return [
    {
      id: 'oleo',
      nome: 'Oleo do motor',
      icone: 'droplet',
      status: 'ok',
      ultimaTroca: '-',
      proximaTroca: '-',
    },
    {
      id: 'pneu',
      nome: 'Pneus',
      icone: 'car',
      status: 'ok',
      ultimaTroca: '-',
      proximaTroca: '-',
    },
    {
      id: 'filtro',
      nome: 'Filtro de ar',
      icone: 'wind',
      status: 'ok',
      ultimaTroca: '-',
      proximaTroca: '-',
    },
  ]
}

// lista de carros e carro selecionado, persiste a lista e o id selecionado
export const useCarsStore = create(
  persist(
    (set, get) => ({
      carros: carrosMock,
      selectedCarId: carrosMock[0].id,

      selectCar: (id) => set({ selectedCarId: id }),

      getSelectedCar: () => {
        const { carros, selectedCarId } = get()
        return carros.find((c) => c.id === selectedCarId) || carros[0]
      },

      // navega pro proximo ou anterior no seletor de carro
      cycleCar: (dir) => {
        const { carros, selectedCarId } = get()
        const i = carros.findIndex((c) => c.id === selectedCarId)
        const next = (i + dir + carros.length) % carros.length
        set({ selectedCarId: carros[next].id })
      },

      // adiciona um carro novo e ja deixa ele selecionado
      addCar: ({ modelo, placa, ano, cor }) => {
        const novo = {
          id: `carro-${Date.now()}`,
          modelo,
          placa,
          ano: Number(ano) || ano,
          cor: cor || '-',
          proximaRevisao: '-',
          itens: itensBase(),
        }
        set((state) => ({
          carros: [...state.carros, novo],
          selectedCarId: novo.id,
        }))
        return novo
      },
    }),
    {
      name: 'mmgv-cars',
      partialize: (state) => ({
        carros: state.carros,
        selectedCarId: state.selectedCarId,
      }),
    }
  )
)
