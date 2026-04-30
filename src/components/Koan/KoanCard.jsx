import { useState, useEffect } from 'react';
import './koan.css';

// Коротка картка з мудрістю — з'являється на 5с і зникає (або клік щоб закрити).
// Вертикально вгорі екрану як "пливучий" gift від Поля.
export default function KoanCard({ koan, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 600);
    }, 7000);
    return () => clearTimeout(t);
  }, [onClose]);

  if (!koan) return null;

  return (
    <div className={`koan-card${visible ? ' visible' : ''}`} onClick={onClose}>
      <div className="koan-symbol">✦</div>
      <div className="koan-text">{koan.text}</div>
      <div className="koan-source">— {koan.source}</div>
    </div>
  );
}
