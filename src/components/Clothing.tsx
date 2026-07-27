// src/components/Clothing.tsx
import { Reveal } from "./ui";

const CLOTHING_IMAGES = [
  { src: "/images/ubuntuclothing_Shirt.jpeg", alt: "Ubuntu Clothing Shirt" },
  { src: "/images/ubuntuclothing_Shirt (2).jpeg", alt: "Ubuntu Clothing Shirt 2" },
  { src: "/images/ubuntuclothing_style(7).jpeg", alt: "Ubuntu Clothing Style 7" },
  { src: "/images/ubuntuclothing_style(6).jpeg", alt: "Ubuntu Clothing Style 6" },
  { src: "/images/ubuntuclothing_longsleevedknit.jpeg", alt: "Ubuntu Clothing Long Sleeve Knit" },
  { src: "/images/ubuntuclothing_style.jpeg", alt: "Ubuntu Clothing Style" },
  { src: "/images/ubuntuclothing_BlackKnit_longsleeved.jpeg", alt: "Ubuntu Clothing Black Knit Long Sleeve" },
  { src: "/images/ubuntuclothing_halfJersey.jpeg", alt: "Ubuntu Clothing Half Jersey" },
  { src: "/images/ubuntuclothing_style2.jpeg", alt: "Ubuntu Clothing Style 2" },
  { src: "/images/ubuntuclothing_styleJersey3.jpeg", alt: "Ubuntu Clothing Style Jersey 3" },
  { src: "/images/ubuntuclothing_style5.jpeg", alt: "Ubuntu Clothing Style 5" },
  { src: "/images/ubuntuclothing_style4.jpeg", alt: "Ubuntu Clothing Style 4" },
];

function Clothing() {
  return (
    <section className="section clothing" id="clothing">
      <div className="shell">
        <Reveal className="head-row">
          <div>
            <span className="eyebrow gold">— The Collection</span>
            <h2 style={{ marginTop: 10 }}>
              Dress in unity <span className="highlight-ubuntu">UBUNTU.</span>
            </h2>
          </div>
          <a
            className="btn btn--ghost hide-sm"
            href="https://www.instagram.com/_ubuntuclothing/"
            target="_blank"
            rel="noreferrer"
          >
            Follow on Instagram <span className="ar">→</span>
          </a>
        </Reveal>

        <div className="clothing-grid">
          {CLOTHING_IMAGES.map((image, index) => (
            <Reveal key={index} d={index % 3}>
              <div className="clothing-item">
                <img src={image.src} alt={image.alt} loading="lazy" />
              </div>
            </Reveal>
          ))}
        </div>

        <div className="clothing-cta">
          <a
            className="btn btn--gold"
            href="https://www.instagram.com/_ubuntuclothing/"
            target="_blank"
            rel="noreferrer"
          >
            Shop the collection on Instagram <span className="ar">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Clothing;