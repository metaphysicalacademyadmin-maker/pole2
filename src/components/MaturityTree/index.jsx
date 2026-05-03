import { useState } from 'react';
import MaturityMatrix from './MaturityMatrix.jsx';
import MaturityTreeSvg from './MaturityTreeSvg.jsx';
import MaturityBarometer from '../MaturityBarometer.jsx';
import '../MaturityBarometer.css';
import './styles.css';

// Дерево Зрілості — нова вкладка у Особистому Кабінеті.
// Дві view-форми одного дзеркала:
//   • Tree — органічна метафора (SVG): корінь→стовбур→гілки→листя→плоди
//   • Matrix — структурний 7×5 grid свідчень
// Корінь дерева = матриця. Невидима основа.
export default function MaturityTree() {
  const [view, setView] = useState('tree');     // 'tree' | 'matrix'

  return (
    <div className="mt-frame">
      <div style={{ marginBottom: 16 }}>
        <MaturityBarometer />
      </div>
      <div className="mt-toggle">
        <button type="button"
          className={`mt-toggle-btn ${view === 'tree' ? 'is-active' : ''}`}
          onClick={() => setView('tree')}>
          🌳 дерево
        </button>
        <button type="button"
          className={`mt-toggle-btn ${view === 'matrix' ? 'is-active' : ''}`}
          onClick={() => setView('matrix')}>
          ▓ матриця кореня
        </button>
      </div>

      {view === 'tree' && <MaturityTreeSvg onOpenMatrix={() => setView('matrix')} />}
      {view === 'matrix' && <MaturityMatrix />}
    </div>
  );
}
