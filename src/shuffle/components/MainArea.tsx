import { useEffect, useState } from 'preact/hooks';
import { shufflePhaseSignal } from '../shuffle.signals';
import ShuffleArea from './ShuffleArea';
import RollButton from './RollButton';
import ResultDisplay from './ResultDisplay';

/**
 * Contenedor reactivo del área principal.
 * Gestiona la visibilidad de ShuffleArea/RollButton vs ResultDisplay
 * en función de shufflePhaseSignal, evitando manipulación de DOM manual.
 */
export default function MainArea() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const phase = shufflePhaseSignal.value;
  const isResult = phase === 'result';

  if (!mounted) return null;

  return (
    <div class="flex flex-col items-center justify-center gap-12 w-full max-w-lg">
      {isResult ? (
        <ResultDisplay />
      ) : (
        <>
          <ShuffleArea />
          <RollButton />
        </>
      )}
    </div>
  );
}
