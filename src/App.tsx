import { Suspense, lazy, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import Lenis from "lenis";
import { GitHubCalendar } from "react-github-calendar";
import { NeuralBackground } from "@/components/ui/neural-background";
import SimpleMarquee from "@/components/ui/simple-marquee";

const HeroScene = lazy(() => import("./components/hero-scene"));
const resumePdf = import.meta.env.VITE_RESUME_URL?.trim() || new URL("../SRE-Sarfaraz.pdf", import.meta.url).href;
const resumeFileName = "Md-Sarfaraz-Alam-Resume.pdf";
const profileImage = new URL("../IMG_5287.PNG", import.meta.url).href;
const githubUsername = "mdsarfarazalam840";
const spotifyWidgetUrl =
  "https://spotify-recently-played-readme.vercel.app/api?user=oj1xerhb9fby7dckdhp0yw3no&unique=true";
const spotifyProfileUrl = "https://open.spotify.com/user/oj1xerhb9fby7dckdhp0yw3no";

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

type PaletteItem = {
  id: string;
  group: "Pages" | "Projects" | "Actions" | "Links";
  title: string;
  description: string;
  keywords: string[];
  action: () => void;
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
  const lenisRef = useRef<Lenis | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const cursorCoreRef = useRef<HTMLDivElement | null>(null);
  const cursorDotRef = useRef<HTMLDivElement | null>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const commandInputRef = useRef<HTMLInputElement | null>(null);
  const commandResultsRef = useRef<HTMLDivElement | null>(null);
  const [latestPush, setLatestPush] = useState<GithubActivity | null>(null);
  const [latestCommit, setLatestCommit] = useState<GithubActivity | null>(null);
  const [githubError, setGithubError] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [activeCommandIndex, setActiveCommandIndex] = useState(0);
  const deferredCommandQuery = useDeferredValue(commandQuery);

  const calendarTheme = useMemo(
    () => ({
      dark: ["#111318", "#11252f", "#124251", "#166981", "#6ae7ff"],
    }),
    [],
  );

  const openHref = (href: string) => {
    window.open(href, "_self", "noopener,noreferrer");
  };

  const downloadResume = () => {
    const link = document.createElement("a");
    link.href = resumePdf;
    link.download = resumeFileName;
    link.click();
  };

  const scrollToSelector = (selector: string) => {
    const target = document.querySelector<HTMLElement>(selector);
    if (!target || !lenisRef.current) {
      return;
    }

    lenisRef.current.scrollTo(target, {
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      offset: -80,
    });
  };

  const paletteItems = useMemo<PaletteItem[]>(
    () => [
      {
        id: "page-story",
        group: "Pages",
        title: "Story",
        description: "Jump to hero and operating summary.",
        keywords: ["story", "hero", "intro", "about"],
        action: () => scrollToSelector("#story"),
      },
      {
        id: "page-live",
        group: "Pages",
        title: "Live signal",
        description: "Jump to live GitHub, contact, and Spotify feed.",
        keywords: ["live", "signal", "github", "spotify"],
        action: () => scrollToSelector(".live-scene"),
      },
      {
        id: "page-work",
        group: "Pages",
        title: "Work",
        description: "Jump to experience and selected projects.",
        keywords: ["work", "experience", "projects"],
        action: () => scrollToSelector("#work"),
      },
      {
        id: "page-capabilities",
        group: "Pages",
        title: "Capabilities",
        description: "Jump to stack cloud and platform strengths.",
        keywords: ["skills", "capabilities", "stack", "azure", "aks"],
        action: () => scrollToSelector("#capabilities"),
      },
      {
        id: "page-contact",
        group: "Pages",
        title: "Contact",
        description: "Jump to direct contact links and resume access.",
        keywords: ["contact", "email", "phone", "resume"],
        action: () => scrollToSelector("#contact"),
      },
      ...featuredProjects.map<PaletteItem>((project) => ({
        id: `project-${project.title}`,
        group: "Projects",
        title: project.title,
        description: project.impact,
        keywords: [project.title, project.stack, project.impact],
        action: () => openHref(project.href),
      })),
      {
        id: "action-resume",
        group: "Actions",
        title: "Download resume",
        description: "Open PDF resume download instantly.",
        keywords: ["resume", "cv", "download", "pdf"],
        action: downloadResume,
      },
      {
        id: "action-email",
        group: "Actions",
        title: "Send email",
        description: "Start direct conversation for SRE and platform work.",
        keywords: ["email", "mail", "contact", "hire"],
        action: () => openHref("mailto:md.sarfarazalam840@gmail.com"),
      },
      {
        id: "action-phone",
        group: "Actions",
        title: "Call now",
        description: "Open direct phone link.",
        keywords: ["phone", "call", "mobile"],
        action: () => openHref("tel:+917717795540"),
      },
      {
        id: "link-github",
        group: "Links",
        title: "GitHub profile",
        description: "Open full GitHub profile.",
        keywords: ["github", "profile", "repos"],
        action: () => openHref(`https://github.com/${githubUsername}`),
      },
      {
        id: "link-spotify",
        group: "Links",
        title: "Spotify profile",
        description: "Open live listening profile.",
        keywords: ["spotify", "music", "audio"],
        action: () => openHref(spotifyProfileUrl),
      },
    ],
    [],
  );

  const commandGroups = useMemo(() => {
    const normalizedQuery = deferredCommandQuery.trim().toLowerCase();
    const matchingItems = !normalizedQuery
      ? paletteItems
      : paletteItems.filter((item) => {
          const haystack = `${item.title} ${item.description} ${item.keywords.join(" ")}`.toLowerCase();
          return haystack.includes(normalizedQuery);
        });

    return ["Pages", "Projects", "Actions", "Links"]
      .map((group) => ({
        group: group as PaletteItem["group"],
        items: matchingItems.filter((item) => item.group === group),
      }))
      .filter((group) => group.items.length > 0);
  }, [deferredCommandQuery, paletteItems]);

  const flatCommandItems = useMemo(() => commandGroups.flatMap((group) => group.items), [commandGroups]);

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
    if (!commandOpen) {
      return;
    }

    commandInputRef.current?.focus();
  }, [commandOpen]);

  useEffect(() => {
    const results = commandResultsRef.current;

    if (!results || !commandOpen) {
      return;
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      results.scrollTop += event.deltaY;
    };

    results.addEventListener("wheel", onWheel, { passive: false });
    return () => results.removeEventListener("wheel", onWheel);
  }, [commandOpen]);

  useEffect(() => {
    const { body } = document;

    if (commandOpen) {
      lenisRef.current?.stop();
      body.style.overflow = "hidden";
      return () => {
        body.style.overflow = "";
        lenisRef.current?.start();
      };
    }

    body.style.overflow = "";
    lenisRef.current?.start();

    return () => {
      body.style.overflow = "";
    };
  }, [commandOpen]);

  useEffect(() => {
    if (flatCommandItems.length === 0) {
      setActiveCommandIndex(0);
      return;
    }

    setActiveCommandIndex((current) => Math.min(current, flatCommandItems.length - 1));
  }, [flatCommandItems]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const commandShortcut = (event.ctrlKey || event.metaKey || event.shiftKey) && event.key.toLowerCase() === "k";

      if (commandShortcut) {
        event.preventDefault();
        setCommandOpen(true);
        return;
      }

      if (!commandOpen) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setCommandOpen(false);
        setCommandQuery("");
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveCommandIndex((current) => {
          if (flatCommandItems.length === 0) {
            return 0;
          }

          return (current + 1) % flatCommandItems.length;
        });
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveCommandIndex((current) => {
          if (flatCommandItems.length === 0) {
            return 0;
          }

          return (current - 1 + flatCommandItems.length) % flatCommandItems.length;
        });
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        const action = flatCommandItems[activeCommandIndex]?.action;
        setCommandOpen(false);
        setCommandQuery("");
        requestAnimationFrame(() => {
          action?.();
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeCommandIndex, commandOpen, flatCommandItems]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      syncTouch: false,
    });
    lenisRef.current = lenis;

    let frameId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(raf);
    };
    frameId = window.requestAnimationFrame(raf);

    return () => {
      lenisRef.current = null;
      window.cancelAnimationFrame(frameId);
      lenis.destroy();
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

    const ringSize = 44;
    const dotSize = 10;

    gsap.set([cursor, dot], { autoAlpha: 0, x: -999, y: -999 });

    let cursorX = -999;
    let cursorY = -999;
    let dotX = -999;
    let dotY = -999;
    const motion = { vx: 0, vy: 0, speed: 0 };
    const ambientParticles = Array.from({ length: 48 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.2 + 0.08,
    }));
    const trailParticles: Array<{ x: number; y: number; vx: number; vy: number; life: number; size: number }> = [];

    const trailPoints = Array.from({ length: 18 }, () => ({ x: 0, y: 0 }));

    let lastMoveX = 0;
    let lastMoveY = 0;
    let lastMoveTime = performance.now();
    let hoverActive = false;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const onMove = (event: MouseEvent) => {
      const now = performance.now();
      const deltaTime = Math.max(now - lastMoveTime, 16);
      motion.vx = event.clientX - lastMoveX;
      motion.vy = event.clientY - lastMoveY;
      motion.speed = Math.min(Math.hypot(motion.vx, motion.vy) / deltaTime, 1.5);
      lastMoveX = event.clientX;
      lastMoveY = event.clientY;
      lastMoveTime = now;

      cursorX = event.clientX - ringSize / 2;
      cursorY = event.clientY - ringSize / 2;
      dotX = event.clientX - dotSize / 2;
      dotY = event.clientY - dotSize / 2;

      root.style.setProperty("--pointer-x", `${event.clientX}px`);
      root.style.setProperty("--pointer-y", `${event.clientY}px`);
      root.style.setProperty("--pointer-speed", `${motion.speed.toFixed(3)}`);

      gsap.set([cursor, dot], { autoAlpha: 1 });

      for (let i = trailPoints.length - 1; i > 0; i--) {
        trailPoints[i].x = trailPoints[i - 1].x;
        trailPoints[i].y = trailPoints[i - 1].y;
      }
      trailPoints[0].x = event.clientX;
      trailPoints[0].y = event.clientY;

      if (motion.speed > 0.3) {
        trailParticles.push({
          x: event.clientX,
          y: event.clientY,
          vx: motion.vx * 0.05 + (Math.random() - 0.5) * 0.8,
          vy: motion.vy * 0.05 + (Math.random() - 0.5) * 0.8,
          life: 1,
          size: Math.random() * 2.5 + 0.8 + motion.speed * 1.5,
        });

        if (trailParticles.length > 32) {
          trailParticles.shift();
        }
      }
    };

    const interactiveSelector = "a, button, input, .project-marquee-card, .live-card, .command-item";
    const onEnter = () => {
      hoverActive = true;
      gsap.to(cursorCore, { scale: 1.2, duration: 0.18, overwrite: true });
      gsap.to(dot, { scale: 1.15, duration: 0.18, overwrite: true });
    };
    const onLeave = () => {
      hoverActive = false;
      gsap.to(cursorCore, { scale: 1, duration: 0.18, overwrite: true });
      gsap.to(dot, { scale: 1, duration: 0.18, overwrite: true });
    };
    const hideCursor = () => gsap.to([cursor, dot], { autoAlpha: 0, duration: 0.16, overwrite: true });
    const onDown = () => {
      gsap.to(cursorCore, { scale: hoverActive ? 1.3 : 1.1, duration: 0.22, ease: "power3.out", overwrite: true });
      gsap.to(dot, { scale: 1.6, duration: 0.18, overwrite: true });
    };
    const onUp = () => {
      gsap.to(cursorCore, { scale: hoverActive ? 1.2 : 1, duration: 0.18, ease: "power3.out", overwrite: true });
      gsap.to(dot, { scale: hoverActive ? 1.15 : 1, duration: 0.18, overwrite: true });
    };
    const onPointerOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest(interactiveSelector)) {
        onEnter();
      }
    };
    const onPointerOut = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const relatedTarget = event.relatedTarget as HTMLElement | null;
      const leftInteractive = target?.closest(interactiveSelector);
      const nextInteractive = relatedTarget?.closest(interactiveSelector);

      if (leftInteractive && !nextInteractive) {
        onLeave();
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onPointerOver);
    document.addEventListener("mouseout", onPointerOut);
    document.addEventListener("mouseleave", hideCursor);

    let frameId = 0;
    const render = () => {
      gsap.set(cursor, { x: cursorX, y: cursorY });
      gsap.set(dot, { x: dotX, y: dotY });

      context.clearRect(0, 0, canvas.width, canvas.height);

      ambientParticles.forEach((particle) => {
        const dx = (cursorX + ringSize / 2) - particle.x;
        const dy = (cursorY + ringSize / 2) - particle.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 180) {
          const force = ((180 - distance) / 180) * (0.4 + motion.speed * 0.8);
          particle.x -= (dx / distance) * force * 1.5 || 0;
          particle.y -= (dy / distance) * force * 1.5 || 0;
        }

        particle.vx *= 0.992;
        particle.vy *= 0.992;
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        context.beginPath();
        context.fillStyle = `rgba(255, 255, 255, ${particle.alpha + motion.speed * 0.03})`;
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      });

      for (let index = trailParticles.length - 1; index >= 0; index -= 1) {
        const particle = trailParticles[index];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.97;
        particle.vy *= 0.97;
        particle.life -= 0.028;

        if (particle.life <= 0) {
          trailParticles.splice(index, 1);
          continue;
        }

        context.beginPath();
        context.fillStyle = `rgba(255, 255, 255, ${particle.life * 0.15})`;
        context.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
        context.fill();
      }

      if (trailPoints.length > 2 && motion.speed > 0.05) {
        context.beginPath();
        context.moveTo(trailPoints[0].x, trailPoints[0].y);

        for (let i = 1; i < trailPoints.length - 1; i++) {
          const p0 = trailPoints[i - 1];
          const p1 = trailPoints[i];
          const p2 = trailPoints[i + 1];

          const midX0 = (p0.x + p1.x) / 2;
          const midY0 = (p0.y + p1.y) / 2;
          const midX1 = (p1.x + p2.x) / 2;
          const midY1 = (p1.y + p2.y) / 2;

          context.quadraticCurveTo(midX0, midY0, midX1, midY1);
        }

        const lastPoint = trailPoints[trailPoints.length - 1];
        context.lineTo(lastPoint.x, lastPoint.y);

        const speedAlpha = Math.min(motion.speed * 0.6, 0.35);
        context.strokeStyle = `rgba(0, 212, 255, ${speedAlpha})`;
        context.lineWidth = 2.5;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();

        context.lineWidth = 1.2;
        context.strokeStyle = `rgba(160, 240, 255, ${speedAlpha * 0.6})`;
        context.stroke();
      }

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
      document.removeEventListener("mouseover", onPointerOver);
      document.removeEventListener("mouseout", onPointerOut);
      document.removeEventListener("mouseleave", hideCursor);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="portfolio-shell" ref={rootRef}>
      <NeuralBackground className="neural-bg" />
      <canvas className="particle-canvas" ref={particleCanvasRef} />
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
          <button onClick={() => scrollToSelector("#story")}>Story</button>
          <button onClick={() => scrollToSelector("#work")}>Work</button>
          <button onClick={() => scrollToSelector("#capabilities")}>Capabilities</button>
          <button onClick={() => scrollToSelector("#contact")}>Contact</button>
        </nav>

        <div className="header-actions">
          <button
            aria-controls="command-palette"
            aria-expanded={commandOpen}
            aria-label="Open command palette"
            className="command-trigger"
            onClick={() => setCommandOpen(true)}
            type="button"
          >
            <span className="command-trigger__icon" aria-hidden="true">
              /
            </span>
            <span className="command-trigger__hint">Shift K</span>
          </button>

          <a className="resume-link" download={resumeFileName} href={resumePdf}>
            Resume
          </a>
        </div>
      </header>

      <div
        aria-hidden={!commandOpen}
        className={`command-overlay${commandOpen ? " command-overlay--open" : ""}`}
        onClick={() => {
          setCommandOpen(false);
          setCommandQuery("");
        }}
      >
        <section
          aria-label="Command palette"
          className="command-palette"
          id="command-palette"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="command-palette__halo" aria-hidden="true" />
          <div className="command-palette__input-shell">
            <span className="command-palette__search-icon" aria-hidden="true">
              Search
            </span>
            <input
              onChange={(event) => {
                setCommandQuery(event.target.value);
                setActiveCommandIndex(0);
              }}
              placeholder="Type command or search signal..."
              ref={commandInputRef}
              type="text"
              value={commandQuery}
            />
            <span className="command-palette__esc">ESC</span>
          </div>

          <div className="command-results" ref={commandResultsRef} role="listbox">
            {commandGroups.length > 0 ? (
              commandGroups.map((group) => (
                <div className="command-group" key={group.group}>
                  <div className="command-group__label">{group.group}</div>
                  <div className="command-group__items">
                    {group.items.map((item) => {
                      const itemIndex = flatCommandItems.findIndex((entry) => entry.id === item.id);

                      return (
                        <button
                          className={`command-item${itemIndex === activeCommandIndex ? " command-item--active" : ""}`}
                          key={item.id}
                          onClick={() => {
                            const action = item.action;
                            setCommandOpen(false);
                            setCommandQuery("");
                            requestAnimationFrame(() => {
                              action();
                            });
                          }}
                          onMouseEnter={() => setActiveCommandIndex(itemIndex)}
                          type="button"
                        >
                          <span className="command-item__glyph" aria-hidden="true">
                            {item.group.slice(0, 1)}
                          </span>
                          <span className="command-item__copy">
                            <strong>{item.title}</strong>
                            <small>{item.description}</small>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="command-empty">
                <strong>No signal found.</strong>
                <small>Try project, resume, GitHub, Azure, work.</small>
              </div>
            )}
          </div>
        </section>
      </div>

      <main className="portfolio-main" id="top">
        <motion.section
          className="scene-section hero-scene"
          id="story"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-wash" aria-hidden="true" />

          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.p
              className="hero-kicker"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Azure / AKS / observability / CI-CD / incident response
            </motion.p>

            <h1 className="hero-title" aria-label={heroLines.join(" ")}>
              {heroLines.map((line, index) => (
                <span className="reveal-line" key={line}>
                  <motion.span
                    className="reveal-line__inner"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.1, ease: [0.33, 1, 0.68, 1] }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              className="hero-summary"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.7 }}
            >
              I build calmer systems. Over the last 4+ years I have reduced MTTR, tuned cloud cost, improved AKS
              reliability, and supported enterprise production workloads where failure has real operational weight.
            </motion.p>

            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.8 }}
            >
              <a className="text-button text-button--solid" href="#work">
                View selected work
              </a>
              <a className="text-button" href="https://github.com/mdsarfarazalam840">
                GitHub
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
          >
            <motion.div
              className="hero-stage"
              animate={{ y: [-18, 0, -18] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="hero-canvas" aria-hidden="true">
                <Suspense fallback={<div className="hero-canvas__fallback" />}>
                  <HeroScene />
                </Suspense>
              </div>

              <motion.div
                className="portrait-frame"
                animate={{ y: [-18, 0, -18] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  className="portrait-ring"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                />
                <div className="portrait-core">
                  <img alt="Portrait of Md Sarfaraz Alam" className="portrait-image" src={profileImage} />
                </div>
              </motion.div>

              <motion.div
                className="live-note"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <span>Now</span>
                <p>Improving Azure reliability, reducing incident noise, and building release confidence.</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.section>

        <motion.section
          className="scene-section impact-scene"
          initial={{ opacity: 0.5 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.4 }}
        >
          <div className="section-wash" aria-hidden="true" />
          <motion.p
            className="scene-label"
            initial={{ opacity: 0, y: 42 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
          >
            Impact
          </motion.p>
          <div className="impact-grid">
            {signalPoints.map((point, index) => (
              <motion.article
                className="impact-item"
                key={point.label}
                initial={{ opacity: 0, y: 42 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 1, delay: index * 0.08, ease: [0.33, 1, 0.68, 1] }}
              >
                <span className="impact-value">{point.value}</span>
                <div>
                  <h2>{point.label}</h2>
                  <p>{point.detail}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="scene-section live-scene"
          initial={{ opacity: 0.5 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.4 }}
        >
          <div className="section-wash" aria-hidden="true" />
          <motion.div
            className="scene-heading"
            initial={{ opacity: 0, y: 42 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
          >
            <p className="scene-label">Live</p>
            <h2>Live signal.</h2>
          </motion.div>

          <div className="live-grid">
            {[
              { content: "github", delay: 0 },
              { content: "cta", delay: 0.1 },
              { content: "spotify", delay: 0.2 },
            ].map((item) => (
              <motion.article
                key={item.content}
                className={`live-card live-card--${item.content}`}
                initial={{ opacity: 0, y: 42 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 1, delay: item.delay, ease: [0.33, 1, 0.68, 1] }}
              >
                <div className="live-card__head">
                  <span>{item.content === "github" ? "Parth's Github" : item.content === "cta" ? "Visitors" : "Last played"}</span>
                  <a href={item.content === "spotify" ? spotifyProfileUrl : `https://github.com/${githubUsername}`}>
                    Open {item.content === "github" ? "profile" : item.content === "cta" ? "" : "Spotify"}
                  </a>
                </div>

                {item.content === "github" && (
                  <div className="github-stack">
                    {latestPush ? (
                      <motion.a
                        className="github-block"
                        href={latestPush.commitUrl}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.18 }}
                      >
                        <div className="github-block__meta">
                          <span>Latest push</span>
                          <small>{formatRelativeTime(latestPush.pushedAt)}</small>
                        </div>
                        <strong>"{latestPush.message}"</strong>
                        <p>Repo: {latestPush.repo}</p>
                      </motion.a>
                    ) : (
                      <div className="live-empty">{githubError ? "GitHub API blocked or rate limited." : "Push data loading..."}</div>
                    )}

                    {latestCommit ? (
                      <motion.a
                        className="github-block"
                        href={latestCommit.commitUrl}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.18 }}
                      >
                        <div className="github-block__meta">
                          <span>Latest commit</span>
                          <small>{formatRelativeTime(latestCommit.pushedAt)}</small>
                        </div>
                        <strong>"{latestCommit.message}"</strong>
                        <p>Repo: {latestCommit.repo}</p>
                      </motion.a>
                    ) : (
                      <div className="live-empty">{githubError ? "Commit data unavailable." : "Commit data loading..."}</div>
                    )}
                  </div>
                )}

                {item.content === "cta" && (
                  <div className="signature-card">
                    <h3>
                      Leave your <em>signal</em>
                    </h3>
                    <p>Open for SRE, Azure reliability, and platform work.</p>
                    <motion.a
                      className="signature-link"
                      href="mailto:md.sarfarazalam840@gmail.com"
                      whileHover={{ y: -2, boxShadow: "0 0 36px rgba(255, 166, 71, 0.22)" }}
                      transition={{ duration: 0.18 }}
                    >
                      Contact me
                    </motion.a>
                  </div>
                )}

                {item.content === "spotify" && (
                  <motion.a
                    className="spotify-widget spotify-widget--futuristic"
                    href={spotifyProfileUrl}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.18 }}
                  >
                    <span className="spotify-widget__glow" aria-hidden="true" />
                    <span className="spotify-widget__grid" aria-hidden="true" />
                    <span className="spotify-widget__orbit" aria-hidden="true" />
                    <div className="spotify-widget__chrome">
                      <span className="spotify-pill">Live audio signal</span>
                    </div>
                    <img alt="Spotify recently played widget" src={spotifyWidgetUrl} />
                  </motion.a>
                )}
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="scene-section narrative-scene"
          id="work"
          initial={{ opacity: 0.5 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.4 }}
        >
          <div className="section-wash" aria-hidden="true" />
          <motion.div
            className="scene-heading"
            initial={{ opacity: 0, y: 42 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
          >
            <p className="scene-label">Experience</p>
            <h2>Production work, told as operating narrative not resume dump.</h2>
          </motion.div>

          <div className="story-list">
            {experienceStories.map((story, index) => (
              <motion.article
                className="story-item"
                key={story.title}
                initial={{ opacity: 0, y: 42 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 1, delay: index * 0.08, ease: [0.33, 1, 0.68, 1] }}
              >
                <span>{story.period}</span>
                <div>
                  <h3>{story.title}</h3>
                  <p>{story.copy}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="scene-section projects-scene"
          initial={{ opacity: 0.5 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.4 }}
        >
          <div className="section-wash" aria-hidden="true" />
          <motion.div
            className="scene-heading"
            initial={{ opacity: 0, y: 42 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
          >
            <p className="scene-label">Projects</p>
            <h2>Few projects. Real impact. No clutter.</h2>
          </motion.div>

          <div className="project-marquee">
            <SimpleMarquee
              className="w-full"
              baseVelocity={8}
              repeat={4}
              slowdownOnHover
              slowDownFactor={0.2}
              slowDownSpringConfig={{ damping: 60, stiffness: 300 }}
              useScrollVelocity
              scrollAwareDirection
              scrollSpringConfig={{ damping: 50, stiffness: 400 }}
              direction="left"
            >
              {featuredProjects.slice(0, 2).map((project) => (
                <a
                  key={project.title}
                  href={project.href}
                  className="mx-3 w-72 sm:w-80 md:w-96 shrink-0 block group"
                >
                  <div className="project-marquee-card">
                    <h3 className="text-white text-base sm:text-lg md:text-xl font-medium mb-1.5 sm:mb-2">
                      {project.title}
                    </h3>
                    <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3 line-clamp-2">
                      {project.impact}
                    </p>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] sm:text-xs text-neutral-300">
                      {project.stack}
                    </span>
                  </div>
                </a>
              ))}
            </SimpleMarquee>

            <SimpleMarquee
              className="w-full mt-2 sm:mt-3 md:mt-4"
              baseVelocity={8}
              repeat={4}
              slowdownOnHover
              slowDownFactor={0.2}
              slowDownSpringConfig={{ damping: 60, stiffness: 300 }}
              useScrollVelocity
              scrollAwareDirection
              scrollSpringConfig={{ damping: 50, stiffness: 400 }}
              direction="right"
            >
              {featuredProjects.slice(2).map((project) => (
                <a
                  key={project.title}
                  href={project.href}
                  className="mx-3 w-72 sm:w-80 md:w-96 shrink-0 block group"
                >
                  <div className="project-marquee-card">
                    <h3 className="text-white text-base sm:text-lg md:text-xl font-medium mb-1.5 sm:mb-2">
                      {project.title}
                    </h3>
                    <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3 line-clamp-2">
                      {project.impact}
                    </p>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] sm:text-xs text-neutral-300">
                      {project.stack}
                    </span>
                  </div>
                </a>
              ))}
            </SimpleMarquee>
          </div>
        </motion.section>

        <motion.section
          className="scene-section capabilities-scene"
          id="capabilities"
          initial={{ opacity: 0.5 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.4 }}
        >
          <div className="section-wash" aria-hidden="true" />
          <motion.div
            className="scene-heading"
            initial={{ opacity: 0, y: 42 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
          >
            <p className="scene-label">Capabilities</p>
            <h2>Stack shown with restraint.</h2>
          </motion.div>

          <motion.div
            className="capability-cloud"
            initial={{ opacity: 0, y: 42 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.33, 1, 0.68, 1] }}
          >
            {capabilityGroups.map((item, index) => (
              <motion.span
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 0.92, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                whileHover={{ scale: 1.1, color: "#00d4ff" }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
              >
                {item}
              </motion.span>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          className="scene-section contact-scene"
          id="contact"
          initial={{ opacity: 0.5 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.4 }}
        >
          <div className="section-wash" aria-hidden="true" />
          <div className="contact-layout">
            <motion.div
              className="contact-copy"
              initial={{ opacity: 0, y: 42 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
            >
              <p className="scene-label">Contact</p>
              <h2>Open for reliability-first engineering, platform support, and cloud operations work.</h2>
              <p>
                Best fit for teams that care about release discipline, observability quality, AKS operations, incident
                response, and measurable production improvement.
              </p>
            </motion.div>

            <motion.div
              className="contact-links"
              initial={{ opacity: 0, y: 42 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.33, 1, 0.68, 1] }}
            >
              {contactLinks.map((item, index) => (
                <motion.a
                  download={item.label === "Resume" ? resumeFileName : undefined}
                  href={item.href}
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.5 }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
                >
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="scene-section github-graph-scene"
          initial={{ opacity: 0.5 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
        >
          <div className="section-wash" aria-hidden="true" />
          <motion.div
            className="scene-heading"
            initial={{ opacity: 0, y: 42 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
          >
            <p className="scene-label">GitHub graph</p>
            <h2>Contribution graph sits at bottom now.</h2>
          </motion.div>

          <div className="calendar-shell calendar-shell--bottom" data-animate style={{ contain: 'layout paint' }}>
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
        </motion.section>
      </main>
    </div>
  );
}

export default App;
