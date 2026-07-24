import { Logo } from "./Logo";
import { Countdown, Magnetic } from "./ui";

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero__bg">
        <img src="/images/dawn-pack.jpg" alt="A pack of runners moving at first light" />
      </div>
      <div className="streaks"><i /><i /><i /><i /><i /></div>
      <span className="vert l">I am because we run · Bulawayo</span>
      <span className="vert r">Saturdays · 07:30 · Hillside</span>

      <div className="hero__top">
        <span className="eyebrow">Ubuntu Run Club — Bulawayo, ZW</span>
        <div className="hero__stamp hide-sm">
          We move <b>once a week</b>.<br />
          No other days.<br />
          <div style={{ height: 10 }} />
          <Countdown compact />
        </div>
      </div>

      <div className="shell hero__inner">
        <div className="hero__word" aria-hidden="true">
          <Logo streaks={false} reg={false} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 6, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.42em", color: "var(--gold)", textTransform: "uppercase" }}>
            Ubuntu&nbsp;Run&nbsp;Club
          </span>
          <span style={{ width: 40, height: 1, background: "var(--line)" }} />
          <span style={{ fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.2em", color: "var(--muted)", textTransform: "uppercase" }}>
            Est. on foot
          </span>
        </div>

        <div className="hero__sub">
          <p className="hero__tag">
            I am because <em>we run.</em><br />
            <span style={{ color: "var(--muted)", fontSize: "0.62em" }}>One morning. One start line. Every Saturday.</span>
          </p>
          <div className="hero__cta">
            <Magnetic>
              <a className="btn" href="https://www.strava.com/clubs/1895513" target="_blank" rel="noreferrer">
                Join the start line <span className="ar">→</span>
              </a>
            </Magnetic>
            <a className="btn btn--ghost" href="https://www.instagram.com/_ubunturunclub/" target="_blank" rel="noreferrer">
              @_ubunturunclub
            </a>
          </div>
        </div>

        <div className="hero__meta">
          <span className="chip"><span className="pip" /> Saturdays only</span>
          <span className="chip">All paces welcome</span>
          <span className="chip">Free to roll in</span>
          <span className="chip">Recovery by Shake&nbsp;n&nbsp;Toss</span>
        </div>
      </div>
    </header>
  );
}
