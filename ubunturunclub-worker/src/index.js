// src/index.js

// Helper for JSON responses with CORS headers
function corsResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'max-age=300',
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Debug endpoints (optional)
    if (url.pathname === '/api/debug-activities') {
      const token = await getAccessToken(env);
      const res = await fetch(`https://www.strava.com/api/v3/clubs/${env.STRAVA_CLUB_ID}/activities?per_page=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      return corsResponse(data);
    }

    if (url.pathname === '/api/debug-members') {
      const token = await getAccessToken(env);
      const res = await fetch(`https://www.strava.com/api/v3/clubs/${env.STRAVA_CLUB_ID}/members?per_page=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      return corsResponse(data);
    }

    // Main leaderboard endpoint
    if (url.pathname === '/api/leaderboard') {
      return handleLeaderboard(env, url);
    }

    return corsResponse({ error: 'Not found' }, 404);
  },
};

async function handleLeaderboard(env, url) {
  const clubId = env.STRAVA_CLUB_ID;
  const token = await getAccessToken(env);

  const [membersRes, activitiesRes] = await Promise.all([
    fetch(`https://www.strava.com/api/v3/clubs/${clubId}/members?per_page=200`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetch(`https://www.strava.com/api/v3/clubs/${clubId}/activities?per_page=200`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);

  if (!membersRes.ok || !activitiesRes.ok) {
    return corsResponse({ error: 'Strava API error' }, 500);
  }

  const members = await membersRes.json();
  const activities = await activitiesRes.json();

  const period = url.searchParams.get('period') || 'week';

  const leaders = aggregateLeadersByName(activities, members, period);
  const stats = computeStats(leaders);
  const clubInfo = { name: 'UBUNTU RUN CLUB', member_count: members.length };

  return corsResponse({
    club: clubInfo,
    leaders,
    stats,
  });
}

// ---------- Token management (in‑memory) ----------
let cachedToken = null;
let tokenExpiry = 0;

async function getAccessToken(env) {
  if (cachedToken && Date.now() / 1000 < tokenExpiry) {
    return cachedToken;
  }

  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.STRAVA_CLIENT_ID,
      client_secret: env.STRAVA_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: env.STRAVA_REFRESH_TOKEN,
    }),
  });
  const data = await res.json();
  if (!data.access_token) {
    throw new Error('Failed to refresh token');
  }
  cachedToken = data.access_token;
  tokenExpiry = data.expires_at;
  return cachedToken;
}

// ---------- Aggregation logic ----------
function isRun(activity) {
  const type = `${activity.sport_type ?? ''} ${activity.type ?? ''}`.toLowerCase();
  return type.includes('run') || type.includes('jog');
}

function displayName(athlete) {
  const name = [athlete?.firstname, athlete?.lastname].filter(Boolean).join(' ');
  return name || 'Unnamed runner';
}

function startOfCatWeek() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const cat = new Date(utc + 2 * 60 * 60 * 1000);
  const day = cat.getUTCDay() || 7;
  cat.setUTCDate(cat.getUTCDate() - day + 1);
  cat.setUTCHours(0, 0, 0, 0);
  return cat.getTime() - 2 * 60 * 60 * 1000;
}

function parseStravaDate(value) {
  if (!value) return 0;
  const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value);
  return new Date(hasTimezone ? value : `${value}+02:00`).getTime();
}

function aggregateLeadersByName(activities, members, period) {
  const avatarMap = new Map();
  members.forEach(m => {
    const key = `${(m.firstname || '').trim().toLowerCase()}|${(m.lastname || '').trim().toLowerCase()}`;
    if (m.profile_medium) avatarMap.set(key, m.profile_medium);
  });

  const start = startOfCatWeek();
  const grouped = new Map();

  activities.forEach(activity => {
    if (!isRun(activity)) return;

    if (period === 'week') {
      const timestamp = parseStravaDate(activity.start_date_local);
      if (timestamp < start) return;
    }

    const athlete = activity.athlete;
    if (!athlete) return;

    const nameKey = `${(athlete.firstname || '').trim().toLowerCase()}|${(athlete.lastname || '').trim().toLowerCase()}`;
    const displayNameStr = displayName(athlete);

    const current = grouped.get(nameKey) ?? {
      id: nameKey,
      name: displayNameStr,
      avatar: avatarMap.get(nameKey) || null,
      distance: 0,
      time: 0,
      activities: 0,
      longestRun: 0,
      totalElevation: 0,
    };

    current.distance += activity.distance ?? 0;
    current.time += activity.moving_time ?? 0;
    current.activities += 1;
    current.longestRun = Math.max(current.longestRun, activity.distance ?? 0);
    current.totalElevation += activity.total_elevation_gain ?? 0;

    grouped.set(nameKey, current);
  });

  const result = Array.from(grouped.values()).map(l => ({
    ...l,
    avgPace: l.distance > 0 ? (l.time / l.distance) * 1000 : 0,
  }));

  return result.sort((a, b) => b.distance - a.distance);
}

function computeStats(leaders) {
  const totalDistance = leaders.reduce((sum, l) => sum + l.distance, 0);
  const totalTime = leaders.reduce((sum, l) => sum + l.time, 0);
  const totalActivities = leaders.reduce((sum, l) => sum + l.activities, 0);
  const totalElevation = leaders.reduce((sum, l) => sum + l.totalElevation, 0);
  return { totalDistance, totalTime, totalActivities, totalElevation };
}