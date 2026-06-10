import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { carsService } from '@services/carsService'

// lista de carros vinda da API e o carro selecionado.
// so o id selecionado e persistido; os carros sao sempre buscados frescos.
export const useCarsStore = create(
  persist(
    (set, get) => ({
      carros: [],
      selectedCarId: null,
      loading: false,
      loaded: false,

      // busca os carros do usuario logado
      fetchCars: async () => {
        set({ loading: true })
        try {
          const carros = await carsService.list()
          set((st) => {
            const existe = carros.some((c) => c.id === st.selectedCarId)
            return {
              carros,
              loading: false,
              loaded: true,
              selectedCarId: existe ? st.selectedCarId : (carros[0]?.id ?? null),
            }
          })
          return carros
        } catch (err) {
          set({ loading: false })
          throw err
        }
      },

      selectCar: (id) => set({ selectedCarId: id }),

      getSelectedCar: () => {
        const { carros, selectedCarId } = get()
        return carros.find((c) => c.id === selectedCarId) || carros[0] || null
      },

      // navega pro proximo ou anterior no seletor de carro
      cycleCar: (dir) => {
        const { carros, selectedCarId } = get()
        if (!carros.length) return
        const i = carros.findIndex((c) => c.id === selectedCarId)
        const next = (i + dir + carros.length) % carros.length
        set({ selectedCarId: carros[next].id })
      },

      // cria um carro na API e ja deixa ele selecionado
      addCar: async (payload) => {
        const novo = await carsService.create(payload)
        set((st) => ({ carros: [...st.carros, novo], selectedCarId: novo.id }))
        return novo
      },

      // recarrega um carro especifico (ex: depois de registrar manutencao)
      refreshCar: async (id) => {
        const carro = await carsService.get(id)
        set((st) => ({ carros: st.carros.map((c) => (c.id === carro.id ? carro : c)) }))
        return carro
      },

      // edita um carro na API e atualiza no estado
      updateCar: async (id, payload) => {
        const atualizado = await carsService.update(id, payload)
        set((st) => ({
          carros: st.carros.map((c) => (c.id === atualizado.id ? atualizado : c)),
        }))
        return atualizado
      },

      // remove um carro e ajusta o selecionado
      removeCar: async (id) => {
        await carsService.remove(id)
        set((st) => {
          const carros = st.carros.filter((c) => c.id !== id)
          const aindaExiste = carros.some((c) => c.id === st.selectedCarId)
          return {
            carros,
            selectedCarId: aindaExiste ? st.selectedCarId : (carros[0]?.id ?? null),
          }
        })
      },

      // limpa o estado (usado no logout)
      reset: () => set({ carros: [], selectedCarId: null, loaded: false }),
    }),
    {
      name: 'mmgv-cars',
      partialize: (state) => ({ selectedCarId: state.selectedCarId }),
    }
  )
)
