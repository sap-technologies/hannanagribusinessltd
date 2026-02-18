import { useEffect, useCallback } from 'react';

/**
 * Custom hook for keyboard shortcuts
 * Usage:
 * useKeyboardShortcut('ctrl+s', handleSave);
 * useKeyboardShortcut('ctrl+n', handleNew);
 * useKeyboardShortcut('delete', handleDelete);
 */
function useKeyboardShortcut(shortcut, callback, options = {}) {
  const { enabled = true, preventDefault = true } = options;

  const handleKeyPress = useCallback((event) => {
    if (!enabled) return;

    const keys = shortcut.toLowerCase().split('+');
    const keyPressed = event.key.toLowerCase();

    // Check modifiers
    const needsCtrl = keys.includes('ctrl') || keys.includes('control');
    const needsShift = keys.includes('shift');
    const needsAlt = keys.includes('alt');

    // Get the actual key (last item in the array)
    const mainKey = keys[keys.length - 1];

    // Check if all conditions match
    const ctrlMatch = needsCtrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey;
    const shiftMatch = needsShift ? event.shiftKey : !event.shiftKey;
    const altMatch = needsAlt ? event.altKey : !event.altKey;
    const keyMatch = keyPressed === mainKey || event.code.toLowerCase() === mainKey;

    if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
      if (preventDefault) {
        event.preventDefault();
      }
      callback(event);
    }
  }, [shortcut, callback, enabled, preventDefault]);

  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [handleKeyPress, enabled]);
}

/**
 * Predefined keyboard shortcuts
 */
const KeyboardShortcuts = {
  SAVE: 'ctrl+s',
  NEW: 'ctrl+n',
  DELETE: 'delete',
  SEARCH: 'ctrl+f',
  REFRESH: 'f5',
  ESCAPE: 'escape',
  ENTER: 'enter',
  COPY: 'ctrl+c',
  PASTE: 'ctrl+v',
  UNDO: 'ctrl+z',
  REDO: 'ctrl+y',
  SELECT_ALL: 'ctrl+a',
  PRINT: 'ctrl+p'
};

export { useKeyboardShortcut, KeyboardShortcuts };
export default useKeyboardShortcut;
