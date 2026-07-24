import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type ElementType,
  type CSSProperties,
} from "react";

/* ---------- scroll reveal ---------- */
export function Reveal({
  children,
  className = "",
  d = 0,
  as: Tag = "div",
  style,
}: {
  children: ReactNode;
  className?: string;
  d?: number;
  as?: ElementType;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("in");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref as never} className={`reveal ${className}`} data-d={d || undefined} style={style}>
      {children}
    </Tag>
  );
}

/* ---------- marquee ticker ---------- */
export function Ticker({
  items,
  dur = 28,
  reverse = false,
  className = "",
  itemClass = "",
}: {
  items: string[];
  dur?: number;
  reverse?: boolean;
  className?: string;
  itemClass?: string;
}) {
  const content = [...items, ...items]; // duplicate so each track out-widths any viewport → seamless
  const row = (key: string) => (
    <div className={`marquee__track ${reverse ? "rev" : ""}`} key={key} style={{ ["--dur" as string]: `${dur}s` }}>
      {content.map((t, i) => (
        <span className={`tick-item ${itemClass}`} key={i}>
          {t}
          <span className="tick-dot" />
        </span>
      ))}
    </div>
  );
  return (
    <div className={`marquee ${className}`}>
      {row("a")}
      {row("b")}
    </div>
  );
}

/* ---------- live CAT (Bulawayo) clock ---------- */
export function useCatClock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Harare",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/* ---------- next-run countdown (Saturdays 07:30 CAT) ---------- */
export function useCountdown() {
  const [parts, setParts] = useState({ d: 0, h: 0, m: 0, s: 0, live: false });
  useEffect(() => {
    const compute = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const cat = new Date(utc + 2 * 3600000); // CAT = UTC+2, no DST
      const day = cat.getUTCDay();
      const hour = cat.getUTCHours();
      const min = cat.getUTCMinutes();
      let add = (6 - day + 7) % 7;
      if (add === 0 && (hour > 7 || (hour === 7 && min >= 30))) add = 7;
      const live = add === 0 && hour >= 7 && hour < 9; // on the morning
      const targetCat = Date.UTC(
        cat.getUTCFullYear(),
        cat.getUTCMonth(),
        cat.getUTCDate() + add,
        7,
        30,
        0
      );
      let diff = targetCat - 2 * 3600000 - now.getTime();
      if (diff < 0) diff = 0;
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setParts({ d, h, m, s, live });
    };
    compute();
    const id = setInterval(compute, 1000);
    return () => clearInterval(id);
  }, []);
  return parts;
}

export function Countdown({ compact = false }: { compact?: boolean }) {
  const { d, h, m, s, live } = useCountdown();
  const pad = (n: number) => String(n).padStart(2, "0");
  if (live) {
    return (
      <div className="countdown">
        <div className="cd-box hot"><div className="n">LIVE</div><div className="u">on the road</div></div>
      </div>
    );
  }
  return (
    <div className="countdown">
      <div className="cd-box"><div className="n">{pad(d)}</div><div className="u">days</div></div>
      <div className="cd-box"><div className="n">{pad(h)}</div><div className="u">hrs</div></div>
      {!compact && <div className="cd-box"><div className="n">{pad(m)}</div><div className="u">min</div></div>}
      {!compact && <div className="cd-box hot"><div className="n">{pad(s)}</div><div className="u">sec</div></div>}
    </div>
  );
}

/* ---------- count up when in view ---------- */
export function CountUp({
  end,
  dur = 1400,
  suffix = "",
  prefix = "",
  decimals = 0,
}: {
  end: number;
  dur?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const start = performance.now();
          const step = (now: number) => {
            const p = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(end * eased);
            if (p < 1) raf = requestAnimationFrame(step);
          };
          raf = requestAnimationFrame(step);
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [end, dur]);
  return (
    <span ref={ref}>
      {prefix}
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ---------- magnetic hover wrapper ---------- */
export function Magnetic({
  children,
  className = "",
  strength = 0.3,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * strength;
    const y = (e.clientY - r.top - r.height / 2) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };
  return (
    <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={reset} style={{ transition: "transform .3s cubic-bezier(.2,.8,.2,1)", display: "inline-block" }}>
      {children}
    </div>
  );
}
