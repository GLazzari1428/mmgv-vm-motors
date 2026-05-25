import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { carrosMock } from '@utils/mockData'

// lista de carros e carro selecionado, persiste so o id selecionado
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
    }),
    {
      name: 'mmgv-cars',
      partialize: (state) => ({ selectedCarId: state.selectedCarId }),
    }
  )
)
