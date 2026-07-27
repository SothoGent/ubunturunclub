import { useEffect, useState } from "react";
import { Logo } from "./components/Logo";
import { Ticker, useCatClock, Magnetic } from "./components/ui";
import Hero from "./components/Hero";
import Philosophy from "./components/Philosophy";
import StravaBoard from "./components/StravaBoard";
import Ritual from "./components/Ritual";
import LocationMap from "./components/LocationMap";
import Sponsor from "./components/Sponsor";
import Merch from "./components/Merch";
import Clothing from "./components/Clothing";
import Footer from "./components/Footer";

const NAV = [
  { t: "Club", h: "#club" },
  { t: "Board", h: "#leaderboard" },
  { t: "Ritual", h: "#ritual" },
  { t: "Location", h: "#location" },
  { t: "Kit", h: "#kit" },
  { t: "Clothing", h: "#clothing" },   
  { t: "Recovery", h: "#recovery" },
];

const TICKER_A = [
  "Saturdays", "07:30 sharp", "Hillside · Bulawayo", "All paces welcome",
  "Free to join", "I am because we run", "Recovery by Shake n Toss",
];
const TICKER_B = [
  "7 Limerick Road", "One morning a week", "No pace police", "UBUNTU",
  "Warm-up · strides · wheels up", "First-timers welcome",
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const clock = useCatClock();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <a href="#top" aria-label="Ubuntu Run Club home" style={{ color: "#fff" }}>
        <Logo reg={false} />
      </a>

      {/* Desktop nav links */}
      <div className="nav-links desktop-only">
        {NAV.map((n) => (
          <a key={n.h} href={n.h}>{n.t}</a>
        ))}
      </div>

      <div className="nav-right">
        <span className="clock hide-mobile">
          BYO <b>{clock || "--:--:--"}</b> CAT
        </span>
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
          <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
          <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
        </button>
        <Magnetic>
          <a
            className="btn"
            href="https://www.strava.com/clubs/1895513"
            target="_blank"
            rel="noreferrer"
            style={{ padding: "11px 18px" }}
          >
            Join <span className="ar">→</span>
          </a>
        </Magnetic>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="mobile-menu">
          {NAV.map((n) => (
            <a key={n.h} href={n.h} onClick={() => setMenuOpen(false)}>
              {n.t}
            </a>
          ))}
          <a
            href="https://www.strava.com/clubs/1895513"
            target="_blank"
            rel="noreferrer"
            className="btn mobile-join"
          >
            Join Saturday →
          </a>
        </div>
      )}
    </nav>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />

        <div aria-hidden="true">
          <Ticker items={TICKER_A} dur={30} className="marquee--flame" />
          <Ticker items={TICKER_B} dur={34} reverse className="marquee--gold" />
        </div>

        <Philosophy />
        <StravaBoard />
        <Ritual />
        <LocationMap />
        <Sponsor />
        <Clothing />
        <Merch />
        <Footer />
      </main>
      <div className="grain" aria-hidden="true" />
    </>
  );
}
