import { useGameStore } from '../../store/gameStore.js';
import { PATH_MODES, PATH_MODE_ORDER } from '../../data/pathmodes.js';
import PathCard from './PathCard.jsx';
import ContactsBlock from '../../components/Contacts/ContactsBlock.jsx';
import './styles.css';

// Перший екран: гравець обирає режим шляху.
// Після вибору — store перемикає state.pathMode і App.jsx перерисовує Entry.
export default function PathMode() {
  const setPathMode = useGameStore((s) => s.setPathMode);

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

        <div className="pm-cards">
          {PATH_MODE_ORDER.map((id) => (
            <PathCard key={id} mode={PATH_MODES[id]} onSelect={setPathMode} />
          ))}
        </div>

        <div className="pm-foot">
          режим можна підвищити в середині гри · знизити — ні
        </div>

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid rgba(232,196,118,0.18)' }}>
          <ContactsBlock variant="compact" title="Метафізична Академія" />
        </div>
      </div>
    </main>
  );
}
