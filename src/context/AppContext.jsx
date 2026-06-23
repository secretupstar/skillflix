import { createContext, useContext, useReducer, useEffect, useState, useCallback, useRef } from 'react';
import { isCloudEnabled, loadCloudData, saveCloudData } from '../lib/cloud';

const AppContext = createContext();

const STORAGE_KEY = 'skillflix-data';

const DEFAULT_STATE = {
  reviews: {},
  trapProgress: {},
  notes: {},
  streakDays: 0,
  lastVisit: null,
  totalTests: 0,
};

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

async function loadFromFile() {
  try {
    const res = await fetch('/api/data');
    if (res.ok) {
      const data = await res.json();
      if (data) return data;
    }
  } catch {}
  return null;
}

function reducer(state, action) {
  let next;
  switch (action.type) {
    case 'INIT':
      return action.payload;
    case 'ADD_REVIEW': {
      const { skillId, review } = action.payload;
      const existing = state.reviews[skillId] || [];
      next = {
        ...state,
        reviews: {
          ...state.reviews,
          [skillId]: [...existing, { ...review, id: Date.now(), createdAt: new Date().toISOString() }],
        },
      };
      break;
    }
    case 'DELETE_REVIEW': {
      const { skillId, reviewId } = action.payload;
      next = {
        ...state,
        reviews: {
          ...state.reviews,
          [skillId]: (state.reviews[skillId] || []).filter(r => r.id !== reviewId),
        },
      };
      break;
    }
    case 'UPDATE_TRAP': {
      const { skillId, stage, score } = action.payload;
      next = {
        ...state,
        trapProgress: {
          ...state.trapProgress,
          [skillId]: {
            ...(state.trapProgress[skillId] || {}),
            [stage]: { score, completedAt: new Date().toISOString() },
          },
        },
        totalTests: state.totalTests + 1,
      };
      break;
    }
    case 'ADD_NOTE': {
      const { skillId, note } = action.payload;
      const existingNotes = state.notes[skillId] || [];
      next = {
        ...state,
        notes: {
          ...state.notes,
          [skillId]: [...existingNotes, { ...note, id: Date.now(), createdAt: new Date().toISOString() }],
        },
      };
      break;
    }
    case 'DELETE_NOTE': {
      const { skillId, noteId } = action.payload;
      next = {
        ...state,
        notes: {
          ...state.notes,
          [skillId]: (state.notes[skillId] || []).filter(n => n.id !== noteId),
        },
      };
      break;
    }
    case 'UPDATE_STREAK': {
      const today = new Date().toDateString();
      if (state.lastVisit === today) return state;
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      next = {
        ...state,
        streakDays: state.lastVisit === yesterday ? state.streakDays + 1 : 1,
        lastVisit: today,
      };
      break;
    }
    default:
      return state;
  }
  return next;
}

export function AppProvider({ children, pinHash }) {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);
  const [ready, setReady] = useState(false);
  const saveTimer = useRef(null);
  const cloud = isCloudEnabled() && pinHash;

  const persistState = useCallback((data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    // Save to local file (dev mode)
    fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => {});

    // Save to cloud (debounced)
    if (cloud) {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        saveCloudData(pinHash, data).catch(() => {});
      }, 1000);
    }
  }, [cloud, pinHash]);

  const wrappedDispatch = useCallback((action) => {
    dispatch(action);
  }, []);

  useEffect(() => {
    (async () => {
      let best = null;

      if (cloud) {
        try {
          best = await loadCloudData(pinHash);
        } catch {}
      }

      if (!best) {
        const fileData = await loadFromFile();
        const localData = loadFromLocalStorage();
        const fileTime = fileData?.lastVisit ? new Date(fileData.lastVisit).getTime() : 0;
        const localTime = localData?.lastVisit ? new Date(localData.lastVisit).getTime() : 0;
        best = fileTime >= localTime ? fileData : localData;
      }

      if (best) {
        dispatch({ type: 'INIT', payload: { ...DEFAULT_STATE, ...best } });
      }
      setReady(true);
    })();
  }, [cloud, pinHash]);

  useEffect(() => {
    if (ready) {
      dispatch({ type: 'UPDATE_STREAK' });
    }
  }, [ready]);

  // Persist on every state change after init
  const prevState = useRef(state);
  useEffect(() => {
    if (ready && state !== prevState.current && state !== DEFAULT_STATE) {
      prevState.current = state;
      persistState(state);
    }
  }, [state, ready, persistState]);

  if (!ready) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0a0a0f', color: '#f5c518', fontFamily: 'Inter, sans-serif', fontSize: 18 }}>
        Loading SkillFlix...
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ state, dispatch: wrappedDispatch, cloud }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
