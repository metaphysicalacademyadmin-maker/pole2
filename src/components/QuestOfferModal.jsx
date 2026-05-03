import { useState } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { suggestQuestsForChakra } from '../data/weekly-quests.js';
import { useOverlayA11y } from '../hooks/useOverlayA11y.js';
import { showToast } from './GlobalToast.jsx';

// Модалка-пропозиція тижневої обіцянки після значущої події (пелюстка / рівень).
// Підбирає 3 варіанти за чакрою + дозволяє написати свою. Якщо є активний quest —
// не показує (не пропонує другу одночасно).
export default function QuestOfferModal({ chakra, onClose }) {
  const currentQuest = useGameStore((s) => s.currentQuest);
  const commitQuest = useGameStore((s) => s.commitQuest);
  const [customMode, setCustomMode] = useState(false);
  const [customText, setCustomText] = useState('');

  useOverlayA11y(onClose);

  if (currentQuest) {
    return (
      <div className="qom-overlay" role="dialog" aria-modal="true">
        <div className="qom-modal">
          <div className="qom-icon">✦</div>
          <h3>У тебе вже є обіцянка</h3>
          <p>«{currentQuest.title}» — заверши її спершу. Поле тримає одну одночасно.</p>
          <button type="button" className="qom-btn qom-btn-go" onClick={onClose}>
            добре, далі
          </button>
        </div>
      </div>
    );
  }

  const suggestions = suggestQuestsForChakra(chakra).slice(0, 3);

  function pick(quest) {
    commitQuest(quest);
    showToast(`✦ Обіцянка прийнята: ${quest.title}`, 'success');
    onClose();
  }

  function pickCustom() {
    if (customText.trim().length < 10) return;
    commitQuest({
      icon: '✦',
      title: customText.trim().slice(0, 40),
      text: customText.trim(),
      customText: customText.trim(),
    });
    showToast('✦ Обіцянка прийнята', 'success');
    onClose();
  }

  return (
    <div className="qom-overlay" role="dialog" aria-modal="true" aria-label="Пропозиція обіцянки">
      <div className="qom-modal">
        <div className="qom-icon">✦</div>
        <h3>Поле пропонує обіцянку</h3>
        <p className="qom-sub">7 днів. Одна. Маленька. Реальна.</p>

        {!customMode ? (
          <>
            <div className="qom-list">
              {suggestions.map((q) => (
                <button key={q.id} type="button" className="qom-option"
                  onClick={() => pick(q)}>
                  <span className="qom-option-icon">{q.icon}</span>
                  <span className="qom-option-body">
                    <span className="qom-option-title">{q.title}</span>
                    <span className="qom-option-text">{q.text}</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="qom-actions">
              <button type="button" className="qom-btn"
                onClick={() => setCustomMode(true)}>✎ написати свою</button>
              <button type="button" className="qom-btn"
                onClick={onClose}>зараз ні</button>
            </div>
          </>
        ) : (
          <>
            <textarea value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="напр. «7 днів — щодня дзвонити мамі»"
              rows={3} maxLength={200}
              className="qom-custom-input" />
            <div className="qom-actions">
              <button type="button" className="qom-btn"
                onClick={() => setCustomMode(false)}>← готові</button>
              <button type="button" className="qom-btn qom-btn-go"
                disabled={customText.trim().length < 10}
                onClick={pickCustom}>✦ беру</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
