import { useEffect } from 'react';
import './KeyboardShortcutsHelp.css';

function KeyboardShortcutsHelp({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { category: 'General', items: [
      { keys: 'Ctrl + S', action: 'Save current changes' },
      { keys: 'Ctrl + N', action: 'Create new record' },
      { keys: 'Ctrl + F', action: 'Search/Filter' },
      { keys: 'F5', action: 'Refresh data' },
      { keys: 'Esc', action: 'Close dialog/Cancel' },
    ]},
    { category: 'Editing', items: [
      { keys: 'Ctrl + Z', action: 'Undo last change' },
      { keys: 'Ctrl + Y', action: 'Redo last undo' },
      { keys: 'Delete', action: 'Delete selected item' },
      { keys: 'Enter', action: 'Submit/Confirm' },
    ]},
    { category: 'Navigation', items: [
      { keys: 'Tab', action: 'Next field' },
      { keys: 'Shift + Tab', action: 'Previous field' },
      { keys: '↑ ↓', action: 'Navigate list' },
    ]},
  ];

  return (
    <div className="shortcuts-overlay" onClick={onClose}>
      <div className="shortcuts-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="shortcuts-header">
          <h2>⌨️ Keyboard Shortcuts</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="shortcuts-content">
          {shortcuts.map(section => (
            <div key={section.category} className="shortcuts-section">
              <h3>{section.category}</h3>
              <div className="shortcuts-list">
                {section.items.map((shortcut, idx) => (
                  <div key={idx} className="shortcut-item">
                    <kbd className="shortcut-keys">{shortcut.keys}</kbd>
                    <span className="shortcut-action">{shortcut.action}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="shortcuts-footer">
          <p>Press <kbd>?</kbd> to toggle this help</p>
        </div>
      </div>
    </div>
  );
}

export default KeyboardShortcutsHelp;
