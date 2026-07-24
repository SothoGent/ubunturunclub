import { Logo, ShakeNTossLogo } from "./Logo";
import { Reveal } from "./ui";

export default function Sponsor() {
  return (
    <section className="section sponsor" id="recovery">
      <div className="shell">
        <Reveal className="sp-lock">
          <span style={{ color: "var(--ink)" }}><Logo reg={false} /></span>
          <span className="x">×</span>
          <ShakeNTossLogo />
        </Reveal>

        <div className="sp-grid">
          <div>
            <Reveal><span className="eyebrow" style={{ color: "var(--green)" }}>04 — Recovery Partner</span></Reveal>
            <Reveal d={1}>
              <h3 className="sp-head">
                The Comfort<br /><span className="grn">Recovery</span>
              </h3>
            </Reveal>
            <Reveal d={2}>
              <p className="sp-tag">
                The run gets you here. The community brings you back. <span className="heart">♥</span>
                <br />
                A warm apple crumble bar made with real ingredients, a hint of cinnamon, and the perfect touch of
                comfort — waiting at the finish, every Saturday.
              </p>
            </Reveal>

            <Reveal d={3} style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 26, flexWrap: "wrap" }}>
              <div className="price-badge">
                $5<small>per bar</small>
              </div>
              <div style={{ maxWidth: 280 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--green)" }}>Post-run fuel</div>
                <div style={{ fontFamily: "var(--disp)", fontSize: 28, textTransform: "uppercase", lineHeight: 1, color: "#1c1a14", marginTop: 6 }}>Warm apple crumble + a cold shake</div>
              </div>
            </Reveal>

            <Reveal d={4} className="sp-chips">
              <div className="sp-chip"><div className="ic">♥</div><div className="t">Post-run vibes</div></div>
              <div className="sp-chip"><div className="ic">◍</div><div className="t">Games</div></div>
              <div className="sp-chip"><div className="ic">❧</div><div className="t">Clean snacking</div></div>
            </Reveal>
          </div>

          {/* ---- Visual panel with your image ---- */}
          <Reveal d={1}>
            <div className="sp-visual" style={{ position: "relative", background: "var(--paper-2)", overflow: "hidden", height: "400px" }}>
              {/* Display the image */}
              <img
                src="/apple_crumble.jpg"
                alt="Apple crumble bar and coffee"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              {/* Overlay logo and tag */}
              <ShakeNTossLogo style={{ position: "absolute", bottom: "20px", right: "20px", width: "120px", opacity: 0.7 }} />
              <div className="tag" style={{ position: "absolute", bottom: "10px", left: "10px", fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--green)" }}>
                ↘ shake · toss · recover · repeat
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}