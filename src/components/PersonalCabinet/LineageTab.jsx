import { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import LineageTree from '../LineageTree/index.jsx';
import RodovidNodeEditor from '../Rodovid/NodeEditor.jsx';
import '../Rodovid/styles.css';

// Tab у Cabinet — родове дерево на 7 поколінь, єдина правда у `state.rodovid`.
// Клік на вузол відкриває існуючий RodovidNodeEditor (ім'я, дар, програма,
// alive/transitioned, ритуальні фрази Хеллінгера).
export default function LineageTab() {
  const rodovid = useGameStore((s) => s.rodovid) || {};
  const [editingId, setEditingId] = useState(null);

  return (
    <>
      <LineageTree rodovid={rodovid} onClickNode={setEditingId} />
      {editingId && (
        <RodovidNodeEditor nodeId={editingId} onClose={() => setEditingId(null)} />
      )}
    </>
  );
}
