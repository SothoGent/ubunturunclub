import { Logo } from "./Logo";
import { Reveal, Magnetic } from "./ui";

const COLS = [
  {
    h: "The Club",
    links: [
      { t: "About URC", href: "#club" },
      { t: "The Ritual", href: "#ritual" },
      { t: "The Kit", href: "#kit" },
      { t: "Recovery", href: "#recovery" },
    ],
  },
  {
    h: "Find Us",
    links: [
      { t: "7 Limerick Road", href: "#location" },
      { t: "Hillside Walk, Hillside", href: "#location" },
      { t: "Saturdays · 07:30", href: "#ritual" },
      { t: "Get directions ↗", href: "https://www.google.com/maps/dir/?api=1&destination=-20.19957,28.5956" },
    ],
  },
  {
    h: "Connect",
    links: [
      { t: "Instagram ↗", href: "https://www.instagram.com/_ubunturunclub/" },
      { t: "TikTok ↗", href: "https://www.tiktok.com/@_ubunturunclub" },
      { t: "Strava club ↗", href: "https://www.strava.com/clubs/1895513" },
      { t: "Founder · @farai.mbaiwa ↗", href: "https://www.instagram.com/farai.mbaiwa/" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="foot" id="join">
      <div className="shell">
        <div className="foot-top">
          <Reveal>
            <span className="eyebrow">Roll in · you belong here</span>
            <h2 style={{ marginTop: 14 }}>
              Show up<br />Saturday. <span className="flame">We'll</span><br />handle the rest.
            </h2>
          </Reveal>
          <Reveal d={1} style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
            <p className="muted" style={{ maxWidth: 340 }}>
              No sign-up form, no fee, no minimum pace. Be at 7 Limerick Road at 07:15 with shoes and a little
              courage. The pack does the rest.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Magnetic>
                <a className="btn" href="https://www.strava.com/clubs/1895513" target="_blank" rel="noreferrer">
                  Join on Strava <span className="ar">→</span>
                </a>
              </Magnetic>
              <a className="btn btn--ghost" href="https://www.instagram.com/_ubunturunclub/" target="_blank" rel="noreferrer">
                DM the club
              </a>
            </div>
          </Reveal>
        </div>

        <div className="foot-cols">
          {COLS.map((c) => (
            <div key={c.h}>
              <h5>{c.h}</h5>
              {c.links.map((l) => (
                <a key={l.t} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                  {l.t}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, marginTop: 40, flexWrap: "wrap" }}>
          <span style={{ color: "#fff", fontSize: 44 }}><Logo reg={false} /></span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>
            In partnership with Shake n Toss · Bulawayo, Zimbabwe
          </span>
        </div>

        <div className="foot-word" aria-hidden="true">
          RUN<span>·</span>CLUB
        </div>

        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} Ubuntu Run Club · I am because we run</span>
          <span>Saturdays 07:30 — no exceptions</span>
        </div>
      </div>
    </footer>
  );
}
