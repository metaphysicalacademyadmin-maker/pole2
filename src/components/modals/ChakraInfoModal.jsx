import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { useGameStore } from '../../store/gameStore.js';
import { findChakra } from '../../data/chakras.js';
import { PRACTICES } from '../../data/practices.js';

const SYS = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export default function ChakraInfoModal({ chakraId, onClose }) {
  const chakra = findChakra(chakraId);
  const completedLevels = useGameStore((s) => s.completedLevels);
  const resources = useGameStore((s) => s.resources);
  if (!chakra) return null;

  const active = completedLevels.includes(chakra.levelN);
  const resourceLevel = resources[chakra.barometers[0]] || 0;
  const myPractices = PRACTICES.filter((p) => chakra.practiceIds.includes(p.id));

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontFamily: SYS, fontWeight: 700, color: chakra.color, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Sphere chakra={chakra} />
        <div>
          <div>{chakra.name}</div>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#c8bca8', letterSpacing: '2px', textTransform: 'uppercase' }}>
            {chakra.sub} · {chakra.element}
          </div>
        </div>
      </DialogTitle>
      <DialogContent dividers>
        <p style={{ fontFamily: SYS, fontStyle: 'italic', color: '#fff7e0', lineHeight: 1.55, marginBottom: 16, fontSize: 15 }}>
          {chakra.description}
        </p>

        <Row label="Sanскрит">{chakra.sanskrit}</Row>
        <Row label="Локація">{chakra.location}</Row>
        <Row label="Мантра / Біджа">{chakra.mantra} · {chakra.bija}</Row>
        <Row label="Пелюсток">{chakra.petals}</Row>
        <Row label="Стихія">{chakra.element}</Row>
        <Row label="Тіло">{chakra.body.join(', ')}</Row>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(232,196,118,0.2)', margin: '16px 0' }} />

        <Row label="Активна">{chakra.tells_active}</Row>
        <Row label="Заблокована">{chakra.tells_blocked}</Row>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(232,196,118,0.2)', margin: '16px 0' }} />

        <div style={{ fontFamily: SYS, fontSize: 11, fontWeight: 700, letterSpacing: '4px', color: '#f0c574', textTransform: 'uppercase', marginBottom: 8 }}>
          Стан зараз
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: SYS, fontSize: 13, color: '#fff7e0' }}>
              Барометр {chakra.barometers[0]}: <strong style={{ color: chakra.color }}>{resourceLevel}</strong>
            </div>
            <div style={{
              height: 6, background: 'rgba(40,28,60,0.7)', borderRadius: 999, marginTop: 6, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', width: `${Math.min(100, resourceLevel * 5)}%`,
                background: chakra.color, transition: 'width 0.6s ease',
              }} />
            </div>
          </div>
          <div style={{
            padding: '4px 10px', borderRadius: 999,
            border: `1.5px solid ${active ? chakra.color : 'rgba(232,196,118,0.3)'}`,
            color: active ? chakra.color : '#c8bca8',
            fontFamily: SYS, fontSize: 11, fontWeight: 700,
            letterSpacing: '2px', textTransform: 'uppercase',
          }}>
            {active ? '● запалена' : '○ не активована'}
          </div>
        </div>

        {myPractices.length > 0 && (
          <>
            <div style={{ fontFamily: SYS, fontSize: 11, fontWeight: 700, letterSpacing: '4px', color: '#f0c574', textTransform: 'uppercase', marginBottom: 8 }}>
              Практики що живлять
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {myPractices.map((p) => (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 12px',
                  background: 'rgba(20,14,30,0.7)',
                  border: '1px solid rgba(232,196,118,0.2)',
                  borderRadius: 8,
                  fontFamily: SYS, color: '#fff7e0', fontSize: 13,
                }}>
                  <span style={{ fontSize: 18 }}>{p.icon}</span>
                  <span style={{ flex: 1 }}>{p.name}</span>
                  <span style={{ fontSize: 11, color: '#c8bca8' }}>{p.duration}хв</span>
                </div>
              ))}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Sphere({ chakra }) {
  return (
    <div style={{
      width: 36, height: 36, flexShrink: 0,
      borderRadius: '50%',
      background: `radial-gradient(circle at 35% 30%, ${chakra.color} 0%, ${chakra.colorDeep} 100%)`,
      border: `1.5px solid ${chakra.color}`,
      boxShadow: `0 0 12px ${chakra.color}55`,
    }} />
  );
}

function Row({ label, children }) {
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 6, fontFamily: SYS, fontSize: 13 }}>
      <div style={{ minWidth: 110, color: '#c8bca8', fontWeight: 600, fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ flex: 1, color: '#fff7e0' }}>{children}</div>
    </div>
  );
}
