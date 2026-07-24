import { useState, useEffect } from 'react';

const TOKEN_URL = 'https://www.strava.com/oauth/token';

export function useStravaToken() {
  const [token, setToken] = useState(import.meta.env.VITE_STRAVA_ACCESS_TOKEN);
  const [expiresAt, setExpiresAt] = useState(0);

  const refresh = async () => {
    try {
      const res = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: import.meta.env.VITE_STRAVA_CLIENT_ID,
          client_secret: import.meta.env.VITE_STRAVA_CLIENT_SECRET,
          grant_type: 'refresh_token',
          refresh_token: import.meta.env.VITE_STRAVA_REFRESH_TOKEN,
        }),
      });
      const data = await res.json();
      if (data.access_token) {
        setToken(data.access_token);
        setExpiresAt(data.expires_at * 1000);
        // Optionally store in localStorage for persistence
        localStorage.setItem('strava_token', data.access_token);
        localStorage.setItem('strava_expires', String(data.expires_at * 1000));
      }
    } catch (e) {
      console.warn('Token refresh failed', e);
    }
  };

  useEffect(() => {
    // Check expiry every minute
    const interval = setInterval(() => {
      const storedExpiry = localStorage.getItem('strava_expires');
      const expiry = storedExpiry ? parseInt(storedExpiry) : expiresAt;
      if (expiry && Date.now() > expiry - 120000) { // refresh 2 min before expiry
        refresh();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // initial load: try localStorage first
  useEffect(() => {
    const saved = localStorage.getItem('strava_token');
    if (saved) setToken(saved);
    const savedExp = localStorage.getItem('strava_expires');
    if (savedExp) setExpiresAt(parseInt(savedExp));
  }, []);

  return token;
}