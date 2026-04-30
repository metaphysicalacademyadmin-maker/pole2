import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { getCellsForLevel } from '../../data/cells/index.js';
import Topbar from './Topbar.jsx';
import Pyramid from './Pyramid.jsx';
import BodyHologram from './BodyHologram.jsx';
import CellView from './CellView.jsx';
import BarometersList from './BarometersList.jsx';
import JournalMini from './JournalMini.jsx';
import ActionsBar from './ActionsBar.jsx';
import JournalModal from '../../components/modals/JournalModal.jsx';
import ScalesModal from '../../components/modals/ScalesModal.jsx';
import PracticesModal from '../../components/modals/PracticesModal.jsx';
import ChannelsModal from '../../components/modals/ChannelsModal.jsx';
import DailyRitualModal from '../../components/modals/DailyRitualModal.jsx';
import ResetConfirmDialog from '../../components/modals/ResetConfirmDialog.jsx';
import './styles.css';
import './extras.css';

// Композиція робочого рівня: топбар, 3-колонкова сітка
// (піраміда + клітинка + барометри/журнал), панель дій.
// Перехід у Key/Final-сцену — через store (awaitingKey, currentLevel),
// не через локальний стейт.
export default function Level() {
  const currentLevel = useGameStore((s) => s.currentLevel);
  const currentCellIdx = useGameStore((s) => s.currentCellIdx);
  const pathMode = useGameStore((s) => s.pathMode);
  const [openModal, setOpenModal] = useState(null);

  const cells = getCellsForLevel(currentLevel, pathMode);
  const cell = cells[currentCellIdx];

  // Захист на випадок коли currentLevel взагалі не має клітинок (наприклад 0).
  if (!cell) return null;

  return (
    <main className="scene">
      <Topbar />

      <div className="lvl-grid">
        <aside>
          <Pyramid />
          <BodyHologram />
        </aside>

        <CellView
          cell={cell}
          levelN={currentLevel}
          totalCells={cells.length}
          currentIdx={currentCellIdx}
        />

        <aside>
          <BarometersList />
          <JournalMini onOpen={() => setOpenModal('journal')} />
        </aside>
      </div>

      <ActionsBar onOpen={setOpenModal} />

      {openModal === 'journal' && <JournalModal onClose={() => setOpenModal(null)} />}
      {openModal === 'scales' && <ScalesModal onClose={() => setOpenModal(null)} />}
      {openModal === 'practices' && <PracticesModal onClose={() => setOpenModal(null)} />}
      {openModal === 'channels' && <ChannelsModal onClose={() => setOpenModal(null)} />}
      {openModal === 'daily' && <DailyRitualModal onClose={() => setOpenModal(null)} />}
      {openModal === 'reset' && <ResetConfirmDialog onClose={() => setOpenModal(null)} />}
    </main>
  );
}
