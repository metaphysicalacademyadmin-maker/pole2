import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { TOOLS, unlockedTools, lockedTools, placeholderTools } from '../../data/tools.js';
import { showToast } from '../GlobalToast.jsx';
import ConstellationTool from '../ConstellationTool/index.jsx';
import Rodovid from '../Rodovid/index.jsx';
import ArchetypeDialog from '../ArchetypeDialog/index.jsx';
import Library from '../Library/index.jsx';
import MentalCode from '../MentalCode/index.jsx';
import Elements from '../Elements/index.jsx';
import Blindness from '../Blindness/index.jsx';

// Вкладка «Інструменти» — скриня практик доступних гравцеві.
// Кожен інструмент розблоковується через певну точку прогресу.
//
// Поки інструмент не відкритий — показуємо як заблокований з підказкою.
export default function ToolsTab({ onOpenPractices, onOpenBodyMap }) {
  const state = useGameStore();
  const usage = useGameStore((s) => s.toolUsage) || {};

  const [activeTool, setActiveTool] = useState(null);

  const unlocked = unlockedTools(state);
  const locked = lockedTools(state);
  const placeholders = placeholderTools();

  function handleOpen(tool) {
    if (tool.id === 'constellation' || tool.id === 'rodovid'
        || tool.id === 'archetype-dialog' || tool.id === 'library'
        || tool.id === 'mental-code' || tool.id === 'elements'
        || tool.id === 'blindness') {
      setActiveTool(tool.id);
      return;
    }
    if (tool.id === 'breath') {
      onOpenPractices?.();
      return;
    }
    if (tool.id === 'body-map') {
      onOpenBodyMap?.();
      return;
    }
    if (tool.id === 'mantra' || tool.id === 'shadow-work') {
      showToast(`${tool.icon} ${tool.name} — використовується у пелюстках`, 'info');
      return;
    }
  }

  return (
    <div className="tools-tab">
      <div className="tools-intro">
        <h3>Твої інструменти</h3>
        <p>
          Те, що ти відкрив на шляху — лишається з тобою. Заходь і використовуй
          у будь-який момент.
        </p>
      </div>

      {unlocked.length > 0 && (
        <div className="tools-section">
          <div className="tools-section-label">
            відкрито <span>{unlocked.length} / {TOOLS.length - placeholders.length}</span>
          </div>
          <div className="tools-grid">
            {unlocked.map((t) => (
              <ToolCard key={t.id} tool={t}
                usage={usage[t.id]}
                onClick={() => handleOpen(t)} />
            ))}
          </div>
        </div>
      )}

      {locked.length > 0 && (
        <div className="tools-section">
          <div className="tools-section-label tools-locked-label">
            ще закрито <span>({locked.length})</span>
          </div>
          <div className="tools-grid">
            {locked.map((t) => (
              <ToolCard key={t.id} tool={t} locked />
            ))}
          </div>
        </div>
      )}

      {placeholders.length > 0 && (
        <div className="tools-section">
          <div className="tools-section-label tools-soon-label">
            у розробці
          </div>
          <div className="tools-grid">
            {placeholders.map((t) => (
              <ToolCard key={t.id} tool={t} placeholder />
            ))}
          </div>
        </div>
      )}

      {activeTool === 'constellation' && (
        <ConstellationTool onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'rodovid' && (
        <Rodovid onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'archetype-dialog' && (
        <ArchetypeDialog onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'library' && (
        <Library onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'mental-code' && (
        <MentalCode onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'elements' && (
        <Elements onClose={() => setActiveTool(null)} />
      )}
      {activeTool === 'blindness' && (
        <Blindness onClose={() => setActiveTool(null)} />
      )}
    </div>
  );
}

function ToolCard({ tool, locked, placeholder, usage, onClick }) {
  const usedCount = usage?.count || 0;
  return (
    <button type="button"
      className={`tool-card${locked ? ' is-locked' : ''}${placeholder ? ' is-placeholder' : ''}`}
      style={!locked && !placeholder ? { borderColor: `${tool.color}66` } : undefined}
      disabled={locked || placeholder}
      onClick={onClick}>
      <div className="tool-icon" style={{ color: locked || placeholder ? '#6a5a48' : tool.color }}>
        {locked ? '🔒' : tool.icon}
      </div>
      <div className="tool-body">
        <div className="tool-name">{tool.name}</div>
        <div className="tool-short">{tool.short}</div>
        {(locked || placeholder) ? (
          <div className="tool-hint">{tool.unlockHint}</div>
        ) : (
          usedCount > 0 && <div className="tool-usage">×{usedCount}</div>
        )}
      </div>
    </button>
  );
}
