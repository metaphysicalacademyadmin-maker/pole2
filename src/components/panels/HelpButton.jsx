import { useState } from 'react';
import TeacherModal from '../Teacher/TeacherModal.jsx';

// Кнопка ? у топбарі — відкриває Учителя.
export default function HelpButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button"
        onClick={() => setOpen(true)}
        title="Учитель Поля — допомога з грою"
        aria-label="Відкрити Учителя Поля — допомога з грою"
        style={{
          width: 28, height: 28,
          borderRadius: '50%',
          background: 'rgba(232, 196, 118, 0.15)',
          border: '1.5px solid #f0c574',
          color: '#f0c574',
          fontFamily: 'Georgia, serif',
          fontSize: 16,
          fontWeight: 700,
          cursor: 'pointer',
          padding: 0,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(232, 196, 118, 0.3)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(232, 196, 118, 0.15)'; }}>
        ?
      </button>
      {open && <TeacherModal onClose={() => setOpen(false)} />}
    </>
  );
}
