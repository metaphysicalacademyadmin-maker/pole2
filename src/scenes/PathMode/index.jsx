import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { PATH_MODES, PATH_MODE_ORDER } from '../../data/pathmodes.js';
import PathCard from './PathCard.jsx';
import TrackWizard from './TrackWizard.jsx';
import ContactsBlock from '../../components/Contacts/ContactsBlock.jsx';
import './styles.css';

// Перший екран: гравець обирає трек шляху (5 варіантів).
// Або через wizard — 5 питань → рекомендований трек.
export default function PathMode() {
  const setPathMode = useGameStore((s) => s.setPathMode);
  const [wizardOpen, setWizardOpen] = useState(false);

  return (
    <main className="scene">
      <div className="pm-frame">
        <div className="pm-meta">шлях · обрання · вхід</div>
        <h1 className="pm-title">
          Поле <em>відчуває</em>
        </h1>
        <div className="pm-sub">з яким серцем ти прийшов</div>
        <div className="pm-instruction">
          обери чесно · це перший духовний акт у грі
        </div>

        <button type="button" className="pm-wizard-cta" onClick={() => setWizardOpen(true)}>
          ✺ не знаєш що обрати? — 5 питань допоможуть
        </button>

        <div className="pm-cards pm-cards-5">
          {PATH_MODE_ORDER.map((id) => (
            <PathCard key={id} mode={PATH_MODES[id]} onSelect={setPathMode} />
          ))}
        </div>

        <div className="pm-foot">
          <div>трек можна підвищити в середині гри · знизити — ні</div>
          <div className="pm-foot-tier">
            ✦ <strong>Корінь</strong> — безкоштовно. <strong>Серце</strong> і <strong>Голос</strong> —
            підписка. <strong>Тінь</strong> і <strong>Ініціат</strong> — розширений доступ
            на metaphysical-way.academy
          </div>
        </div>

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid rgba(232,196,118,0.18)' }}>
          <ContactsBlock variant="compact" title="Метафізична Академія" />
        </div>
      </div>

      {wizardOpen && (
        <TrackWizard
          onSelect={(trackId) => {
            setPathMode(trackId);
            setWizardOpen(false);
          }}
          onClose={() => setWizardOpen(false)}
        />
      )}
    </main>
  );
}
