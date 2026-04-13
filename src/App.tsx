import { Suspense, lazy, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const HeroScene = lazy(() => import("./components/hero-scene"));
const resumePdf = new URL("../SRE-Sarfaraz.pdf", import.meta.url).href;
const profileImage = new URL("../IMG_5287.PNG", import.meta.url).href;

gsap.registerPlugin(ScrollTrigger);

const heroLines = [
  "Cloud reliability",
  "with real operations depth",
  "and platform calm under pressure.",
];

const signalPoints = [
  {
    value: "40%",
    label: "MTTR reduction",
    detail: "P1 and P2 recovery improved through RCA, alert tuning, and platform fixes.",
  },
  {
    value: "20%",
    label: "Cloud cost down",
    detail: "Rightsizing, autoscaling, and environment-aware database scaling in Azure.",
  },
  {
    value: "10+",
    label: "Apps supported",
    detail: "Enterprise production services across AKS, App Services, CI/CD, and observability layers.",
  },
];

const experienceStories = [
  {
    period: "Now",
    title: "Senior Software Engineer at Accenture, supporting Shell",
    copy:
      "Own reliability work across enterprise Azure estates. I reduce MTTR, harden AKS workloads, improve Dynatrace visibility, and build CI/CD rails that remove manual risk from releases.",
  },
  {
    period: "Earlier",
    title: "Associate Software Engineer at Accenture",
    copy:
      "Built foundations in incident response, ITIL operations, Azure monitoring, and production issue resolution. This is where the operating discipline started.",
  },
];

const featuredProjects = [
  {
    title: "Acquisitions API",
    impact: "Secure backend with JWT auth, Neon PostgreSQL, Drizzle ORM, and role-based access control.",
    stack: "Express.js / PostgreSQL / Drizzle / JWT / Arcjet",
    href: "https://github.com/mdsarfarazalam840/acquisitions",
  },
  {
    title: "Space Drive",
    impact: "Telegram-powered file dashboard with premium frontend motion and streaming-first interaction design.",
    stack: "Next.js / Tailwind / Framer Motion / Telegram Cloud",
    href: "https://github.com/mdsarfarazalam840/own-drive",
  },
  {
    title: "Telegram to Google Drive Bot",
    impact: "High-throughput automation for streaming Telegram files into Google Drive with resumable uploads.",
    stack: "Python / Pyrogram / Google Drive API / Docker",
    href: "https://github.com/mdsarfarazalam840/New-Tg-Gd-Bot",
  },
  {
    title: "Trading Migration System",
    impact: "Enterprise migration platform for workflow movement between ETRM systems with audit visibility.",
    stack: ".NET Core / React / MongoDB / Swagger",
    href: "https://github.com/mdsarfarazalam840/Trading-Project-ETRM",
  },
];

const capabilityGroups = [
  "Azure",
  "AKS",
  "Dynatrace",
  "CI/CD",
  "GitHub Actions",
  "Azure DevOps",
  "Incident Response",
  "Observability",
  "Platform Reliability",
  "React",
  "Python",
  "Docker",
  "KQL",
  "Azure Data Factory",
];

const contactLinks = [
  { label: "GitHub", value: "github.com/mdsarfarazalam840", href: "https://github.com/mdsarfarazalam840" },
  { label: "Email", value: "md.sarfarazalam840@gmail.com", href: "mailto:md.sarfarazalam840@gmail.com" },
  { label: "Phone", value: "+91 7717795540", href: "tel:+917717795540" },
  { label: "Resume", value: "Download PDF", href: resumePdf },
];

function App() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      syncTouch: false,
    });

    let frameId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(raf);
    };
    frameId = window.requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      gsap.set(".reveal-line__inner", { yPercent: 110 });
      gsap.set(".hero-fade", { opacity: 0, y: 28 });

      const heroTimeline = gsap.timeline({ defaults: { ease: "power4.out" } });
      heroTimeline
        .to(".reveal-line__inner", {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.1,
        })
        .to(
          ".hero-fade",
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.08,
          },
          "-=0.7",
        );

      gsap.to(".portrait-frame", {
        y: -18,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".portrait-ring", {
        rotate: 360,
        duration: 12,
        repeat: -1,
        ease: "none",
      });

      gsap.utils.toArray<HTMLElement>(".scene-section").forEach((section) => {
        const targets = section.querySelectorAll<HTMLElement>("[data-animate]");

        gsap.fromTo(
          targets,
          { opacity: 0, y: 42 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
            },
          },
        );

        gsap.fromTo(
          section,
          { opacity: 0.5 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "top 25%",
              scrub: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".section-wash").forEach((wash) => {
        gsap.fromTo(
          wash,
          { yPercent: 14, opacity: 0.2 },
          {
            yPercent: -10,
            opacity: 0.55,
            ease: "none",
            scrollTrigger: {
              trigger: wash.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    }, rootRef);

    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      window.cancelAnimationFrame(frameId);
      lenis.destroy();
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="portfolio-shell" ref={rootRef}>
      <div className="noise-layer" aria-hidden="true" />
      <div className="ambient-blob ambient-blob--one" aria-hidden="true" />
      <div className="ambient-blob ambient-blob--two" aria-hidden="true" />

      <header className="site-header">
        <a className="site-mark" href="#top">
          <span>MS</span>
          <div>
            <strong>Md Sarfaraz Alam</strong>
            <small>Site Reliability Engineer</small>
          </div>
        </a>

        <nav className="site-nav" aria-label="Primary">
          <a href="#story">Story</a>
          <a href="#work">Work</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#contact">Contact</a>
        </nav>

        <a className="resume-link" href={resumePdf}>
          Resume
        </a>
      </header>

      <main className="portfolio-main" id="top">
        <section className="scene-section hero-scene" id="story">
          <div className="section-wash" aria-hidden="true" />

          <div className="hero-copy">
            <p className="hero-kicker hero-fade">Azure / AKS / observability / CI-CD / incident response</p>

            <h1 className="hero-title" aria-label={heroLines.join(" ")}>
              {heroLines.map((line) => (
                <span className="reveal-line" key={line}>
                  <span className="reveal-line__inner">{line}</span>
                </span>
              ))}
            </h1>

            <p className="hero-summary hero-fade">
              I build calmer systems. Over the last 4+ years I have reduced MTTR, tuned cloud cost, improved AKS
              reliability, and supported enterprise production workloads where failure has real operational weight.
            </p>

            <div className="hero-actions hero-fade">
              <a className="text-button text-button--solid" href="#work">
                View selected work
              </a>
              <a className="text-button" href="https://github.com/mdsarfarazalam840">
                GitHub
              </a>
            </div>
          </div>

          <div className="hero-visual hero-fade">
            <div className="hero-stage">
              <div className="hero-canvas" aria-hidden="true">
                <Suspense fallback={<div className="hero-canvas__fallback" />}>
                  <HeroScene />
                </Suspense>
              </div>

              <div className="portrait-frame">
                <div className="portrait-ring" />
                <div className="portrait-core">
                  <img alt="Portrait of Md Sarfaraz Alam" className="portrait-image" src={profileImage} />
                </div>
              </div>

              <div className="live-note">
                <span>Now</span>
                <p>Improving Azure reliability, reducing incident noise, and building release confidence.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="scene-section impact-scene">
          <div className="section-wash" aria-hidden="true" />
          <p className="scene-label" data-animate>
            Impact
          </p>
          <div className="impact-grid">
            {signalPoints.map((point) => (
              <article className="impact-item" data-animate key={point.label}>
                <span className="impact-value">{point.value}</span>
                <div>
                  <h2>{point.label}</h2>
                  <p>{point.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="scene-section narrative-scene" id="work">
          <div className="section-wash" aria-hidden="true" />
          <div className="scene-heading" data-animate>
            <p className="scene-label">Experience</p>
            <h2>Production work, told as operating narrative not resume dump.</h2>
          </div>

          <div className="story-list">
            {experienceStories.map((story) => (
              <article className="story-item" data-animate key={story.title}>
                <span>{story.period}</span>
                <div>
                  <h3>{story.title}</h3>
                  <p>{story.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="scene-section projects-scene">
          <div className="section-wash" aria-hidden="true" />
          <div className="scene-heading" data-animate>
            <p className="scene-label">Projects</p>
            <h2>Few projects. Real impact. No clutter.</h2>
          </div>

          <div className="project-list">
            {featuredProjects.map((project) => (
              <a className="project-row" data-animate href={project.href} key={project.title}>
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.impact}</p>
                </div>
                <span>{project.stack}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="scene-section capabilities-scene" id="capabilities">
          <div className="section-wash" aria-hidden="true" />
          <div className="scene-heading" data-animate>
            <p className="scene-label">Capabilities</p>
            <h2>Stack shown with restraint.</h2>
          </div>

          <div className="capability-cloud" data-animate>
            {capabilityGroups.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>

        <section className="scene-section contact-scene" id="contact">
          <div className="section-wash" aria-hidden="true" />
          <div className="contact-layout">
            <div className="contact-copy" data-animate>
              <p className="scene-label">Contact</p>
              <h2>Open for reliability-first engineering, platform support, and cloud operations work.</h2>
              <p>
                Best fit for teams that care about release discipline, observability quality, AKS operations, incident
                response, and measurable production improvement.
              </p>
            </div>

            <div className="contact-links" data-animate>
              {contactLinks.map((item) => (
                <a href={item.href} key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
