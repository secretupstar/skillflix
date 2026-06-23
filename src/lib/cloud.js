const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const headers = () => ({
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
});

export const isCloudEnabled = () => !!SUPABASE_URL && !!SUPABASE_KEY;

async function hashPin(pin) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + '-skillflix-2026');
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function createAccount(pin) {
  const pinHash = await hashPin(pin);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/app_data`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ pin_hash: pinHash, data: {}, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (err.code === '23505') throw new Error('PIN already exists. Choose a different one.');
    throw new Error('Failed to create account');
  }
  return pinHash;
}

export async function verifyPin(pin) {
  const pinHash = await hashPin(pin);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/app_data?pin_hash=eq.${pinHash}&select=pin_hash`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error('Connection failed');
  const rows = await res.json();
  return rows.length > 0 ? pinHash : null;
}

export async function loadCloudData(pinHash) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/app_data?pin_hash=eq.${pinHash}&select=data`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error('Failed to load data');
  const rows = await res.json();
  if (rows.length === 0) return null;
  return rows[0].data;
}

export async function saveCloudData(pinHash, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/app_data?pin_hash=eq.${pinHash}`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({ data, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error('Failed to save data');
}
