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
import {
  DailyPulse, ActiveChannels, ConstellationFigures, Archetypes, KaiTrust, PracticesPanel,
} from '../../components/panels/index.js';
import JournalModal from '../../components/modals/JournalModal.jsx';
import ScalesModal from '../../components/modals/ScalesModal.jsx';
import PracticesModal from '../../components/modals/PracticesModal.jsx';
import ChannelsModal from '../../components/modals/ChannelsModal.jsx';
import DailyRitualModal from '../../components/modals/DailyRitualModal.jsx';
import HistoryModal from '../../components/modals/HistoryModal.jsx';
import ResetConfirmDialog from '../../components/modals/ResetConfirmDialog.jsx';
import './styles.css';
import './extras.css';

// Композиція робочого рівня: топбар, 3-колонкова сітка
// (піраміда + клітинка + барометри + 8 панелей), панель дій.
export default function Level({ openSoulField }) {
  const currentLevel = useGameStore((s) => s.currentLevel);
  const currentCellIdx = useGameStore((s) => s.currentCellIdx);
  const pathMode = useGameStore((s) => s.pathMode);
  const uiMode = useGameStore((s) => s.uiMode);
  const setUiMode = useGameStore((s) => s.setUiMode);
  const [openModal, setOpenModal] = useState(null);
  const [autoLaunchPractice, setAutoLaunchPractice] = useState(null);

  const cells = getCellsForLevel(currentLevel, pathMode);
  const cell = cells[currentCellIdx];
  if (!cell) return null;
  const isFocus = uiMode === 'focus';

  return (
    <main className="scene">
      <Topbar onOpenSoulField={openSoulField} />

      <div className="lvl-mode-toggle">
        <button type="button" className={`mode-btn${!isFocus ? ' active' : ''}`}
          onClick={() => setUiMode('map')}>◯ карта</button>
        <button type="button" className={`mode-btn${isFocus ? ' active' : ''}`}
          onClick={() => setUiMode('focus')}>◉ фокус</button>
      </div>

      <div className={`lvl-grid${isFocus ? ' lvl-focus' : ''}`}>
        {!isFocus && (
          <aside>
            <Pyramid />
            <BodyHologram />
            <DailyPulse onClick={() => setOpenModal('daily')} />
          </aside>
        )}

        <CellView
          cell={cell}
          levelN={currentLevel}
          totalCells={cells.length}
          currentIdx={currentCellIdx}
        />

        {!isFocus && (
          <aside>
            <BarometersList />
            <PracticesPanel onLaunch={(p) => {
              setAutoLaunchPractice(p);
              setOpenModal('practices');
            }} />
            <ActiveChannels onClick={() => setOpenModal('channels')} />
            <ConstellationFigures />
            <Archetypes />
            <KaiTrust />
            <JournalMini onOpen={() => setOpenModal('journal')} />
          </aside>
        )}
      </div>

      <ActionsBar onOpen={setOpenModal} />

      {openModal === 'journal' && <JournalModal onClose={() => setOpenModal(null)} />}
      {openModal === 'scales' && <ScalesModal onClose={() => setOpenModal(null)} />}
      {openModal === 'practices' && (
        <PracticesModal
          onClose={() => { setOpenModal(null); setAutoLaunchPractice(null); }}
          autoLaunch={autoLaunchPractice}
        />
      )}
      {openModal === 'channels' && <ChannelsModal onClose={() => setOpenModal(null)} />}
      {openModal === 'daily' && <DailyRitualModal onClose={() => setOpenModal(null)} />}
      {openModal === 'history' && <HistoryModal onClose={() => setOpenModal(null)} />}
      {openModal === 'reset' && <ResetConfirmDialog onClose={() => setOpenModal(null)} />}
    </main>
  );
}
