import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { detectNewAchievements } from '../../utils/achievement-detector.js';
import { showToast } from '../GlobalToast.jsx';
import { ACHIEVEMENTS } from '../../data/achievements.js';
import ProfileTab from './ProfileTab.jsx';
import AchievementsTab from './AchievementsTab.jsx';
import PracticesTab from './PracticesTab.jsx';
import AuraTab from './AuraTab.jsx';
import SessionsTab from './SessionsTab.jsx';
import './styles.css';

const TABS = [
  { id: 'profile',      label: 'профіль',     icon: '👤' },
  { id: 'achievements', label: 'досягнення',  icon: '🏆' },
  { id: 'practices',    label: 'практики',    icon: '🌿' },
  { id: 'aura',         label: 'зростання',   icon: '📈' },
  { id: 'sessions',     label: 'історія',     icon: '📜' },
];

export default function PersonalCabinet({ onClose }) {
  const [activeTab, setActiveTab] = useState('profile');
  const award = useGameStore((s) => s.awardAchievements);

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
    <div className="cab-overlay">
      <div className="cab-frame">
        <div className="cab-header">
          <button type="button" className="cab-close" onClick={onClose}>← повернутись</button>
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
          {activeTab === 'achievements' && <AchievementsTab />}
          {activeTab === 'practices' && <PracticesTab />}
          {activeTab === 'aura' && <AuraTab />}
          {activeTab === 'sessions' && <SessionsTab />}
        </div>
      </div>
    </div>
  );
}
