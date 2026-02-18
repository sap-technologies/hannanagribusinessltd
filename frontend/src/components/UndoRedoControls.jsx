import './UndoRedoControls.css';

function UndoRedoControls({ canUndo, canRedo, onUndo, onRedo, historyInfo }) {
  return (
    <div className="undo-redo-controls">
      <button
        className="undo-btn"
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
      >
        ↶ Undo
      </button>
      <button
        className="redo-btn"
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo (Ctrl+Y)"
      >
        ↷ Redo
      </button>
      {historyInfo && (
        <span className="history-info">
          {historyInfo.current} / {historyInfo.total}
        </span>
      )}
    </div>
  );
}

export default UndoRedoControls;
