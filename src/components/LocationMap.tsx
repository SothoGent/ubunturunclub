import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Reveal } from "./ui";

// 7 Limerick Road, Hillside Walk, Hillside, Bulawayo (OSM-resolved)
const LNG = 28.5956;
const LAT = -20.19957;

export default function LocationMap() {
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!container.current) return;
    let map: maplibregl.Map | null = null;
    try {
      map = new maplibregl.Map({
        container: container.current,
        style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
        center: [LNG, LAT],
        zoom: 15.4,
      });
      map.dragRotate.disable();
      map.touchZoomRotate.disableRotation();

      // custom flame pin
      const el = document.createElement("div");
      el.innerHTML = `
        <div style="position:relative;width:46px;height:46px;">
          <span style="position:absolute;inset:0;border-radius:50%;background:rgba(255,90,31,.45);animation:pinpulse 1.8s infinite;"></span>
          <svg viewBox="0 0 40 52" width="40" height="52" style="position:absolute;left:3px;top:0;filter:drop-shadow(0 6px 10px rgba(0,0,0,.6));">
            <path d="M20 0C9 0 0 9 0 20c0 14 20 32 20 32s20-18 20-32C40 9 31 0 20 0z" fill="#ff5a1f"/>
            <circle cx="20" cy="19" r="7.5" fill="#0b0c10"/>
            <circle cx="20" cy="19" r="3" fill="#ffc01e"/>
          </svg>
        </div>`;
      const style = document.createElement("style");
      style.textContent = "@keyframes pinpulse{0%{transform:scale(.6);opacity:.8}100%{transform:scale(2.2);opacity:0}}";
      el.appendChild(style);

      new maplibregl.Marker({ element: el, anchor: "bottom" }).setLngLat([LNG, LAT]).addTo(map);

      map.addControl(new maplibregl.NavigationControl({ showCompass: false, visualizePitch: false }), "bottom-right");
    } catch (e) {
      // if the style/tiles are unreachable, the panel still reads via the address card
      console.warn("map init skipped", e);
    }
    return () => {
      map?.remove();
    };
  }, []);

  const dir = `https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}`;

  return (
    <section className="section loc" id="location">
      <div className="shell">
        <Reveal className="head-row">
          <div>
            <span className="eyebrow">03 — The Start Line</span>
            <h2 style={{ marginTop: 14 }}>Find the<br /><span className="flame">pack.</span></h2>
          </div>
          <span className="idx hide-sm">[ -20.1996, 28.5956 ]</span>
        </Reveal>

        <Reveal className="loc-grid">
          <div className="loc-card">
            <span className="eyebrow gold">Meet-up</span>
            <div className="addr">
              7 Limerick Rd,<br />
              <span className="g">Hillside Walk,</span><br />
              Hillside · BYO
            </div>
            <div className="row"><span className="k">When</span> Saturdays · 07:30 sharp</div>
            <div className="row"><span className="k">Parking</span> Street bays along Limerick</div>
            <div className="row"><span className="k">Look for</span> The URC flag & the warm-up circle</div>
            <div style={{ marginTop: "auto", display: "flex", gap: 10, flexWrap: "wrap", paddingTop: 10 }}>
              <a className="btn btn--gold" href={dir} target="_blank" rel="noreferrer">
                Get directions <span className="ar">→</span>
              </a>
              <a className="btn btn--ghost" href="#ritual">See the schedule</a>
            </div>
          </div>

          <div className="map-wrap">
            <div className="map" ref={container} />
            <div className="sweep"><i /></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
