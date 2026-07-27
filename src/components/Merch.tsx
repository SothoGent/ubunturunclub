// src/components/Merch.tsx
import { Logo } from "./Logo";
import { Reveal } from "./ui";

const KIT = [
  {
    image: "/images/ubuntuKit_tshirt(2).jpeg",
    tag: "DROP 01",
    name: "Performance Tee",
    meta: "XS–XXL · dri-fit",
    logo: true,
  },
  {
    image: "/images/ubuntuKit_shorts.jpeg",
    tag: "DROP 01",
    name: "2-in-1 Run Shorts",
    meta: "with liner · 5\"",
    logo: true,
  },
  {
    image: "/images/ubuntuKit_cap.jpeg",
    tag: "DROP 01",
    name: "URC Trucker Cap",
    meta: "snap-back",
    logo: true,
  },
  {
    image: "/images/ubuntuKit_socks.jpeg",
    tag: "DROP 01",
    name: "Cushioned Crew Socks",
    meta: "sold as a pair",
    logo: true,
  },
  
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
                  <img
                    src={k.image}
                    alt={k.name}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  {k.logo && (
                    <span className="urc-on">
                      <Logo streaks={false} reg={false} />
                    </span>
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