import { useGameStore } from '../../store/gameStore.js';
import { PATH_MODE_ORDER, PATH_MODES } from '../../data/pathmodes.js';
import { showToast } from '../../components/GlobalToast.jsx';

// Дії знизу: журнал, шкали, практики, апгрейд режиму, reset.
// onOpen — функція з parent, відкриває модалку відповідного типу.
export default function ActionsBar({ onOpen }) {
  const pathMode = useGameStore((s) => s.pathMode);
  const upgradePathMode = useGameStore((s) => s.upgradePathMode);

  const idx = PATH_MODE_ORDER.indexOf(pathMode);
  const canUpgrade = idx >= 0 && idx < PATH_MODE_ORDER.length - 1;
  const nextMode = canUpgrade ? PATH_MODE_ORDER[idx + 1] : null;

  function handleUpgrade() {
    if (!nextMode) return;
    const ok = window.confirm(
      `Підняти шлях до «${PATH_MODES[nextMode].name}»? Знизити назад буде неможливо.`,
    );
    if (ok) {
      upgradePathMode(nextMode);
      showToast(`шлях підвищено: ${PATH_MODES[nextMode].name}`, 'success');
    }
  }

  return (
    <div className="lvl-actions">
      <button type="button" className="btn btn-ghost" onClick={() => onOpen('journal')}>
        журнал
      </button>
      <button type="button" className="btn btn-ghost" onClick={() => onOpen('scales')}>
        шкали
      </button>
      <button type="button" className="btn btn-ghost" onClick={() => onOpen('practices')}>
        практики
      </button>
      <button type="button" className="btn btn-ghost" onClick={() => onOpen('channels')}>
        канали
      </button>
      <button type="button" className="btn btn-ghost" onClick={() => onOpen('daily')}>
        ☉ ритуал
      </button>
      <button type="button" className="btn btn-ghost" onClick={() => onOpen('history')}>
        ⧖ історія
      </button>
      {canUpgrade && (
        <button type="button" className="btn btn-ghost" onClick={handleUpgrade}>
          ↑ {PATH_MODES[nextMode].name}
        </button>
      )}
      <button
        type="button"
        className="btn btn-ghost btn-reset"
        onClick={() => onOpen('reset')}
      >
        ↻ новий шлях
      </button>
    </div>
  );
}
