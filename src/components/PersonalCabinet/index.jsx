import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { detectNewAchievements } from '../../utils/achievement-detector.js';
import { showToast } from '../GlobalToast.jsx';
import { ACHIEVEMENTS } from '../../data/achievements.js';
import { useOverlayA11y } from '../../hooks/useOverlayA11y.js';
import PracticesModal from '../modals/PracticesModal.jsx';
import MaturityTree from '../MaturityTree/index.jsx';
import ProfileTab from './ProfileTab.jsx';
import AchievementsTab from './AchievementsTab.jsx';
import PracticesTab from './PracticesTab.jsx';
import AuraTab from './AuraTab.jsx';
import SessionsTab from './SessionsTab.jsx';
import PromisesTab from './PromisesTab.jsx';
import './styles.css';

const TABS = [
  { id: 'profile',      label: 'профіль',     icon: '👤' },
  { id: 'promises',     label: 'обіцянки',    icon: '✦' },
  { id: 'maturity',     label: 'зростання',   icon: '🌳' },
  { id: 'achievements', label: 'досягнення',  icon: '🏆' },
  { id: 'practices',    label: 'практики',    icon: '🌿' },
  { id: 'aura',         label: 'аура',        icon: '📈' },
  { id: 'sessions',     label: 'історія',     icon: '📜' },
];

export default function PersonalCabinet({ onClose }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [runningPractice, setRunningPractice] = useState(null);
  const award = useGameStore((s) => s.awardAchievements);

  useOverlayA11y(onClose);

  // Перевіряємо нові досягнення при відкритті
  useEffect(() => {
    const fresh = detectNewAchievements(useGameStore.getState());
    if (fresh.length === 0) return;
    award(fresh);
    fresh.forEach((id, i) => {
      const ach = ACHIEVEMENTS.find((a) => a.id === id);
      if (!ach) return;
      setTimeout(() => {
        showToast(`🏆 ${ach.title}`, 'success');
      }, i * 1500);
    });
  }, [award]);

  return (
    <div className="cab-overlay" role="dialog" aria-modal="true" aria-label="Особистий кабінет">
      <div className="cab-frame">
        <div className="cab-header">
          <button type="button" className="cab-close" onClick={onClose}
            aria-label="Закрити особистий кабінет">← повернутись</button>
          <div className="cab-title">особистий кабінет</div>
        </div>

        <div className="cab-tabs">
          {TABS.map((tab) => (
            <button key={tab.id} type="button"
              className={`cab-tab${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}>
              <span className="cab-tab-icon">{tab.icon}</span>
              <span className="cab-tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="cab-content">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'promises' && <PromisesTab />}
          {activeTab === 'maturity' && <MaturityTree />}
          {activeTab === 'achievements' && <AchievementsTab />}
          {activeTab === 'practices' && <PracticesTab onLaunch={setRunningPractice} />}
          {activeTab === 'aura' && <AuraTab />}
          {activeTab === 'sessions' && <SessionsTab />}
        </div>
      </div>
      {runningPractice && (
        <PracticesModal autoLaunch={runningPractice}
          onClose={() => setRunningPractice(null)} />
      )}
    </div>
  );
}
