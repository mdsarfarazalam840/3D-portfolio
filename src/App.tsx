import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { GitHubCalendar } from "react-github-calendar";

const HeroScene = lazy(() => import("./components/hero-scene"));
const resumePdf = import.meta.env.VITE_RESUME_URL?.trim() || new URL("../SRE-Sarfaraz.pdf", import.meta.url).href;
const resumeFileName = "Md-Sarfaraz-Alam-Resume.pdf";
const profileImage = new URL("../IMG_5287.PNG", import.meta.url).href;
const githubUsername = "mdsarfarazalam840";
const spotifyWidgetUrl =
  "https://spotify-recently-played-readme.vercel.app/api?user=oj1xerhb9fby7dckdhp0yw3no&unique=true";
const spotifyProfileUrl = "https://open.spotify.com/user/oj1xerhb9fby7dckdhp0yw3no";

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

type GithubActivity = {
  repo: string;
  message: string;
  pushedAt: string;
  commitUrl: string;
  repoUrl: string;
};

type GeneratedLiveData = {
  generatedAt: string;
  github: {
    latestPush: GithubActivity | null;
    latestCommit: GithubActivity | null;
    profileUrl: string;
  };
  spotify: {
    widgetUrl: string;
    profileUrl: string;
  };
};

function formatRelativeTime(value: string) {
  const time = new Date(value).getTime();
  const diffMs = Date.now() - time;

  if (!Number.isFinite(time) || diffMs < 0) {
    return "just now";
  }

  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function App() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const cursorCoreRef = useRef<HTMLDivElement | null>(null);
  const cursorDotRef = useRef<HTMLDivElement | null>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [latestPush, setLatestPush] = useState<GithubActivity | null>(null);
  const [latestCommit, setLatestCommit] = useState<GithubActivity | null>(null);
  const [githubError, setGithubError] = useState(false);

  const calendarTheme = useMemo(
    () => ({
      dark: ["#161616", "#12311d", "#1a5a2f", "#2da44e", "#56d364"],
    }),
    [],
  );

  useEffect(() => {
    let cancelled = false;

    const loadGeneratedSnapshot = async () => {
      const response = await fetch("/generated/live-data.json", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to load generated live data");
      }

      return (await response.json()) as GeneratedLiveData;
    };

    const loadGithub = async () => {
      try {
        const repoResponse = await fetch(
          `https://api.github.com/users/${githubUsername}/repos?sort=pushed&per_page=6&type=owner`,
        );
        if (!repoResponse.ok) {
          throw new Error("Failed to load GitHub repos");
        }

        const repos = (await repoResponse.json()) as Array<{
          full_name: string;
          html_url: string;
          pushed_at: string;
          fork?: boolean;
        }>;

        const targetRepo = repos.find((repo) => !repo.fork) ?? repos[0];
        if (!targetRepo) {
          throw new Error("No repos found");
        }

        const commitsResponse = await fetch(`https://api.github.com/repos/${targetRepo.full_name}/commits?per_page=2`);
        if (!commitsResponse.ok) {
          throw new Error("Failed to load latest commit");
        }

        const commits = (await commitsResponse.json()) as Array<{
          sha: string;
          html_url: string;
          commit: { message: string; committer?: { date?: string } };
        }>;

        const pushCommit = commits[0];
        const historyCommit = commits[1] ?? commits[0];

        const pushData = {
          repo: targetRepo.full_name,
          message: pushCommit?.commit.message.split("\n")[0] ?? "Recent push",
          pushedAt: targetRepo.pushed_at,
          commitUrl: pushCommit?.html_url ?? targetRepo.html_url,
          repoUrl: targetRepo.html_url,
        };

        const commitData = {
          repo: targetRepo.full_name,
          message: historyCommit?.commit.message.split("\n")[0] ?? "Latest commit",
          pushedAt: historyCommit?.commit.committer?.date ?? targetRepo.pushed_at,
          commitUrl: historyCommit?.html_url ?? targetRepo.html_url,
          repoUrl: targetRepo.html_url,
        };

        if (!cancelled) {
          setLatestPush(pushData);
          setLatestCommit(commitData);
          setGithubError(false);
        }
      } catch {
        try {
          const snapshot = await loadGeneratedSnapshot();

          if (!cancelled) {
            setLatestPush(snapshot.github.latestPush);
            setLatestCommit(snapshot.github.latestCommit);
            setGithubError(false);
          }
        } catch {
          if (!cancelled) {
            setLatestPush(null);
            setLatestCommit(null);
            setGithubError(true);
          }
        }
      }
    };

    void loadGithub();

    const intervalId = window.setInterval(() => {
      void loadGithub();
    }, 60000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

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

  useEffect(() => {
    const body = document.body;
    const root = document.documentElement;
    const cursor = cursorRef.current;
    const cursorCore = cursorCoreRef.current;
    const dot = cursorDotRef.current;
    const canvas = particleCanvasRef.current;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    if (!cursor || !cursorCore || !dot || !canvas || !finePointer) {
      return;
    }

    body.classList.add("custom-cursor-enabled");

    const context = canvas.getContext("2d");
    if (!context) {
      return () => {
        body.classList.remove("custom-cursor-enabled");
      };
    }

    const ringSize = 34;
    const dotSize = 8;

    gsap.set([cursor, dot], { autoAlpha: 0, x: -999, y: -999 });

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPosition = { x: -999, y: -999 };
    const dotPosition = { x: -999, y: -999 };
    const motion = { vx: 0, vy: 0, speed: 0 };
    const ambientParticles = Array.from({ length: 72 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      size: Math.random() * 2.4 + 0.8,
      alpha: Math.random() * 0.4 + 0.18,
    }));
    const trailParticles: Array<{ x: number; y: number; vx: number; vy: number; life: number; size: number }> = [];
    const burstParticles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      size: number;
      hue: string;
    }> = [];
    let lastMoveX = pointer.x;
    let lastMoveY = pointer.y;
    let lastMoveTime = performance.now();
    let hoverActive = false;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const syncPointer = (clientX: number, clientY: number, now = performance.now()) => {
      const deltaTime = Math.max(now - lastMoveTime, 16);
      motion.vx = clientX - lastMoveX;
      motion.vy = clientY - lastMoveY;
      motion.speed = Math.min(Math.hypot(motion.vx, motion.vy) / deltaTime, 2.4);
      lastMoveX = clientX;
      lastMoveY = clientY;
      lastMoveTime = now;
      pointer.x = clientX;
      pointer.y = clientY;

      root.style.setProperty("--pointer-x", `${clientX}px`);
      root.style.setProperty("--pointer-y", `${clientY}px`);
      root.style.setProperty("--pointer-speed", `${motion.speed.toFixed(3)}`);

      gsap.set([cursor, dot], { autoAlpha: 1 });
    };

    const onMove = (event: MouseEvent) => {
      syncPointer(event.clientX, event.clientY);

      trailParticles.push({
        x: event.clientX,
        y: event.clientY,
        vx: motion.vx * 0.08 + (Math.random() - 0.5) * 1.8,
        vy: motion.vy * 0.08 + (Math.random() - 0.5) * 1.8,
        life: 1,
        size: Math.random() * 4 + 1.4 + motion.speed * 3.2,
      });

      if (trailParticles.length > 48) {
        trailParticles.shift();
      }
    };

    const interactiveNodes = Array.from(document.querySelectorAll("a, button, .project-row, .live-card"));
    const animateCursor = (scale: number, borderColor: string, boxShadow: string, duration: number) =>
      gsap.to(cursorCore, {
        scale,
        borderColor,
        boxShadow,
        duration,
        overwrite: true,
      });

    const onEnter = () => {
      hoverActive = true;
      animateCursor(
        1.42,
        "rgba(0,212,255,0.72)",
        "0 0 28px rgba(0, 212, 255, 0.2), inset 0 0 14px rgba(139, 92, 246, 0.12)",
        0.18,
      );
      gsap.to(dot, { scale: 1.25, duration: 0.18, overwrite: true });
    };
    const onLeave = () => {
      hoverActive = false;
      animateCursor(
        1,
        "rgba(255,255,255,0.16)",
        "0 0 14px rgba(0, 212, 255, 0.1), inset 0 0 10px rgba(139, 92, 246, 0.08)",
        0.18,
      );
      gsap.to(dot, { scale: 1, duration: 0.18, overwrite: true });
    };
    const hideCursor = () => gsap.to([cursor, dot], { autoAlpha: 0, duration: 0.16, overwrite: true });
    const onDown = (event: MouseEvent) => {
      syncPointer(event.clientX, event.clientY);

      for (let index = 0; index < 16; index += 1) {
        const angle = (Math.PI * 2 * index) / 16;
        const burstSpeed = 1.8 + Math.random() * 2.8;
        burstParticles.push({
          x: event.clientX,
          y: event.clientY,
          vx: Math.cos(angle) * burstSpeed,
          vy: Math.sin(angle) * burstSpeed,
          life: 1,
          size: Math.random() * 3.2 + 1.2,
          hue: index % 2 === 0 ? "rgba(0, 212, 255," : "rgba(139, 92, 246,",
        });
      }

      gsap.fromTo(cursorCore, { scale: hoverActive ? 1.46 : 1.18 }, {
        scale: hoverActive ? 1.42 : 1,
        duration: 0.26,
        ease: "power3.out",
        overwrite: true,
      });
      gsap.fromTo(dot, { scale: 2.2 }, { scale: hoverActive ? 1.25 : 1, duration: 0.22, overwrite: true });
    };
    const onUp = (event: MouseEvent) => {
      syncPointer(event.clientX, event.clientY);
    };
    interactiveNodes.forEach((node) => {
      node.addEventListener("mouseenter", onEnter);
      node.addEventListener("mouseleave", onLeave);
    });

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", hideCursor);

    let frameId = 0;
    const render = () => {
      ringPosition.x += (pointer.x - ringSize / 2 - ringPosition.x) * 0.16;
      ringPosition.y += (pointer.y - ringSize / 2 - ringPosition.y) * 0.16;
      dotPosition.x += (pointer.x - dotSize / 2 - dotPosition.x) * 0.34;
      dotPosition.y += (pointer.y - dotSize / 2 - dotPosition.y) * 0.34;

      gsap.set(cursor, { x: ringPosition.x, y: ringPosition.y });
      gsap.set(dot, { x: dotPosition.x, y: dotPosition.y });

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.globalCompositeOperation = "lighter";

      ambientParticles.forEach((particle) => {
        const dx = pointer.x - particle.x;
        const dy = pointer.y - particle.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 220) {
          const force = ((220 - distance) / 220) * (0.8 + motion.speed * 1.6);
          particle.x -= (dx / distance) * force * 2.1 || 0;
          particle.y -= (dy / distance) * force * 2.1 || 0;
        }

        particle.vx += motion.vx * 0.0008;
        particle.vy += motion.vy * 0.0008;
        particle.vx *= 0.992;
        particle.vy *= 0.992;
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        context.beginPath();
        context.fillStyle = `rgba(0, 212, 255, ${particle.alpha + motion.speed * 0.05})`;
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      });

      if (trailParticles.length > 1) {
        context.beginPath();
        context.lineCap = "round";
        context.lineJoin = "round";
        context.lineWidth = 10 + motion.speed * 8;

        trailParticles.forEach((particle, index) => {
          if (index === 0) {
            context.moveTo(particle.x, particle.y);
          } else {
            const previous = trailParticles[index - 1];
            const midpointX = (previous.x + particle.x) / 2;
            const midpointY = (previous.y + particle.y) / 2;
            context.quadraticCurveTo(previous.x, previous.y, midpointX, midpointY);
          }
        });

        context.strokeStyle = `rgba(99, 102, 241, ${0.08 + motion.speed * 0.08})`;
        context.stroke();
      }

      for (let index = trailParticles.length - 1; index >= 0; index -= 1) {
        const particle = trailParticles[index];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.97;
        particle.vy *= 0.97;
        particle.life -= 0.032;

        if (particle.life <= 0) {
          trailParticles.splice(index, 1);
          continue;
        }

        context.beginPath();
        context.fillStyle = `rgba(139, 92, 246, ${particle.life * 0.26})`;
        context.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
        context.fill();
      }

      for (let index = burstParticles.length - 1; index >= 0; index -= 1) {
        const particle = burstParticles[index];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.95;
        particle.vy *= 0.95;
        particle.life -= 0.045;

        if (particle.life <= 0) {
          burstParticles.splice(index, 1);
          continue;
        }

        context.beginPath();
        context.fillStyle = `${particle.hue} ${particle.life * 0.5})`;
        context.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
        context.fill();
      }

      context.globalCompositeOperation = "source-over";

      frameId = window.requestAnimationFrame(render);
    };

    frameId = window.requestAnimationFrame(render);

    return () => {
      body.classList.remove("custom-cursor-enabled");
      root.style.removeProperty("--pointer-x");
      root.style.removeProperty("--pointer-y");
      root.style.removeProperty("--pointer-speed");
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", hideCursor);
      window.cancelAnimationFrame(frameId);
      interactiveNodes.forEach((node) => {
        node.removeEventListener("mouseenter", onEnter);
        node.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <div className="portfolio-shell" ref={rootRef}>
      <canvas className="particle-canvas" ref={particleCanvasRef} />
      <div className="liquid-field" aria-hidden="true" />
      <div className="cursor-ring" ref={cursorRef}>
        <div className="cursor-ring__core" ref={cursorCoreRef} />
      </div>
      <div className="cursor-dot" ref={cursorDotRef} />
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

        <a className="resume-link" download={resumeFileName} href={resumePdf}>
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

        <section className="scene-section live-scene">
          <div className="section-wash" aria-hidden="true" />
          <div className="scene-heading" data-animate>
            <p className="scene-label">Live</p>
            <h2>Live signal.</h2>
          </div>

          <div className="live-grid">
            <article className="live-card live-card--github" data-animate>
              <div className="live-card__head">
                <span>Parth's Github</span>
                <a href={`https://github.com/${githubUsername}`}>Open profile</a>
              </div>

              <div className="github-stack">
                {latestPush ? (
                  <a className="github-block" href={latestPush.commitUrl}>
                    <div className="github-block__meta">
                      <span>Latest push</span>
                      <small>{formatRelativeTime(latestPush.pushedAt)}</small>
                    </div>
                    <strong>"{latestPush.message}"</strong>
                    <p>Repo: {latestPush.repo}</p>
                  </a>
                ) : (
                  <div className="live-empty">{githubError ? "GitHub API blocked or rate limited." : "Push data loading..."}</div>
                )}

                {latestCommit ? (
                  <a className="github-block" href={latestCommit.commitUrl}>
                    <div className="github-block__meta">
                      <span>Latest commit</span>
                      <small>{formatRelativeTime(latestCommit.pushedAt)}</small>
                    </div>
                    <strong>"{latestCommit.message}"</strong>
                    <p>Repo: {latestCommit.repo}</p>
                  </a>
                ) : (
                  <div className="live-empty">{githubError ? "Commit data unavailable." : "Commit data loading..."}</div>
                )}
              </div>
            </article>

            <article className="live-card live-card--cta" data-animate>
              <div className="live-card__head">
                <span>Visitors</span>
              </div>
              <div className="signature-card">
                <h3>
                  Leave your <em>signal</em>
                </h3>
                <p>Open for SRE, Azure reliability, and platform work.</p>
                <a className="signature-link" href="mailto:md.sarfarazalam840@gmail.com">
                  Contact me
                </a>
              </div>
            </article>

            <article className="live-card live-card--spotify" data-animate>
              <div className="live-card__head">
                <span>Last played</span>
                <a href={spotifyProfileUrl}>Open Spotify</a>
              </div>
              <a className="spotify-widget spotify-widget--futuristic" href={spotifyProfileUrl}>
                <span className="spotify-widget__glow" aria-hidden="true" />
                <span className="spotify-widget__grid" aria-hidden="true" />
                <span className="spotify-widget__orbit" aria-hidden="true" />
                <div className="spotify-widget__chrome">
                  <span className="spotify-pill">Live audio signal</span>
                </div>
                <img alt="Spotify recently played widget" src={spotifyWidgetUrl} />
              </a>
            </article>
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
                <div className="project-row__main">
                  <h3>{project.title}</h3>
                  <p>{project.impact}</p>
                </div>
                <div className="project-row__side">
                  <span>{project.stack}</span>
                  <strong>Open repo</strong>
                </div>
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
                <a download={item.label === "Resume" ? resumeFileName : undefined} href={item.href} key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="scene-section github-graph-scene">
          <div className="section-wash" aria-hidden="true" />
          <div className="scene-heading" data-animate>
            <p className="scene-label">GitHub graph</p>
            <h2>Contribution graph sits at bottom now.</h2>
          </div>

          <div className="calendar-shell calendar-shell--bottom" data-animate>
            <GitHubCalendar
              blockMargin={4}
              blockRadius={3}
              blockSize={12}
              colorScheme="dark"
              fontSize={12}
              theme={calendarTheme}
              username={githubUsername}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
