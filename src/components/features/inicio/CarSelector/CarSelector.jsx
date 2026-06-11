import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCarsStore } from '@store/carsStore'
import styles from './CarSelector.module.css'

// seletor de carro
export const CarSelector = () => {
  const carro = useCarsStore((s) => s.getSelectedCar())
  const cycleCar = useCarsStore((s) => s.cycleCar)

  return (
    <div className={styles.selector}>
      <button
        className={styles.chevron}
        onClick={() => cycleCar(-1)}
        aria-label="carro anterior"
      >
        <ChevronLeft size={20} />
      </button>

      <div className={styles.info}>
        <div>
          <p className={styles.modelo}>{carro.modelo}</p>
          <p className={styles.placa}>{carro.placa}</p>
        </div>
      </div>

      <button
        className={styles.chevron}
        onClick={() => cycleCar(1)}
        aria-label="proximo carro"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
