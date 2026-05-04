import { useGameStore } from '../../store/gameStore.js';
import { findPetal, PETALS } from '../../data/petals.js';
import Mandala12 from './Mandala12.jsx';
import PetalView from './PetalView.jsx';
import MandalaFinal from '../MandalaFinal/index.jsx';
import './styles.css';

// Розширений шлях — 12 пелюсток (сфери життя). Активується після 7 рівнів.
// Routing:
//   currentPetalId є           → PetalView (одна пелюстка)
//   усі 12 done && !shown      → MandalaFinal (церемонія Квітки Життя)
//   інакше                     → Mandala12 (селектор)

export default function Petals({ openCosmo, openCabinet }) {
  const currentPetalId = useGameStore((s) => s.currentPetalId);
  const petalProgress = useGameStore((s) => s.petalProgress);
  const mandalaFinalShown = useGameStore((s) => s.mandalaFinalShown);

  const petal = currentPetalId ? findPetal(currentPetalId) : null;
  if (petal) return <PetalView petal={petal} openCabinet={openCabinet} />;

  const allDone = PETALS.every((p) => petalProgress?.[p.id]?.completed);
  if (allDone && !mandalaFinalShown) {
    return <MandalaFinal openCosmo={openCosmo} openCabinet={openCabinet} />;
  }

  return <Mandala12 openCabinet={openCabinet} />;
}
