import { useState } from 'react';
import GameModal from '../GameModal.jsx';
import { useGameStore } from '../../store/gameStore.js';
import { CHANNELS, CHANNEL_BLOCKS } from '../../data/channels.js';
import { showToast } from '../GlobalToast.jsx';

const SYS = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

export default function ChannelsModal({ onClose }) {
  const channelsUnlocked = useGameStore((s) => s.channelsUnlocked);
  const channelsActive = useGameStore((s) => s.channelsActive);
  const resources = useGameStore((s) => s.resources);
  const activate = useGameStore((s) => s.activateChannel);
  const deactivate = useGameStore((s) => s.deactivateChannel);

  return (
    <GameModal open onClose={onClose} title="Космоенергетичні канали">
      <p style={{ fontFamily: SYS, fontStyle: 'italic', color: '#fff7e0', opacity: 0.85, fontSize: '14px', marginBottom: '16px' }}>
        Канали Космоенергетики (Петров) — частотні підключення з 5 блоків:
        буддистський · вищий · магічний · магістровський · зороастризм.
        Розблоковуються коли барометри набирають достатньо.
      </p>
      {CHANNEL_BLOCKS.map((block) => {
        const inBlock = CHANNELS.filter((c) => c.block === block);
        if (inBlock.length === 0) return null;
        return (
          <div key={block} style={{ marginBottom: 18 }}>
            <div style={{
              fontFamily: SYS, fontSize: 11, fontWeight: 700,
              letterSpacing: '4px', textTransform: 'uppercase',
              color: '#f0c574', marginBottom: 8,
            }}>
              ◇ {block} блок
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {inBlock.map((c) => {
                const unlocked = channelsUnlocked.includes(c.id);
                const active = channelsActive.includes(c.id);
                const canUnlock = (resources[c.unlock.resource] || 0) >= c.unlock.threshold;
                return (
                  <ChannelRow key={c.id} channel={c}
              unlocked={unlocked || canUnlock}
              active={active}
              onActivate={() => { activate(c.id); showToast(`канал ${c.name} увімкнено`, 'success'); }}
              onDeactivate={() => deactivate(c.id)}
              resourceLevel={resources[c.unlock.resource] || 0}
            />
                );
              })}
            </div>
          </div>
        );
      })}
    </GameModal>
  );
}

function ChannelRow({ channel, unlocked, active, onActivate, onDeactivate, resourceLevel }) {
  const [showPractice, setShowPractice] = useState(false);

  if (!unlocked) {
    return (
      <div style={{
        padding: '10px 14px',
        background: 'rgba(20, 14, 30, 0.5)',
        border: '1px dashed rgba(232,196,118,0.2)',
        borderRadius: '8px',
        opacity: 0.5,
      }}>
        <div style={{ fontFamily: SYS, fontSize: '14px', color: '#c8bca8' }}>
          🔒 {channel.name}
        </div>
        <div style={{ fontFamily: SYS, fontSize: '11px', color: '#968a7c', marginTop: '2px' }}>
          {channel.unlock.resource}: {resourceLevel}/{channel.unlock.threshold}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '12px 14px',
      background: active ? 'rgba(232,196,118,0.12)' : 'rgba(20, 14, 30, 0.7)',
      border: active ? `2px solid ${channel.color}` : '1.5px solid rgba(232,196,118,0.3)',
      borderRadius: '10px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '28px', color: channel.color }}>{channel.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: SYS, fontWeight: 700, fontSize: '15px', color: '#fff7e0' }}>
            {channel.name}
          </div>
          <div style={{ fontFamily: SYS, fontStyle: 'italic', fontSize: '12px', color: '#c8bca8' }}>
            {channel.purpose} · {channel.effect}
          </div>
        </div>
        {active ? (
          <button className="btn btn-ghost" onClick={onDeactivate} style={{ fontSize: '12px', padding: '6px 12px' }}>
            вимкнути
          </button>
        ) : (
          <button className="btn btn-primary" onClick={onActivate} style={{ fontSize: '12px', padding: '6px 12px' }}>
            увімкнути
          </button>
        )}
      </div>
      <button onClick={() => setShowPractice(!showPractice)} style={{
        marginTop: '8px',
        background: 'none', border: 'none',
        color: channel.color, cursor: 'pointer',
        fontSize: '11px', fontFamily: SYS, fontWeight: 600,
        letterSpacing: '2px', textTransform: 'uppercase',
      }}>
        {showPractice ? '↑ сховати' : '↓ як налаштуватись'}
      </button>
      {showPractice && (
        <p style={{
          fontFamily: SYS, fontStyle: 'italic',
          fontSize: '13px', color: '#fff7e0',
          marginTop: '8px', lineHeight: 1.5, opacity: 0.9,
        }}>
          {channel.practice}
        </p>
      )}
    </div>
  );
}
