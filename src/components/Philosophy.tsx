import { Reveal } from "./ui";

export default function Philosophy() {
  return (
    <section className="section philo" id="club">
      <div className="shell">
        <Reveal className="head-row">
          <div>
            <span className="eyebrow">01 — The Club</span>
            <h2 style={{ marginTop: 14 }}>Not a team.<br /><span className="flame">A people.</span></h2>
          </div>
          <span className="idx hide-sm">[ UBUNTU · /ùbúntú/ · n. ]</span>
        </Reveal>

        <div className="philo-grid">
          <div>
            <Reveal>
              <p className="big-q">
                “Ubuntu” means <span>I am because we are.</span> On the road it reads: I finish because we started together.
              </p>
            </Reveal>
            <Reveal d={1}>
              <p>
                Ubuntu Run Club is a Bulawayo running community built around a single, stubborn idea — that the
                morning belongs to everyone who shows up for it. No qualifiers, no try-outs, no pace police. You
                bring your legs and whatever you woke up with; the pack brings the rest.
              </p>
            </Reveal>
            <Reveal d={2}>
              <p>
                We meet <b style={{ color: "var(--gold)" }}>once a week, Saturdays at 07:30</b>, and that's the whole
                calendar. No midweek guilt, no second sessions. One shared morning, done with intention, then the
                city gets you back. Rest is part of the training.
              </p>
            </Reveal>
            <Reveal d={3} className="expect">
              <span className="chip">Easy & tempo groups</span>
              <span className="chip">Warm-up & strides</span>
              <span className="chip">Post-run games</span>
              <span className="chip">First-timers welcome</span>
              <span className="chip">Hillside routes</span>
              <span className="chip">Comfort recovery</span>
            </Reveal>
          </div>

          <Reveal d={1} className="founder">
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div className="av">FM</div>
              <div>
                <h3>Farai Mbaiwa</h3>
                <span className="role">Founder · Head of the Pack</span>
              </div>
            </div>
            <p className="quote">
              “I started URC because Bulawayo needed a start line that didn't ask for your CV. Saturday mornings
              taught me that community isn't built in a group chat — it's built at 7:30, breathing hard, side by
              side. Show up once. We'll handle the rest.”
            </p>
            <a className="ig" href="https://www.instagram.com/farai.mbaiwa/" target="_blank" rel="noreferrer">
              ↗ @farai.mbaiwa — follow the founder
            </a>
          </Reveal>
        </div>

      </div>
    </section>
  );
}
