import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { isCloudEnabled } from './lib/cloud';
import PinScreen from './components/PinScreen';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import SkillDetail from './pages/SkillDetail';
import './index.css';

function AppContent() {
  const { state, cloud } = useApp();
  const [page, setPage] = useState('dashboard');
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = (target, skillId) => {
    if (target === 'skill' && skillId) {
      setSelectedSkillId(skillId);
      setPage('skill');
    } else {
      setPage(target);
      setSelectedSkillId(null);
    }
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  };

  const reviewedCount = Object.keys(state.reviews).filter(id => state.reviews[id].length > 0).length;

  return (
    <div className="app-layout">
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? '✕' : '☰'}
      </button>

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span className="logo-icon">🎬</span>
          <h1>SkillFlix</h1>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Main</div>
          <button className={`nav-item ${page === 'dashboard' ? 'active' : ''}`} onClick={() => navigate('dashboard')}>
            <span className="nav-icon">🏠</span> Dashboard
          </button>
          <button className={`nav-item ${page === 'library' ? 'active' : ''}`} onClick={() => navigate('library')}>
            <span className="nav-icon">📚</span> Skills Library
          </button>

          <div className="nav-section-label">Categories</div>
          <button className="nav-item" onClick={() => navigate('library')}>
            <span className="nav-icon">🎨</span> Creative Arts
          </button>
          <button className="nav-item" onClick={() => navigate('library')}>
            <span className="nav-icon">✍️</span> Writing
          </button>
          <button className="nav-item" onClick={() => navigate('library')}>
            <span className="nav-icon">💻</span> Technology
          </button>
          <button className="nav-item" onClick={() => navigate('library')}>
            <span className="nav-icon">💼</span> Business
          </button>
          <button className="nav-item" onClick={() => navigate('library')}>
            <span className="nav-icon">🧠</span> Personal Dev
          </button>
          <button className="nav-item" onClick={() => navigate('library')}>
            <span className="nav-icon">🔨</span> Trade & Craft
          </button>
        </nav>

        <div className="sidebar-footer">
          {cloud && <div className="cloud-badge" style={{ marginBottom: 10 }}>☁️ Cloud Synced</div>}
          <div className="streak-badge">
            🔥 {state.streakDays} day streak
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
            {reviewedCount} skill{reviewedCount !== 1 ? 's' : ''} reviewed
          </div>
        </div>
      </aside>

      <main className="main-content">
        {page === 'dashboard' && <Dashboard onNavigate={navigate} />}
        {page === 'library' && <Library onNavigate={navigate} />}
        {page === 'skill' && selectedSkillId && (
          <SkillDetail skillId={selectedSkillId} onNavigate={navigate} />
        )}
      </main>
    </div>
  );
}

function CloudGate() {
  const [pinHash, setPinHash] = useState(() => sessionStorage.getItem('sf-pin'));

  if (!pinHash) {
    return <PinScreen onAuthenticated={(hash) => setPinHash(hash)} />;
  }

  return (
    <AppProvider pinHash={pinHash}>
      <AppContent />
    </AppProvider>
  );
}

function LocalApp() {
  return (
    <AppProvider pinHash={null}>
      <AppContent />
    </AppProvider>
  );
}

export default function App() {
  return isCloudEnabled() ? <CloudGate /> : <LocalApp />;
}
