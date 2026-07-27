import { useEffect, useState } from "react";
import { Reveal } from "./ui";

const CLUB_ID = "1895513";
const CLUB_URL = `https://www.strava.com/clubs/${CLUB_ID}`;
const API_BASE = import.meta.env.VITE_API_URL || "/api/leaderboard";

type Metric = "distance" | "time" | "elevation" | "runs";
type Period = "week" | "recent";

type Leader = {
  id: string;
  name: string;
  avatar?: string;
  distance: number;
  time: number;
  activities: number;
  longestRun: number;
  totalElevation: number;
  avgPace: number;
};

type ApiResponse = {
  club: { name?: string; member_count?: number };
  leaders: Leader[];
  stats: {
    totalDistance: number;
    totalTime: number;
    totalActivities: number;
    totalElevation: number;
  };
};

function formatDistance(meters: number) {
  return `${(meters / 1000).toFixed(meters >= 10000 ? 0 : 1)} km`;
}

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return hours ? `${hours}h ${String(minutes).padStart(2, "0")}m` : `${minutes}m`;
}

function formatPace(secondsPerKm: number) {
  if (secondsPerKm === 0 || !isFinite(secondsPerKm)) return "—";
  const mins = Math.floor(secondsPerKm / 60);
  const secs = Math.round(secondsPerKm % 60);
  return `${mins}:${String(secs).padStart(2, "0")} /km`;
}

function formatElevation(meters: number) {
  if (!meters) return "—";
  return `${Math.round(meters)} m`;
}

export default function StravaBoard() {
  const [club, setClub] = useState<{ name?: string; member_count?: number } | null>(null);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [stats, setStats] = useState<ApiResponse["stats"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState<Period>("week");
  const [sortBy, setSortBy] = useState<Metric>("distance");

  const fetchData = async (selectedPeriod: Period) => {
    setLoading(true);
    try {
      const url = `${API_BASE}?period=${selectedPeriod}`;
      console.log("Fetching:", url);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ApiResponse = await res.json();
      console.log("Data received:", data);
      setClub(data.club);
      setLeaders(data.leaders || []);
      setStats(data.stats);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Could not load leaderboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(period);
  }, [period]);

  // Sort leaders based on selected metric
  const sortedLeaders = [...leaders].sort((a, b) => {
    let aVal: number, bVal: number;
    if (sortBy === "distance") { aVal = a.distance; bVal = b.distance; }
    else if (sortBy === "time") { aVal = a.time; bVal = b.time; }
    else if (sortBy === "elevation") { aVal = a.totalElevation; bVal = b.totalElevation; }
    else { aVal = a.activities; bVal = b.activities; }
    return bVal - aVal;
  });

  if (loading) {
    return (
      <section className="section strava-board" id="leaderboard">
        <div className="shell">
          <div className="strava-results" style={{ padding: "60px 20px", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--mono)", color: "var(--muted)" }}>Loading the pack...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section strava-board" id="leaderboard">
        <div className="shell">
          <div className="strava-results" style={{ padding: "60px 20px", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--mono)", color: "var(--flame)" }}>{error}</div>
          </div>
        </div>
      </section>
    );
  }

  const hasLeaders = leaders.length > 0;
  const memberCount = club?.member_count ?? "—";

  return (
    <section className="section strava-board" id="leaderboard">
      <div className="shell">
        <Reveal className="head-row">
          <div>
            <span className="eyebrow gold">02 — The Strava Board</span>
            <h2 style={{ marginTop: 14 }}>The pack<br /><span className="gold">keeps score.</span></h2>
          </div>
          <a className="btn btn--ghost hide-sm" href={CLUB_URL} target="_blank" rel="noreferrer">
            Open URC on Strava <span className="ar">↗</span>
          </a>
        </Reveal>

        <Reveal className="strava-intro">
          <div>
            <span className="eyebrow">Ubuntu Run Club · {memberCount} members</span>
            <p>
              Ranked by running distance, total time, elevation, or number of runs. Updated automatically from Strava.
            </p>
          </div>
          <div className="strava-source">
            <span className="source-pip" style={{ background: "var(--gold)" }} />
            <span>Live data</span>
            <small>auto‑synced</small>
          </div>
        </Reveal>

        <div className="strava-grid" style={{ gridTemplateColumns: "1fr" }}>
          <Reveal className="strava-results">
            <div className="board-toolbar">
              <div className="period-switch" role="tablist">
                <button className={period === "week" ? "on" : ""} onClick={() => setPeriod("week")}>This week</button>
                <button className={period === "recent" ? "on" : ""} onClick={() => setPeriod("recent")}>All time</button>
              </div>
              <div className="metric-switch" role="tablist">
                <button className={sortBy === "distance" ? "on" : ""} onClick={() => setSortBy("distance")}>KM</button>
                <button className={sortBy === "time" ? "on" : ""} onClick={() => setSortBy("time")}>TIME</button>
                <button className={sortBy === "elevation" ? "on" : ""} onClick={() => setSortBy("elevation")}>ELEV</button>
                <button className={sortBy === "runs" ? "on" : ""} onClick={() => setSortBy("runs")}>RUNS</button>
              </div>
            </div>

            <div className="board-stats">
              <div><strong>{memberCount}</strong><span>members</span></div>
              <div><strong>{stats ? formatDistance(stats.totalDistance) : "—"}</strong><span>total km</span></div>
              <div><strong>{stats ? formatTime(stats.totalTime) : "—"}</strong><span>moving time</span></div>
              <div><strong>{stats?.totalActivities ?? "—"}</strong><span>runs</span></div>
              <div><strong>{stats ? formatElevation(stats.totalElevation) : "—"}</strong><span>elevation</span></div>
            </div>

            {hasLeaders ? (
              <div className="leader-list" style={{ maxHeight: "600px", overflowY: "auto" }}>
                <table className="leader-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--line)",
                        color: "var(--muted)",
                        fontSize: "11px",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      <th style={{ padding: "8px 6px", textAlign: "left" }}>#</th>
                      <th style={{ padding: "8px 6px", textAlign: "left" }}>Athlete</th>
                      <th style={{ padding: "8px 6px", textAlign: "right" }}>Distance</th>
                      <th style={{ padding: "8px 6px", textAlign: "right" }}>Runs</th>
                      <th className="hide-mobile" style={{ padding: "8px 6px", textAlign: "right" }}>Longest</th>
                      <th className="hide-mobile" style={{ padding: "8px 6px", textAlign: "right" }}>Avg Pace</th>
                      <th className="hide-mobile" style={{ padding: "8px 6px", textAlign: "right" }}>Elev Gain</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedLeaders.map((leader, index) => (
                      <tr
                        key={leader.id}
                        className={index === 0 ? "leader-row--top" : ""}
                        style={{ borderBottom: "1px solid rgba(42,45,53,.5)" }}
                      >
                        <td
                          style={{
                            padding: "10px 6px",
                            fontFamily: "var(--mono)",
                            fontSize: "12px",
                            color: index === 0 ? "var(--gold)" : "var(--muted)",
                          }}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </td>

                        <td style={{ padding: "10px 6px", display: "flex", alignItems: "center", gap: "10px" }}>
                          {leader.avatar ? (
                            <img
                              src={leader.avatar}
                              alt=""
                              className="leader-avatar"
                              style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }}
                            />
                          ) : (
                            <span
                              className="leader-avatar leader-avatar--blank"
                              style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                border: "1px solid var(--line)",
                                display: "inline-block",
                              }}
                            />
                          )}
                          <span style={{ fontWeight: index === 0 ? "600" : "normal", color: "var(--bone)" }}>
                            {leader.name}
                          </span>
                        </td>

                        <td
                          style={{
                            padding: "10px 6px",
                            textAlign: "right",
                            fontFamily: "var(--mono)",
                            fontSize: "12px",
                            color: "var(--gold)",
                          }}
                        >
                          {formatDistance(leader.distance)}
                        </td>

                        <td
                          style={{
                            padding: "10px 6px",
                            textAlign: "right",
                            fontFamily: "var(--mono)",
                            fontSize: "12px",
                            color: "var(--bone)",
                          }}
                        >
                          {leader.activities}
                        </td>

                        <td
                          className="hide-mobile"
                          style={{
                            padding: "10px 6px",
                            textAlign: "right",
                            fontFamily: "var(--mono)",
                            fontSize: "12px",
                            color: "var(--bone)",
                          }}
                        >
                          {formatDistance(leader.longestRun)}
                        </td>

                        <td
                          className="hide-mobile"
                          style={{
                            padding: "10px 6px",
                            textAlign: "right",
                            fontFamily: "var(--mono)",
                            fontSize: "12px",
                            color: "var(--bone)",
                          }}
                        >
                          {formatPace(leader.avgPace)}
                        </td>

                        <td
                          className="hide-mobile"
                          style={{
                            padding: "10px 6px",
                            textAlign: "right",
                            fontFamily: "var(--mono)",
                            fontSize: "12px",
                            color: "var(--bone)",
                          }}
                        >
                          {formatElevation(leader.totalElevation)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="board-empty">
                <span className="empty-mark">01</span>
                <h4>No runners yet.</h4>
                <p>Check back after the next Saturday run.</p>
              </div>
            )}
            <div className="board-footnote">Source: Strava club {CLUB_ID} · running activities only · CAT weekly window</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}