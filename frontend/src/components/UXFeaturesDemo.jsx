import { useState } from 'react';
import DragDropUpload from './DragDropUpload';
import ConfirmDialog from './ConfirmDialog';
import KeyboardShortcutsHelp from './KeyboardShortcutsHelp';
import UndoRedoControls from './UndoRedoControls';
import useKeyboardShortcut, { KeyboardShortcuts } from '../hooks/useKeyboardShortcut';
import useUndo from '../hooks/useUndo';
import './UXFeaturesDemo.css';

/**
 * Demo component showing all UX features
 * This demonstrates how to use:
 * - Drag & Drop Upload
 * - Confirmation Dialogs
 * - Keyboard Shortcuts
 * - Undo/Redo
 */
function UXFeaturesDemo() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Undo/Redo for text input
  const { state, setState, undo, redo, canUndo, canRedo, currentIndex, historyLength } = useUndo({
    text: 'Edit this text and use Ctrl+Z to undo!'
  });

  // Keyboard shortcuts
  useKeyboardShortcut(KeyboardShortcuts.UNDO, undo);
  useKeyboardShortcut(KeyboardShortcuts.REDO, redo);
  useKeyboardShortcut(KeyboardShortcuts.DELETE, () => setShowDeleteConfirm(true));
  useKeyboardShortcut('shift+/', () => setShowShortcutsHelp(true));
  
  const handleFileSelect = (file) => {
    setUploadedFile(file);
    console.log('File selected:', file.name, file.size);
  };

  const handleDelete = () => {
    setState({ text: '' });
    setUploadedFile(null);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="ux-demo">
      <h1>🎨 UX Features Demo</h1>
      <p className="demo-intro">
        This demo showcases all the new UX features. Try them out!
      </p>

      {/* 1. Undo/Redo Controls */}
      <section className="demo-section">
        <h2>↶ Undo/Redo</h2>
        <UndoRedoControls
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          historyInfo={{
            current: currentIndex + 1,
            total: historyLength
          }}
        />
        <textarea
          value={state.text}
          onChange={(e) => setState({ text: e.target.value })}
          placeholder="Type something and try Ctrl+Z..."
          rows={4}
        />
        <p className="hint">💡 Try: Type text, press <kbd>Ctrl+Z</kbd> to undo, <kbd>Ctrl+Y</kbd> to redo</p>
      </section>

      {/* 2. Drag & Drop Upload */}
      <section className="demo-section">
        <h2>📁 Drag & Drop Upload</h2>
        <DragDropUpload
          onFileSelect={handleFileSelect}
          accept="image/*"
          maxSize={5242880}
        />
        {uploadedFile && (
          <div className="file-info">
            <p>✅ Selected: <strong>{uploadedFile.name}</strong></p>
            <p>Size: {(uploadedFile.size / 1024).toFixed(1)} KB</p>
          </div>
        )}
        <p className="hint">💡 Try: Drag an image file or click to browse</p>
      </section>

      {/* 3. Confirmation Dialog */}
      <section className="demo-section">
        <h2>⚠️ Confirmation Dialog</h2>
        <div className="button-group">
          <button 
            className="btn-danger" 
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete (or press Delete key)
          </button>
          <button 
            className="btn-info" 
            onClick={() => setShowShortcutsHelp(true)}
          >
            ⌨️ Show Shortcuts (or press ?)
          </button>
        </div>
        <p className="hint">💡 Try: Click delete button or press <kbd>Delete</kbd> key</p>
      </section>

      {/* 4. Keyboard Shortcuts */}
      <section className="demo-section">
        <h2>⌨️ Keyboard Shortcuts</h2>
        <div className="shortcuts-list">
          <div className="shortcut"><kbd>Ctrl+Z</kbd> Undo</div>
          <div className="shortcut"><kbd>Ctrl+Y</kbd> Redo</div>
          <div className="shortcut"><kbd>Delete</kbd> Open delete dialog</div>
          <div className="shortcut"><kbd>?</kbd> Show shortcuts help</div>
        </div>
        <p className="hint">💡 All shortcuts are active on this page</p>
      </section>

      {/* Dialogs */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Everything?"
        message="This will clear all your changes. Are you sure?"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <KeyboardShortcutsHelp
        isOpen={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
      />
    </div>
  );
}

export default UXFeaturesDemo;
