/** Estados posibles de la animación shuffle. */
export type ShufflePhase =
  | 'idle' // Sin animación, esperando Roll
  | 'shuffling' // Animación en curso (~3 segundos)
  | 'result'; // Animación terminada, mostrando resultado
