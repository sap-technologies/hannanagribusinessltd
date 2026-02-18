import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for undo/redo functionality
 * Usage:
 * const { state, setState, undo, redo, canUndo, canRedo, reset } = useUndo(initialState);
 */
function useUndo(initialState, maxHistory = 50) {
  const [state, setInternalState] = useState(initialState);
  const history = useRef([initialState]);
  const currentIndex = useRef(0);

  const setState = useCallback((newState) => {
    // If we're not at the end of history, remove everything after current index
    if (currentIndex.current < history.current.length - 1) {
      history.current = history.current.slice(0, currentIndex.current + 1);
    }

    // Add new state to history
    const stateToAdd = typeof newState === 'function' ? newState(state) : newState;
    history.current.push(stateToAdd);

    // Limit history size
    if (history.current.length > maxHistory) {
      history.current = history.current.slice(history.current.length - maxHistory);
    }

    currentIndex.current = history.current.length - 1;
    setInternalState(stateToAdd);
  }, [state, maxHistory]);

  const undo = useCallback(() => {
    if (currentIndex.current > 0) {
      currentIndex.current -= 1;
      setInternalState(history.current[currentIndex.current]);
    }
  }, []);

  const redo = useCallback(() => {
    if (currentIndex.current < history.current.length - 1) {
      currentIndex.current += 1;
      setInternalState(history.current[currentIndex.current]);
    }
  }, []);

  const canUndo = currentIndex.current > 0;
  const canRedo = currentIndex.current < history.current.length - 1;

  const reset = useCallback(() => {
    history.current = [initialState];
    currentIndex.current = 0;
    setInternalState(initialState);
  }, [initialState]);

  const clearHistory = useCallback(() => {
    history.current = [state];
    currentIndex.current = 0;
  }, [state]);

  return {
    state,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
    clearHistory,
    historyLength: history.current.length,
    currentIndex: currentIndex.current
  };
}

export default useUndo;
