import HeroScene from "./components/hero-scene";

type Stat = {
  label: string;
  value: string;
  detail: string;
};

type Role = {
  title: string;
  company: string;
  duration: string;
  summary: string;
  bullets: string[];
};

const signalStats: Stat[] = [
  {
    label: "Production Surface",
    value: "10+ Apps",
    detail: "Azure-hosted workloads supported with L2/L3 ownership and outage response.",
  },
  {
    label: "Cost Impact",
    value: "$95K",
    detail: "Measured annual savings through platform tuning, right-sizing, and automation.",
  },
  {
    label: "Acceleration",
    value: "35%",
    detail: "Lower application load time after ADF-driven archival and disposal automation.",
  },
  {
    label: "Leadership",
    value: "6 Engineers",
    detail: "Task delegation, mentoring, and delivery guidance in SLA-sensitive environments.",
  },
];

const operatingSignals = [
  {
    title: "Incident command",
    body: "P1/P2 resolution, RCA leadership, vendor coordination, and reliability follow-through.",
  },
  {
    title: "Cloud cost engineering",
    body: "Operational savings through App Service modernization, autoscaling, and platform rightsizing.",
  },
  {
    title: "Delivery systems",
    body: "CI/CD, observability, Terraform, AKS, and secure deployment mechanics across environments.",
  },
];

const platformTools = [
  "Azure App Services",
  "AKS",
  "Azure SQL",
  "Azure Monitor",
  "Key Vault",
  "Logic Apps",
  "ACR",
  "Azure Functions",
  "Azure Data Factory",
  "Terraform",
  "GitHub Actions",
  "Azure DevOps",
];

const engineeringTools = [
  "ReactJS",
  "NodeJS",
  "Python",
  "Bash",
  "Postman",
  "Databricks",
  "Git",
  "SonarQube",
  "Grafana",
  "Azure Log Analytics",
  "MSSQL",
  "Oracle",
  "Cosmos DB",
];

const roles: Role[] = [
  {
    title: "Software Engineer",
    company: "Accenture · Client: Shell",
    duration: "May 2023 - Present",
    summary:
      "Enterprise cloud operations focused on platform reliability, automation, observability, and high-trust leadership.",
    bullets: [
      "Resolved P1/P2 incidents with application vendors and Microsoft, then led RCA and problem management to reduce recurrence.",
      "Implemented cost optimization initiatives that delivered an estimated $95,000 in annual operational savings.",
      "Designed end-to-end CI/CD pipelines with GitHub Actions and Azure DevOps for builds, tests, security scans, and deployments.",
      "Rolled out Dynatrace dashboards and OneAgent installation across application estates.",
      "Led a six-member team through technical guidance, delegation, mentoring, and knowledge transfer.",
      "Built an Azure Data Factory archival pipeline that reduced application load time by 35%.",
      "Provisioned cloud infrastructure with Terraform for repeatable, version-controlled deployments.",
      "Managed AKS deployments including scaling, health checks, and secrets management.",
    ],
  },
  {
    title: "Associate Software Engineer",
    company: "Accenture",
    duration: "Sept 2021 - April 2023",
    summary:
      "Azure operations support across multiple production applications with strong observability and ITIL discipline.",
    bullets: [
      "Delivered L2/L3 support for 10+ Azure-hosted applications, including validation during Azure outages.",
      "Reduced monthly cost by 20% through weekend DB downsizing, auto-scaling, and resource rightsizing.",
      "Worked extensively with App Services, Logic Apps, Azure Functions, Azure SQL, and ADF production workloads.",
      "Operated in an ITIL-aligned environment for incident management, problem resolution, and change control.",
      "Partnered with development and infrastructure teams to ship bug fixes and enhancements through Azure DevOps and GitHub Actions.",
      "Created custom Azure Monitor and Log Analytics alerts using KQL for stronger observability.",
    ],
  },
];

const achievements = [
  "ACE (Accenture Celebrates Excellence) award in Q2 2024 for SLA excellence, React UI delivery, mentoring, and technical leadership.",
  "35% faster application load time through Azure Data Factory archival and disposal automation.",
  "20% monthly cost reduction through App Service plan modernization and cross-environment resource tuning.",
];

const certifications = [
  "Postman Student Expert",
  "AZ-900: Microsoft Azure Fundamentals",
  "AZ-104: Azure Administrator Associate",
];

function App() {
  return (
    <div className="page-shell">
      <div className="page-noise" aria-hidden="true" />

      <header className="topbar" aria-label="Primary navigation">
        <a className="brand-mark" href="#home">
          <span aria-hidden="true">MSA</span>
          <div>
            <strong>Md Sarfaraz Alam</strong>
            <small>Cloud Operations Engineer</small>
          </div>
        </a>

        <nav className="topbar-nav">
          <a href="#experience">Experience</a>
          <a href="#toolkit">Toolkit</a>
          <a href="#credentials">Credentials</a>
        </nav>

        <a className="topbar-cta" href="mailto:md.sarfarazalam840@gmail.com">
          Open Contact
        </a>
      </header>

      <main id="home">
        <section className="hero-shell">
          <div className="hero-canvas" aria-hidden="true">
            <HeroScene />
          </div>

          <div className="hero-grid layout-shell">
            <section className="hero-copy-block">
              <p className="eyebrow">Azure PaaS · AKS · Observability · DevOps Delivery · Cost Optimization</p>
              <div className="hero-title-stack">
                <span className="hero-deck-label">Orbital support layer</span>
                <h1>Azure operations presented like a flagship command center.</h1>
              </div>
              <p className="hero-copy">
                Performance-driven IT professional with 4+ years of experience supporting large-scale cloud-native and hybrid
                environments. I bring reliability, automation, observability, and delivery discipline to enterprise Azure
                platforms that cannot afford downtime or drift.
              </p>

              <div className="hero-actions">
                <a className="primary-button" href="mailto:md.sarfarazalam840@gmail.com">
                  Email Me
                </a>
                <a className="secondary-button" href="#experience">
                  Explore Experience
                </a>
              </div>

              <ul className="contact-ribbon" aria-label="Contact details">
                <li><span>Handle</span>mdsarfarazalam840</li>
                <li><span>Email</span>md.sarfarazalam840@gmail.com</li>
                <li><span>Phone</span>+91 7717795540</li>
              </ul>
            </section>

            <aside className="hero-panel glass-card" aria-label="Professional snapshot">
              <div className="panel-kicker">Live Career Signal</div>
              <h2>Support calm. Automation mindset. Enterprise-scale execution.</h2>
              <p>
                Proven in ITIL-aligned L2/L3 environments with deep Azure platform knowledge, incident ownership, proactive
                monitoring, and dependable collaboration across DevOps and development teams.
              </p>

              <div className="status-grid">
                {signalStats.map((item) => (
                  <article className="status-card" key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                    <p>{item.detail}</p>
                  </article>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="impact-band layout-shell" aria-label="Core strengths">
          {operatingSignals.map((item) => (
            <article className="impact-band__card" key={item.title}>
              <span>{item.title}</span>
              <p>{item.body}</p>
            </article>
          ))}
        </section>

        <section className="overview-grid layout-shell">
          <article className="glass-card manifesto-card">
            <p className="section-tag">Operating Profile</p>
            <h2>Built for environments where uptime, speed, and accountability need to coexist.</h2>
            <p>
              My strength sits at the intersection of support engineering, platform operations, and delivery execution. That
              means restoring service quickly, improving observability before the next incident arrives, and designing the
              automation and deployment patterns that make teams more confident over time.
            </p>
          </article>

          <article className="glass-card education-card">
            <p className="section-tag">Education</p>
            <h2>B.Tech. in Computer Science &amp; Engineering</h2>
            <p>Gandhi Institute for Education and Technology, Odisha</p>
            <p className="muted">2017 - 2021</p>
          </article>
        </section>

        <section className="experience-section layout-shell" id="experience">
          <div className="section-heading">
            <p className="section-tag">Experience</p>
            <h2>Operational depth across support, automation, deployment, observability, and cloud efficiency.</h2>
          </div>

          <div className="timeline-list">
            {roles.map((role) => (
              <article className="glass-card timeline-card" key={`${role.title}-${role.duration}`}>
                <div className="timeline-rail" aria-hidden="true" />
                <div className="timeline-content">
                  <div className="timeline-header">
                    <div>
                      <h3>{role.title}</h3>
                      <p>{role.company}</p>
                    </div>
                    <span>{role.duration}</span>
                  </div>
                  <p className="timeline-summary">{role.summary}</p>
                  <ul>
                    {role.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="toolkit-section layout-shell" id="toolkit">
          <div className="section-heading">
            <p className="section-tag">Toolkit</p>
            <h2>A modern Azure operations stack with delivery, troubleshooting, and data discipline built in.</h2>
          </div>

          <div className="toolkit-grid">
            <article className="glass-card toolkit-card">
              <div className="toolkit-card__head">
                <span>Platform layer</span>
                <h3>Cloud &amp; Infrastructure</h3>
              </div>
              <div className="skill-pills">
                {platformTools.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>

            <article className="glass-card toolkit-card">
              <div className="toolkit-card__head">
                <span>Execution layer</span>
                <h3>Engineering &amp; Data</h3>
              </div>
              <div className="skill-pills">
                {engineeringTools.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="credentials-grid layout-shell" id="credentials">
          <article className="glass-card credentials-card">
            <p className="section-tag">Achievements</p>
            <h2>Measured impact, not just activity.</h2>
            <ul className="feature-list">
              {achievements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="glass-card credentials-card">
            <p className="section-tag">Certifications</p>
            <h2>Validated cloud foundations.</h2>
            <ul className="feature-list">
              {certifications.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>
      </main>
    </div>
  );
}

export default App;
