import { Logo } from "./Logo";
import { Reveal } from "./ui";

const LongSleeve = () => (
  <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round">
    <path d="M48 22 Q60 30 72 22 L86 26 L110 40 L106 52 L86 46 L86 98 L34 98 L34 46 L14 52 L10 40 L34 26 Z" />
    <path d="M48 22 Q60 16 72 22" opacity=".6" />
  </svg>
);
const Shorts = () => (
  <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round">
    <path d="M32 28 L88 28 L92 60 L90 96 L64 90 L60 60 L56 90 L30 96 L28 60 Z" />
    <path d="M30 37 L90 37" opacity=".6" />
  </svg>
);
const Cap = () => (
  <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round">
    <path d="M28 66 Q28 30 60 30 Q92 30 92 66" />
    <path d="M88 62 Q114 62 118 74 Q98 80 90 70" />
    <path d="M26 66 L94 66" />
    <path d="M60 30 L60 66" opacity=".4" />
  </svg>
);
const Socks = () => (
  <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round">
    <path d="M44 24 L70 24 L70 70 Q70 78 78 82 L92 86 Q98 90 96 98 L52 98 Q44 98 44 88 Z" />
    <path d="M44 33 L70 33" opacity=".6" />
    <path d="M44 42 L70 42" opacity=".6" />
  </svg>
);

const KIT = [
  { Art: LongSleeve, tag: "DROP 01", name: "Long-Sleeve Performance Tee", meta: "XS–XXL · dri-fit", logo: true },
  { Art: Shorts, tag: "DROP 01", name: "2-in-1 Run Shorts", meta: "with liner · 5\"", logo: false },
  { Art: Cap, tag: "DROP 01", name: "URC Trucker Cap", meta: "snap-back", logo: true },
  { Art: Socks, tag: "DROP 01", name: "Cushioned Crew Socks", meta: "sold as a pair", logo: false },
];

const GALLERY = [
  { src: "https://images.pexels.com/photos/28448694/pexels-photo-28448694.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=900", cap: "The pack · in motion", cls: "a" },
  { src: "https://images.pexels.com/photos/2654902/pexels-photo-2654902.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800", cap: "Saturdays · together" },
  { src: "https://images.pexels.com/photos/38674799/pexels-photo-38674799.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800", cap: "After dark · the city" },
  { src: "https://images.pexels.com/photos/38674864/pexels-photo-38674864.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800", cap: "Lights · legs · loyalty" },
  { src: "https://images.pexels.com/photos/38674865/pexels-photo-38674865.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800", cap: "One start line" },
];

export default function Merch() {
  return (
    <>
      <section className="section merch" id="kit">
        <div className="shell">
          <Reveal className="head-row">
            <div>
              <span className="eyebrow">05 — The Kit</span>
              <h2 style={{ marginTop: 14 }}>Wear the<br /><span className="flame">ubuntu.</span></h2>
            </div>
            <p className="lede hide-sm">
              Limited drops, built for the morning and the street after it. Black-on-black, speed-streaked,
              crowned. Cop your size and collect at the next run.
            </p>
          </Reveal>

          <Reveal className="kit-grid">
            {KIT.map((k, i) => (
              <div className="kit" key={i} data-d={i}>
                <span className="tag">{k.tag}</span>
                <div className="art">
                  <k.Art />
                  {k.logo && (
                    <span className="urc-on"><Logo streaks={false} reg={false} /></span>
                  )}
                </div>
                <div className="name">{k.name}</div>
                <div className="meta"><span>{k.meta}</span><span className="pr">DM to cop</span></div>
                <a className="cop" href="https://www.instagram.com/_ubunturunclub/" target="_blank" rel="noreferrer">
                  ↗ reserve your size
                </a>
              </div>
            ))}
          </Reveal>

          <Reveal className="merch-note">
            <span style={{ fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase" }}>
              Kit drops in limited runs · sizes move fast
            </span>
            <a className="btn btn--ghost" href="https://www.instagram.com/_ubunturunclub/" target="_blank" rel="noreferrer">
              Shop via DM <span className="ar">→</span>
            </a>
          </Reveal>
        </div>
      </section>

      <section className="section pack" style={{ paddingTop: 0 }}>
        <div className="shell">
          <Reveal className="head-row" style={{ marginBottom: 28 }}>
            <div>
              <span className="eyebrow gold">06 — The Pack</span>
              <h2 style={{ marginTop: 14, fontSize: "clamp(34px,6vw,80px)" }}>Proof of <span className="gold">life.</span></h2>
            </div>
            <a className="btn btn--ghost hide-sm" href="https://www.tiktok.com/@_ubunturunclub" target="_blank" rel="noreferrer">
              @_ubunturunclub on TikTok <span className="ar">→</span>
            </a>
          </Reveal>
          <Reveal className="pack-grid">
            {GALLERY.map((g, i) => (
              <div className={`pack-tile ${g.cls ?? ""}`} key={i}>
                <img src={g.src} alt={g.cap} loading="lazy" />
                <span className="cap"><b>URC</b> · {g.cap}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
