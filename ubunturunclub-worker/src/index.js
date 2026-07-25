// src/index.js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle OPTIONS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Debug: show raw activities
    if (url.pathname === '/api/debug-activities') {
      const token = await getAccessToken(env);
      const res = await fetch(`https://www.strava.com/api/v3/clubs/${env.STRAVA_CLUB_ID}/activities?per_page=20`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      return new Response(JSON.stringify(data, null, 2), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // Main leaderboard endpoint
    if (url.pathname === '/api/leaderboard') {
      return handleLeaderboard(env, url);
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  },
};

async function handleLeaderboard(env, url) {
  console.log("🟢 handleLeaderboard called");
  const clubId = env.STRAVA_CLUB_ID;
  const token = await getAccessToken(env);
  console.log("🟢 Token obtained");

  const [membersRes, activitiesRes] = await Promise.all([
    fetch(`https://www.strava.com/api/v3/clubs/${clubId}/members?per_page=200`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetch(`https://www.strava.com/api/v3/clubs/${clubId}/activities?per_page=200`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);

  if (!membersRes.ok || !activitiesRes.ok) {
    console.error("❌ Strava API error");
    return new Response(JSON.stringify({ error: 'Strava API error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const members = await membersRes.json();
  const activities = await activitiesRes.json();
  console.log(`🟢 Members: ${members.length}, Activities: ${activities.length}`);

  const period = url.searchParams.get('period') || 'week';
  console.log(`🟢 Period: ${period}`);

  let leaders = aggregateLeadersByName(activities, members, period);
  console.log(`🟢 Leaders after aggregation: ${leaders.length}`);

  // FALLBACK: if leaders is empty and period is 'week', try with 'recent' to bypass date filter
  if (leaders.length === 0 && period === 'week') {
    console.warn("⚠️ Week returned empty, falling back to recent (all activities)");
    leaders = aggregateLeadersByName(activities, members, 'recent');
    console.log(`🟢 Leaders after fallback: ${leaders.length}`);
  }

  const stats = computeStats(leaders);
  const clubInfo = { name: 'UBUNTU RUN CLUB', member_count: members.length };

  return new Response(
    JSON.stringify({ club: clubInfo, leaders, stats }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'max-age=300',
      },
    }
  );
}

// ---------- Token management ----------
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

// ---------- Aggregation ----------
function isRun(activity) {
  const type = `${activity.sport_type ?? ''} ${activity.type ?? ''}`.toLowerCase();
  return type.includes('run') || type.includes('jog');
}

function displayName(athlete) {
  const name = [athlete?.firstname, athlete?.lastname].filter(Boolean).join(' ');
  return name || 'Unnamed runner';
}

function aggregateLeadersByName(activities, members, period) {
  console.log(`🔍 aggregating ${activities.length} activities for period: ${period}`);
  const grouped = new Map();

  // For "week", use a rolling 7‑day window
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  activities.forEach((activity, index) => {
    if (!isRun(activity)) {
      console.log(`   Skipping non-run #${index}: ${activity.name}`);
      return;
    }

    if (period === 'week') {
      const timestamp = parseStravaDate(activity.start_date_local);
      if (timestamp < sevenDaysAgo) {
        console.log(`   Skipping old activity #${index}: ${activity.name} (${new Date(timestamp).toISOString()})`);
        return;
      }
    }

    const athlete = activity.athlete;
    if (!athlete) {
      console.log(`   Skipping activity without athlete #${index}`);
      return;
    }

    const nameKey = `${(athlete.firstname || '').trim().toLowerCase()}|${(athlete.lastname || '').trim().toLowerCase()}`;
    const displayNameStr = displayName(athlete);

    const current = grouped.get(nameKey) ?? {
      id: nameKey,
      name: displayNameStr,
      avatar: null,
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

  // Match avatars from members list
  const avatarMap = new Map();
  members.forEach(m => {
    const key = `${(m.firstname || '').trim().toLowerCase()}|${(m.lastname || '').trim().toLowerCase()}`;
    if (m.profile_medium) avatarMap.set(key, m.profile_medium);
  });

  const result = Array.from(grouped.values()).map(l => ({
    ...l,
    avatar: avatarMap.get(l.id) || null,
    avgPace: l.distance > 0 ? (l.time / l.distance) * 1000 : 0,
  }));

  console.log(`🔍 Final leaders: ${result.length}`);
  return result.sort((a, b) => b.distance - a.distance);
}

function computeStats(leaders) {
  const totalDistance = leaders.reduce((sum, l) => sum + l.distance, 0);
  const totalTime = leaders.reduce((sum, l) => sum + l.time, 0);
  const totalActivities = leaders.reduce((sum, l) => sum + l.activities, 0);
  const totalElevation = leaders.reduce((sum, l) => sum + l.totalElevation, 0);
  return { totalDistance, totalTime, totalActivities, totalElevation };
}

function parseStravaDate(value) {
  if (!value) return 0;
  const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value);
  return new Date(hasTimezone ? value : `${value}+02:00`).getTime();
}