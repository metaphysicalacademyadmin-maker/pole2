import { useState, useMemo } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { calcIntegrity, fieldOverall, weakestBody } from '../../utils/integrity-calc.js';
import { findBody } from '../../data/subtle-bodies.js';
import MandalaView from './MandalaView.jsx';
import ListView from './ListView.jsx';
import TrendView from './TrendView.jsx';
import Diagnostic from './Diagnostic.jsx';
import './styles.css';

// Окрема сцена-дзеркало гравця.
// 3 види: мандала / список / тренд + діагностичний оверлей.
export default function SoulField({ onClose }) {
  const state = useGameStore();
  const [view, setView] = useState('mandala');
  const [diagBody, setDiagBody] = useState(null);

  const integrity = useMemo(() => calcIntegrity(state), [state]);
  const overall = fieldOverall(integrity);
  const weak = weakestBody(integrity);

  return (
    <main className="scene">
      <div className="sf-frame">
        <div className="sf-header">
          <div className="sf-eyebrow">карта поля</div>
          <h1 className="sf-title">Дзеркало 7 тонких тіл</h1>
          <div className="sf-overall">
            Загальне поле: <span className="sf-percent">{overall}%</span>
            {weak && weak.score < 50 && (
              <span style={{ color: '#d89098', marginLeft: 8 }}>
                · {findBody(weak.id)?.name} потребує турботи
              </span>
            )}
          </div>
        </div>

        <div className="sf-tabs">
          <button className={`sf-tab${view === 'mandala' ? ' active' : ''}`}
            onClick={() => setView('mandala')}>мандала</button>
          <button className={`sf-tab${view === 'list' ? ' active' : ''}`}
            onClick={() => setView('list')}>список</button>
          <button className={`sf-tab${view === 'trend' ? ' active' : ''}`}
            onClick={() => setView('trend')}>тренд</button>
        </div>

        {view === 'mandala' && (
          <div className="sf-mandala-wrap">
            <MandalaView integrity={integrity} onMeasure={setDiagBody} />
          </div>
        )}
        {view === 'list' && <ListView integrity={integrity} onMeasure={setDiagBody} />}
        {view === 'trend' && <TrendView />}

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button className="btn btn-ghost" onClick={onClose}>← повернутись у Поле</button>
        </div>
      </div>

      {diagBody && <Diagnostic bodyId={diagBody} onClose={() => setDiagBody(null)} />}
    </main>
  );
}
