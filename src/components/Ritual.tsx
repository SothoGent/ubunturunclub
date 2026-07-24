import { useMemo, useState } from "react";
import { Reveal } from "./ui";

const DAYS = [
  { code: "MON", n: "01" },
  { code: "TUE", n: "02" },
  { code: "WED", n: "03" },
  { code: "THU", n: "04" },
  { code: "FRI", n: "05" },
  { code: "SAT", n: "06" },
  { code: "SUN", n: "07" },
];

const OFF_MSGS: Record<string, string> = {
  MON: "Monday is a rest day. The legs remember Saturday.",
  TUE: "Tuesday — stretch, hydrate, live your life.",
  WED: "Wednesday — no club run. We move on Saturdays.",
  THU: "Thursday — cross-train if you like, guilt-free.",
  FRI: "Friday — early night. Tomorrow's the day.",
  SUN: "Sunday — recover. You earned the crumble bar.",
};

const TIMELINE = [
  { t: "07:15", h: "Roll in", d: "7 Limerick Road, Hillside Walk. Laces, layers, hellos.", feat: false },
  { t: "07:30", h: "Warm-up & strides", d: "Dynamic drills as a pack. Find your group — easy, steady, tempo.", feat: false },
  { t: "07:45", h: "Wheels up", d: "The run. Heads up, ego down, nobody dropped.", feat: true },
  { t: "08:30", h: "Cool down", d: "Easy jog-back, static stretch, water.", feat: false },
  { t: "08:45", h: "Comfort Recovery", d: "Shake n Toss apple crumble bar + post-run games. $5 well spent.", feat: true },
];

const PRESETS = [
  { label: "Easy", sec: 390 },
  { label: "Steady", sec: 330 },
  { label: "Tempo", sec: 300 },
  { label: "Race", sec: 270 },
];
const DISTS = [3, 5, 10, 21];

function fmt(totalSec: number) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.round(totalSec % 60);
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}
function paceStr(sec: number) {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}

export default function Ritual() {
  const [sel, setSel] = useState(5); // Saturday (Mon=0)
  const isSat = sel === 5;

  // pace calculator
  const [dist, setDist] = useState(5);
  const [pace, setPace] = useState(360); // 6:00 /km
  const total = useMemo(() => dist * pace, [dist, pace]);
  const spd = Math.max(2.2, pace / 60); // seconds per lap of the track
  const activePreset = PRESETS.find((p) => p.sec === pace)?.label ?? null;

  return (
    <section className="section ritual" id="ritual">
      <div className="shell">
        <Reveal className="head-row">
          <div>
            <span className="eyebrow gold">02 — The Ritual</span>
            <h2 style={{ marginTop: 14 }}>One day.<br /><span className="gold">Seven-thirty.</span></h2>
          </div>
          <p className="lede hide-sm">
            Tap a day. You'll notice six of them are quiet on purpose — URC runs on Saturdays and only on
            Saturdays. Pick your morning below.
          </p>
        </Reveal>

        <Reveal>
          <div className="week" role="tablist" aria-label="Days of the week">
            {DAYS.map((d, i) => (
              <button
                key={d.code}
                className={`day ${i === 5 ? "sat" : "off"} ${sel === i ? "" : ""}`}
                style={sel === i && i !== 5 ? { borderColor: "var(--flame)", background: "var(--ink-4)" } : undefined}
                onClick={() => setSel(i)}
                aria-pressed={sel === i}
              >
                {i === 5 && <span className="pulse" />}
                <span className="dn">{d.code}</span>
                <span className="dl">{d.n}</span>
              </button>
            ))}
          </div>
          <p className="day-msg" aria-live="polite">
            {isSat ? (
              <>
                <b>SATURDAY</b> — the only day on the calendar. 07:30, Hillside. The schedule below is the whole
                programme.
              </>
            ) : (
              <>{OFF_MSGS[DAYS[sel].code]} <b>→ see you Saturday.</b></>
            )}
          </p>
        </Reveal>

        <div className="ritual-body">
          {/* timeline */}
          <Reveal>
            <div className="timeline">
              {TIMELINE.map((it, i) => (
                <div className={`tl-item ${it.feat ? "feat" : ""}`} key={i}>
                  <div className="t">{it.t}</div>
                  <div className="h">{it.h}</div>
                  <div className="d">{it.d}</div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* pace calculator */}
          <Reveal d={1} className="pace">
            <h4>Plan your Saturday</h4>
            <div className="sub">Pace calculator · finish-line estimator</div>

            <div className="pace-row">
              <label>Distance</label>
              <div className="stepper">
                <button aria-label="less distance" onClick={() => setDist((d) => Math.max(1, d - 1))}>−</button>
                <span className="v">{dist} km</span>
                <button aria-label="more distance" onClick={() => setDist((d) => Math.min(42, d + 1))}>+</button>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
              {DISTS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDist(d)}
                  className="btn"
                  style={{ padding: "6px 10px", fontSize: 10, background: dist === d ? "var(--flame)" : "var(--ink-4)", color: "#fff" }}
                >
                  {d}km
                </button>
              ))}
            </div>

            <div className="pace-row" style={{ marginTop: 18 }}>
              <label>Pace / km</label>
              <div className="stepper">
                <button aria-label="slower" onClick={() => setPace((p) => Math.min(720, p + 15))}>+</button>
                <span className="v">{paceStr(pace)}</span>
                <button aria-label="faster" onClick={() => setPace((p) => Math.max(180, p - 15))}>−</button>
              </div>
            </div>
            <div className="pace-tags">
              {PRESETS.map((p) => (
                <button key={p.label} className={activePreset === p.label ? "on" : ""} onClick={() => setPace(p.sec)}>
                  {p.label}
                </button>
              ))}
            </div>

            <div className="pace-out">
              <div>
                <div className="lbl">Estimated finish</div>
                <div className="big">{fmt(total)}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="lbl">Per 5 km</div>
                <div style={{ fontFamily: "var(--disp)", fontSize: 26, color: "#fff" }}>{fmt(pace * 5)}</div>
              </div>
            </div>

            <div className="track" aria-hidden="true" style={{ ["--spd" as string]: `${spd}s` }}>
              <div className="lane-marks" />
              <div className="runner-dot">
                <svg width="26" height="26" viewBox="0 0 64 80" fill="none" stroke="currentColor" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="40" cy="13" r="6" fill="currentColor" stroke="none" />
                  <path d="M37 22 L30 44" /><path d="M36 25 L25 30 L21 21" /><path d="M36 25 L48 33 L54 26" />
                  <path d="M30 44 L19 56 L13 70" /><path d="M30 44 L45 53 L42 72" />
                </svg>
              </div>
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", marginTop: 8, letterSpacing: "0.1em" }}>
              * rough estimate — hills, wind & Saturday vibes may vary.
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
