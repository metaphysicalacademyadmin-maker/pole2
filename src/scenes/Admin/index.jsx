import { useGameStore } from '../../store/gameStore.js';
import { findArchetype } from '../../data/archetypes.js';
import { findSpecialization } from '../../data/specializations.js';
import { COSMO_LEVELS, currentCosmoLevel } from '../../data/cosmo-levels.js';
import { showToast } from '../../components/GlobalToast.jsx';
import './styles.css';

// Адмін-панель — перегляд заявки і профілю гравця.
// Без бекенду: дивиться на власний state як на одного "applicant'а".
// Доступ через URL `?admin=true` або кнопку зі сторінки Cosmo.

export default function Admin({ onClose }) {
  const state = useGameStore();
  const review = useGameStore((s) => s.reviewCosmoApplication);
  const initiate = useGameStore((s) => s.initiateCosmo);
  const devJump = useGameStore((s) => s.__devJumpToLevel);
  const devActivatePetals = useGameStore((s) => s.__devActivatePetals);
  const devCompletePetals = useGameStore((s) => s.__devCompleteAllPetals);
  const devUnlockChannels = useGameStore((s) => s.__devUnlockAllChannels);
  const devFull = useGameStore((s) => s.__devFullCompletion);
  const devReset = useGameStore((s) => s.__devResetGame);

  const archetype = state.archetypeCalibration?.confirmed
    ? findArchetype(state.archetypeCalibration.confirmed) : null;
  const spec = state.specialization
    ? findSpecialization(state.specialization.id) : null;
  const cosmoLevel = currentCosmoLevel(state);
  const app = state.cosmoApplication;

  const stats = {
    keys: (state.completedLevels || []).length,
    cells: Object.keys(state.cellAnswers || {}).length,
    customs: Object.values(state.cellAnswers || {}).filter((a) => a.customText).length,
    shadows: Object.values(state.cellAnswers || {}).filter((a) => a.depth === 'shadow').length,
    snakes: (state.snakePenalties || []).length,
    shadowMirrors: (state.shadowMirrorHistory || []).length,
    petalsCompleted: Object.values(state.petalProgress || {}).filter((p) => p.completed).length,
    practices: (state.practiceCompletions || []).length,
    auraReadings: (state.auraReadings || []).length,
  };

  const flags = computeFlags(state, stats);

  function decideApprove() {
    if (!app) return;
    review('approved');
    showToast('🟢 Заявку прийнято · гравець може йти на семінар', 'success');
  }
  function decideReject() {
    if (!app) return;
    if (!window.confirm('Відхилити заявку? Це жорстке рішення.')) return;
    review('rejected');
    showToast('Заявку відхилено', 'info');
  }
  function doInitiate() {
    initiate();
    showToast('⚡ Гравця ініційовано — канали відкрито', 'success');
  }

  function jumpTo(n) {
    devJump(n);
    showToast(`🚀 телепорт на рівень ${n}`, 'success');
    onClose();
  }
  function jumpPetals() {
    devActivatePetals();
    showToast('🚀 пелюстки відкриті', 'success');
    onClose();
  }
  function fillPetals() {
    devCompletePetals();
    showToast('✺ всі 12 пелюсток завершено · MandalaFinal попереду', 'success');
    onClose();
  }
  function unlockChannels() {
    devUnlockChannels();
    showToast('🔮 11 каналів розблоковано', 'success');
  }
  function fullCompletion() {
    devFull();
    showToast('✨ повне проходження · 4-та спіраль розкрита', 'success');
    onClose();
  }
  function hardReset() {
    if (!window.confirm('Стерти ВЕСЬ прогрес і перезавантажити? Це не відкатиш.')) return;
    devReset();
  }

  return (
    <main className="admin-overlay">
      <div className="admin-frame">
        <button type="button" className="admin-close" onClick={onClose}>← закрити</button>
        <div className="admin-eyebrow">наставницька панель</div>
        <h1 className="admin-title">Адмін · Огляд гравця</h1>

        <div className="admin-section">
          <h2>профіль</h2>
          <div className="admin-profile">
            <Field label="намір" value={state.intention || '—'} />
            <Field label="шлях" value={state.pathMode || '—'} />
            <Field label="рівнів пройдено" value={`${stats.keys}/7`} />
            <Field label="архетип" value={archetype ? `${archetype.symbol} ${archetype.name}` : 'не калібровано'} />
            <Field label="спеціалізація" value={spec ? `${spec.symbol} ${spec.name}` : '—'} />
            <Field label="рівень КАЕ" value={`${COSMO_LEVELS[cosmoLevel].symbol} ${COSMO_LEVELS[cosmoLevel].name}`} />
          </div>
        </div>

        <div className="admin-section">
          <h2>метрики</h2>
          <div className="admin-stats">
            <Stat n={stats.cells} label="клітинок" />
            <Stat n={stats.customs} label="custom" />
            <Stat n={stats.shadows} label="shadow" />
            <Stat n={stats.snakes} label="snake" />
            <Stat n={stats.shadowMirrors} label="дзеркало" />
            <Stat n={stats.petalsCompleted} label="пелюсток" />
            <Stat n={stats.practices} label="практик" />
            <Stat n={stats.auraReadings} label="аура·вим." />
          </div>
        </div>

        <div className="admin-section">
          <h2>барометри</h2>
          <div className="admin-barometers">
            {Object.entries(state.resources || {}).map(([k, v]) => (
              <span key={k} className={`admin-bar ${v < -3 ? 'bad' : v >= 5 ? 'good' : ''}`}>
                {k}: <strong>{v > 0 ? `+${v}` : v}</strong>
              </span>
            ))}
          </div>
        </div>

        <div className="admin-section admin-dev">
          <h2>🧪 dev tester · телепорти</h2>
          <p className="admin-dev-hint">
            швидкі переходи для тестування — не для гравця
          </p>
          <div className="admin-dev-row">
            <span className="admin-dev-label">піраміда:</span>
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <button key={n} type="button" className="admin-dev-btn" onClick={() => jumpTo(n)}>
                рівень {n}
              </button>
            ))}
          </div>
          <div className="admin-dev-row">
            <span className="admin-dev-label">мандала:</span>
            <button type="button" className="admin-dev-btn" onClick={jumpPetals}>
              ✺ відкрити пелюстки
            </button>
            <button type="button" className="admin-dev-btn" onClick={fillPetals}>
              ✺ завершити всі 12
            </button>
          </div>
          <div className="admin-dev-row">
            <span className="admin-dev-label">космо:</span>
            <button type="button" className="admin-dev-btn" onClick={unlockChannels}>
              🔮 розблокувати 11 каналів
            </button>
          </div>
          <div className="admin-dev-row">
            <span className="admin-dev-label">все:</span>
            <button type="button" className="admin-dev-btn admin-dev-btn-go" onClick={fullCompletion}>
              ✨ повне проходження (відкриває 4-ту спіраль)
            </button>
          </div>
          <div className="admin-dev-row">
            <span className="admin-dev-label">скидання:</span>
            <button type="button" className="admin-dev-btn admin-dev-btn-danger" onClick={hardReset}>
              ↻ стерти прогрес і перезавантажити
            </button>
          </div>
        </div>

        {flags.length > 0 && (
          <div className="admin-section">
            <h2>прапорці</h2>
            <div className="admin-flags">
              {flags.map((f, i) => (
                <div key={i} className={`admin-flag flag-${f.kind}`}>
                  {f.icon} {f.text}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="admin-section">
          <h2>заявка на космоенергетику</h2>
          {!app ? (
            <div className="admin-empty">— гравець ще не подавав —</div>
          ) : (
            <div className="admin-application">
              <div className="admin-app-meta">
                <span className={`admin-app-status status-${app.status}`}>{app.status}</span>
                <span className="admin-app-date">подано: {new Date(app.ts).toLocaleDateString('uk-UA')}</span>
              </div>
              {Object.entries(app.answers || {}).map(([k, v]) => (
                <div key={k} className="admin-app-q">
                  <strong>{k}:</strong> {v}
                </div>
              ))}
              {app.status === 'submitted' && (
                <div className="admin-app-actions">
                  <button className="admin-btn admin-btn-reject" onClick={decideReject}>відхилити</button>
                  <button className="admin-btn admin-btn-approve" onClick={decideApprove}>прийняти →</button>
                </div>
              )}
              {app.status === 'approved' && (
                <div className="admin-app-actions">
                  <button className="admin-btn admin-btn-init" onClick={doInitiate}>⚡ провести ініціацію</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function Field({ label, value }) {
  return (
    <div className="admin-field">
      <span className="admin-field-label">{label}</span>
      <span className="admin-field-value">{value}</span>
    </div>
  );
}
function Stat({ n, label }) {
  return (
    <div className="admin-stat">
      <div className="admin-stat-num">{n}</div>
      <div className="admin-stat-label">{label}</div>
    </div>
  );
}

function computeFlags(state, stats) {
  const flags = [];
  const r = state.resources || {};
  const negCount = Object.values(r).filter((v) => v < -3).length;
  const critical = Object.values(r).filter((v) => v <= -7).length;

  if (critical > 0) flags.push({ kind: 'red', icon: '🔴', text: `критичний барометр (${critical} шт.) — спершу зцілення` });
  if (negCount >= 3) flags.push({ kind: 'red', icon: '🔴', text: '3+ барометри у тіні — не готовий' });
  if (stats.snakes > 5) flags.push({ kind: 'yellow', icon: '🟡', text: 'багато snake-зустрічей — підтримка потрібна' });
  if (stats.shadows > stats.cells * 0.5) flags.push({ kind: 'yellow', icon: '🟡', text: 'переважно тіньові вибори' });
  if (state.shadowMirrorHistory?.some((m) => m.helpline)) flags.push({ kind: 'red', icon: '🔴', text: 'спрацював helpline (Морок) — обережно' });

  if (stats.keys === 7 && negCount === 0) flags.push({ kind: 'green', icon: '🟢', text: '7 ключів + чисті барометри — готовий' });
  if (stats.shadows >= 3 && stats.shadows < stats.cells * 0.4) flags.push({ kind: 'green', icon: '🟢', text: 'тінь визнана і опрацьована' });
  if (stats.practices >= 5) flags.push({ kind: 'green', icon: '🟢', text: 'тілесна практика щоденна' });

  return flags;
}
