export function validAccountConfig(url: unknown, key: unknown): url is string {
  if (typeof url !== 'string' || typeof key !== 'string' || !key) return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.pathname !== '/' || !/^[a-z0-9-]+\.supabase\.co$/.test(parsed.hostname)) return false;
    if (key.startsWith('sb_publishable_')) return true;
    if (key.startsWith('sb_secret_')) return false;
    const payload = JSON.parse(atob(key.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));
    return payload.role === 'anon';
  } catch { return false; }
}
