import { useGameStore } from '../../store/gameStore.js';
import { findPetal } from '../../data/petals.js';
import Mandala12 from './Mandala12.jsx';
import PetalView from './PetalView.jsx';
import './styles.css';

// Розширений шлях — 12 пелюсток (сфери життя). Активується після 7 рівнів.
// Routing внутрішній: якщо currentPetalId є — показуємо PetalView, інакше — мандалу-селектор.

export default function Petals() {
  const currentPetalId = useGameStore((s) => s.currentPetalId);
  const petal = currentPetalId ? findPetal(currentPetalId) : null;

  if (petal) return <PetalView petal={petal} />;
  return <Mandala12 />;
}
