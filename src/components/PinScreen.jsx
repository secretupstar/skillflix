import { useState } from 'react';
import { createAccount, verifyPin } from '../lib/cloud';

export default function PinScreen({ onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (pin.length < 4) { setError('PIN must be at least 4 digits'); return; }
    setLoading(true);
    setError('');
    try {
      const pinHash = await verifyPin(pin);
      if (pinHash) {
        sessionStorage.setItem('sf-pin', pinHash);
        onAuthenticated(pinHash);
      } else {
        setError('Wrong PIN. Try again or create a new account.');
      }
    } catch {
      setError('Connection failed. Check your internet.');
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (pin.length < 4) { setError('PIN must be at least 4 digits'); return; }
    if (pin !== confirmPin) { setError('PINs do not match'); return; }
    setLoading(true);
    setError('');
    try {
      const pinHash = await createAccount(pin);
      sessionStorage.setItem('sf-pin', pinHash);
      onAuthenticated(pinHash);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      mode === 'login' ? handleLogin() : handleCreate();
    }
  };

  return (
    <div className="pin-screen">
      <div className="pin-bg-glow" />
      <div className="pin-card">
        <div className="pin-logo">
          <span className="pin-logo-icon">🎬</span>
          <h1 className="pin-title">SkillFlix</h1>
          <p className="pin-subtitle">Your Personal Skill Theater</p>
        </div>

        <div className="pin-tabs">
          <button
            className={`pin-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); setPin(''); setConfirmPin(''); }}
          >
            Enter PIN
          </button>
          <button
            className={`pin-tab ${mode === 'create' ? 'active' : ''}`}
            onClick={() => { setMode('create'); setError(''); setPin(''); setConfirmPin(''); }}
          >
            New Account
          </button>
        </div>

        <div className="pin-form">
          <label className="pin-label">
            {mode === 'login' ? 'Your PIN' : 'Choose a PIN (4+ digits)'}
          </label>
          <input
            type="password"
            className="pin-input"
            value={pin}
            onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
            onKeyDown={handleKeyDown}
            placeholder="••••"
            maxLength={8}
            autoFocus
            inputMode="numeric"
          />

          {mode === 'create' && (
            <>
              <label className="pin-label" style={{ marginTop: 16 }}>Confirm PIN</label>
              <input
                type="password"
                className="pin-input"
                value={confirmPin}
                onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                onKeyDown={handleKeyDown}
                placeholder="••••"
                maxLength={8}
                inputMode="numeric"
              />
            </>
          )}

          {error && <div className="pin-error">{error}</div>}

          <button
            className="pin-submit"
            onClick={mode === 'login' ? handleLogin : handleCreate}
            disabled={loading}
          >
            {loading ? 'Connecting...' : mode === 'login' ? 'Unlock' : 'Create Account'}
          </button>
        </div>

        <p className="pin-footer">
          {mode === 'login'
            ? 'Access your skills from any device with your PIN'
            : 'Remember this PIN — it\'s your key to access from any device'}
        </p>
      </div>
    </div>
  );
}
