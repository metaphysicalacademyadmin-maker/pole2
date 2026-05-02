import GameModal from '../GameModal.jsx';
import { useGameStore } from '../../store/gameStore.js';
import { levelByNumber } from '../../data/levels.js';
import { chakraForLevel } from '../../data/chakras.js';
import { getCellsForLevel } from '../../data/cells/index.js';

const SYS = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export default function LevelInfoModal({ levelN, onClose }) {
  const lvl = levelByNumber(levelN);
  const chakra = chakraForLevel(levelN);
  const completedLevels = useGameStore((s) => s.completedLevels);
  const unlockedLevels = useGameStore((s) => s.unlockedLevels);
  const currentLevel = useGameStore((s) => s.currentLevel);
  const levelProgress = useGameStore((s) => s.levelProgress);
  const levelKeys = useGameStore((s) => s.levelKeys);
  const pathMode = useGameStore((s) => s.pathMode);
  const constellations = useGameStore((s) => s.constellations);

  if (!lvl) return null;

  const cells = getCellsForLevel(levelN, pathMode);
  const answered = levelProgress[levelN]?.answeredCells || [];
  const completed = completedLevels.includes(levelN);
  const current = currentLevel === levelN;
  const unlocked = unlockedLevels.includes(levelN) || completed;
  const myKey = levelKeys[levelN];
  const constellation = constellations[levelN];

  const status = completed ? 'завершено' : current ? 'у роботі' : unlocked ? 'відкрито' : 'заблоковано';
  const statusColor = completed ? '#a8c898' : current ? '#f0c574' : unlocked ? '#c8bca8' : '#968a7c';

  return (
    <GameModal
      open
      onClose={onClose}
      titleColor={chakra?.color || '#f0c574'}
      title={
        <>
          <div style={{
            width: 36, height: 36,
            borderRadius: '50%',
            background: `radial-gradient(circle at 35% 30%, ${chakra?.color || '#f0c574'}, ${chakra?.colorDeep || '#c89849'})`,
            border: `1.5px solid ${chakra?.color}`,
            flexShrink: 0,
          }} />
          <div>
            <div>{lvl.n}. {lvl.name}</div>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#c8bca8', letterSpacing: '2px', textTransform: 'uppercase' }}>
              {lvl.sub}
            </div>
          </div>
        </>
      }
    >
      <div style={{
        display: 'inline-block',
        padding: '4px 12px', borderRadius: 999,
        border: `1.5px solid ${statusColor}`, color: statusColor,
        fontFamily: SYS, fontSize: 11, fontWeight: 700,
        letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16,
      }}>
        {status}
      </div>

      {chakra && (
        <p style={{ fontFamily: SYS, fontStyle: 'italic', color: '#fff7e0', lineHeight: 1.55, fontSize: 15, marginBottom: 16 }}>
          {chakra.description}
        </p>
      )}

      {unlocked && cells.length > 0 && (
        <>
          <div style={{ fontFamily: SYS, fontSize: 11, fontWeight: 700, letterSpacing: '4px', color: '#f0c574', textTransform: 'uppercase', marginBottom: 8 }}>
            Прогрес клітинок
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: SYS, fontSize: 14, color: '#fff7e0' }}>
              <strong style={{ color: chakra?.color }}>{answered.length}</strong> / {cells.length} клітинок
            </div>
            <div style={{
              height: 8, background: 'rgba(40,28,60,0.7)',
              borderRadius: 999, overflow: 'hidden', marginTop: 6,
            }}>
              <div style={{
                height: '100%', width: `${(answered.length / cells.length) * 100}%`,
                background: chakra?.color || '#f0c574', transition: 'width 0.6s ease',
              }} />
            </div>
          </div>
        </>
      )}

      {myKey && (
        <div style={{
          background: 'rgba(232,196,118,0.08)',
          border: `1.5px solid ${chakra?.color || '#f0c574'}`,
          borderRadius: 12, padding: 16, marginBottom: 16,
        }}>
          <div style={{ fontFamily: SYS, fontSize: 11, fontWeight: 700, letterSpacing: '4px', color: '#f0c574', textTransform: 'uppercase', marginBottom: 8 }}>
            Твій ключ
          </div>
          <div style={{ fontFamily: SYS, fontStyle: 'italic', fontSize: 17, color: '#fff7e0', lineHeight: 1.45 }}>
            «{myKey}»
          </div>
        </div>
      )}

      {constellation && constellation.resolution && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: SYS, fontSize: 11, fontWeight: 700, letterSpacing: '4px', color: '#c9b3e8', textTransform: 'uppercase', marginBottom: 8 }}>
            Розстановка
          </div>
          <div style={{ fontFamily: SYS, fontSize: 12, color: '#c8bca8' }}>
            {constellation.figures?.length || 0} фігур у полі
          </div>
          <div style={{ fontFamily: SYS, fontStyle: 'italic', fontSize: 13, color: '#fff7e0', marginTop: 6, opacity: 0.85, lineHeight: 1.5 }}>
            {constellation.resolution.split('\n')[0]}…
          </div>
        </div>
      )}

      {!unlocked && (
        <div style={{
          padding: 16, textAlign: 'center',
          background: 'rgba(40, 28, 60, 0.5)', borderRadius: 10,
          fontFamily: SYS, fontStyle: 'italic', color: '#c8bca8',
        }}>
          🔒 Цей рівень розблокується після завершення попереднього.
        </div>
      )}
    </GameModal>
  );
}
