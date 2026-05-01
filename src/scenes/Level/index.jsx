import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { getCellsForLevel, getLockedCellsForLevel } from '../../data/cells/index.js';
import { ARCHETYPES } from '../../data/archetypes.js';
import { suggestArchetype } from '../../utils/archetype-suggest.js';
import { detectArchetypeTransformation } from '../../utils/archetype-transform-detector.js';
import ArchetypeCalibrator from '../../components/ArchetypeCalibrator/index.jsx';
import ArchetypeTransform from '../../components/ArchetypeTransform/index.jsx';
import ShadowMirror from '../../components/ShadowMirror/index.jsx';
import CrisisModal from '../../components/CrisisModal/index.jsx';
import SpecializationChoice from '../../components/SpecializationChoice/index.jsx';
import CollectiveRitual from '../../components/CollectiveRitual/index.jsx';
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
import EveningRitualModal from '../../components/modals/EveningRitualModal.jsx';
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
  const cellAnswers = useGameStore((s) => s.cellAnswers);
  const calStatus = useGameStore((s) => s.archetypeCalibration?.status);
  const startCal = useGameStore((s) => s.startArchetypeCalibration);
  const completedLevels = useGameStore((s) => s.completedLevels);
  const currentTrans = useGameStore((s) => s.currentArchetypeTransformation);
  const startTrans = useGameStore((s) => s.startArchetypeTransformation);
  const specialization = useGameStore((s) => s.specialization);
  const openSpec = useGameStore((s) => s.openSpecializationChoice);
  const [openModal, setOpenModal] = useState(null);
  const [autoLaunchPractice, setAutoLaunchPractice] = useState(null);

  // Калібровка архетипу — після 3 відповідей, один раз за сесію.
  useEffect(() => {
    if (calStatus) return;
    const answerCount = Object.keys(cellAnswers || {}).length;
    if (answerCount < 3) return;
    const ids = new Set(ARCHETYPES.map((a) => a.id));
    const suggested = suggestArchetype(useGameStore.getState(), ids);
    if (suggested) startCal(suggested);
  }, [cellAnswers, calStatus, startCal]);

  // Трансформація архетипу — після завершення рівнів 5/6/7
  useEffect(() => {
    if (currentTrans) return;
    const t = detectArchetypeTransformation(useGameStore.getState());
    if (t) startTrans({ fromId: t.from.id, toId: t.to.id, eligibleLevel: t.eligibleLevel });
  }, [completedLevels, currentTrans, startTrans]);

  // Спеціалізація — після завершення рівня 4 (Серце), один раз за сесію
  useEffect(() => {
    if (specialization) return;
    if ((completedLevels || []).includes(4)) openSpec();
  }, [completedLevels, specialization, openSpec]);

  const cells = getCellsForLevel(currentLevel, pathMode, useGameStore.getState());
  const lockedCells = getLockedCellsForLevel(currentLevel, useGameStore.getState());
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
          lockedCells={lockedCells}
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

      <CollectiveRitual />
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
      {openModal === 'evening' && <EveningRitualModal onClose={() => setOpenModal(null)} />}
      {openModal === 'history' && <HistoryModal onClose={() => setOpenModal(null)} />}
      {openModal === 'reset' && <ResetConfirmDialog onClose={() => setOpenModal(null)} />}

      <ArchetypeCalibrator />
      <ArchetypeTransform />
      <ShadowMirror />
      <CrisisModal />
      <SpecializationChoice />
    </main>
  );
}
