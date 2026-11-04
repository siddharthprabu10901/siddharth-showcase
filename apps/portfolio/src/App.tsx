import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Braces,
  Check,
  CheckCheck,
  ChevronRight,
  Code2,
  Copy,
  FileText,
  Grid2X2,
  Layers3,
  MapPin,
  Menu,
  ShieldCheck,
  Sparkles,
  Terminal,
  Workflow,
  X,
} from "lucide-react";
import { caseStudies, profile, type CaseId } from "./profile";

function CaseStudy({ id, onClose }: { id: CaseId; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const study = caseStudies[id];
  useEffect(() => {
    const focused = document.activeElement as HTMLElement | null;
    const element = dialog.current;
    element?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previous;
      focused?.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="case-modal"
      aria-labelledby="case-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="case-modal-header">
        <span className="eyebrow">{study.type}</span>
        <button
          className="icon-button"
          aria-label="Close case study"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      <div className="case-modal-body">
        <span className="case-number">/{study.number}</span>
        <h2 id="case-title">{study.title}</h2>
        <p className="case-subtitle">{study.subtitle}</p>
        <p className="case-summary">{study.summary}</p>
        <div className="tags">
          {study.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        {study.sections.map((section) => (
          <section key={section.title}>
            <h3>{section.title}</h3>
            <p>{section.text}</p>
          </section>
        ))}
        {id === "flowdesk" && (
          <div className="case-actions">
            <a
              className="button primary"
              href={profile.projectDemo}
              target="_blank"
              rel="noreferrer"
            >
              Open the demo
              <ArrowUpRight size={16} />
            </a>
            {profile.projectSource && (
              <a
                className="button outline"
                href={profile.projectSource}
                target="_blank"
                rel="noreferrer"
              >
                Source code
                <Code2 size={16} />
              </a>
            )}
          </div>
        )}
      </div>
    </dialog>
  );
}

function ProjectPreview() {
  return (
    <div
      className="project-preview"
      aria-label="Illustrative preview of the Flowdesk expense workspace"
    >
      <div className="preview-top">
        <span className="preview-brand">
          f<span>flowdesk.</span>
        </span>
        <span>Workspace / Overview</span>
        <span className="preview-avatar">SP</span>
      </div>
      <div className="preview-body">
        <div className="preview-mini-nav">
          <span className="mini-nav-active">
            <Grid2X2 size={12} />
          </span>
          <span>
            <FileText size={12} />
          </span>
          <span>
            <CheckCheck size={12} />
          </span>
          <span className="preview-mini-bottom">
            <Code2 size={12} />
          </span>
        </div>
        <div className="preview-main">
          <div className="preview-heading">
            <div>
              <small>STUDIO WORKSPACE</small>
              <strong>A clear view of every expense.</strong>
            </div>
            <span>+ New expense</span>
          </div>
          <div className="preview-stats">
            <div>
              <small>Total expenses</small>
              <strong>₹59,536</strong>
              <span>Fictional sample data</span>
            </div>
            <div>
              <small>Awaiting review</small>
              <strong>₹37,799</strong>
              <span>6 expenses to review</span>
            </div>
            <div>
              <small>Reimbursed</small>
              <strong>₹11,738</strong>
              <span>Demo workflow</span>
            </div>
          </div>
          <div className="preview-table">
            <div className="preview-table-heading">
              Recent expenses<span>Export CSV ↗</span>
            </div>
            <div className="preview-row preview-table-label">
              <span>MERCHANT</span>
              <span>CATEGORY</span>
              <span>AMOUNT</span>
              <span>STATUS</span>
            </div>
            {[
              ["Figma", "Software", "₹4,500", "Pending"],
              ["IndiGo", "Travel", "₹12,850", "Pending"],
              ["Blue Tokai", "Meals", "₹1,850", "Approved"],
              ["Notion", "Software", "₹3,200", "Reimbursed"],
            ].map(([merchant, category, amount, status]) => (
              <div className="preview-row" key={merchant}>
                <span>
                  <b className={`mini-logo ${category.toLowerCase()}`}>
                    {merchant[0]}
                  </b>
                  {merchant}
                </span>
                <span>{category}</span>
                <span>{amount}</span>
                <span>
                  <i className={`mini-status ${status.toLowerCase()}`}>
                    {status}
                  </i>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [caseId, setCaseId] = useState<CaseId | null>(null);
  const [menu, setMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 3500);
    return () => clearTimeout(timer);
  }, [copied]);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  }
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="site-wrap" id="top">
        <header className="site-header">
          <a href="#top" className="wordmark" aria-label="Siddharth P home">
            <span>sp</span>
            <span className="wordmark-dot" />
          </a>
          <nav className={menu ? "is-open" : ""} aria-label="Main navigation">
            <a href="#work" onClick={() => setMenu(false)}>
              Selected work
            </a>
            <a href="#experience" onClick={() => setMenu(false)}>
              Experience
            </a>
            <a href="#about" onClick={() => setMenu(false)}>
              About
            </a>
          </nav>
          <button
            className="icon-button mobile-menu"
            aria-label={menu ? "Close navigation" : "Open navigation"}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </header>
        <main id="main">
          <section className="hero">
            <div className="hero-copy">
              <span className="availability">
                <span />
                OPEN TO NEW OPPORTUNITIES
              </span>
              <p className="hero-intro">
                Hello, I’m Siddharth<span className="wave-mark">↗</span>
              </p>
              <h1>
                Enterprise interfaces.
                <br />
                <em>Built for reuse.</em>
              </h1>
              <p className="hero-description">
                Senior Software Engineer at Odessa, building shared UI framework
                capabilities for enterprise leasing and finance applications.
              </p>
              <p className="hero-secondary">
                JavaScript, jQuery and Syncfusion are my everyday tools. I’m
                expanding my frontend practice through React and TypeScript
                projects.
              </p>
              <div className="hero-actions">
                <a className="button primary" href="#work">
                  Explore my work
                  <ArrowDown size={16} />
                </a>
                <a
                  className="button text-button"
                  href={`${import.meta.env.BASE_URL}resume.html`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FileText size={17} />
                  View résumé
                  <ArrowUpRight size={14} />
                </a>
              </div>
              <div className="location">
                <MapPin size={14} />
                {profile.location}
                <span>·</span>Open to Tamil Nadu & Bengaluru
              </div>
            </div>
            <div className="hero-art">
              <div className="art-kicker">
                <span className="tiny-square" />
                FRONTEND, WITH THE FULL PICTURE.
              </div>
              <div className="craft-card">
                <div className="craft-card-top">
                  <span className="craft-logo">
                    <Braces size={23} />
                  </span>
                  <span className="craft-version">CRAFT / 01</span>
                </div>
                <div className="craft-title">
                  Making the complex
                  <br />
                  <span>feel considered.</span>
                </div>
                <div className="craft-flow">
                  <span>
                    <Layers3 size={17} />
                    <small>Requirements</small>
                  </span>
                  <ChevronRight size={16} />
                  <span className="flow-active">
                    <Code2 size={17} />
                    <small>Interfaces</small>
                  </span>
                  <ChevronRight size={16} />
                  <span>
                    <ShieldCheck size={17} />
                    <small>Confidence</small>
                  </span>
                </div>
                <div className="craft-code">
                  <span className="code-comment">// built around the user</span>
                  <p>
                    <b>const</b> experience = {"{"}
                  </p>
                  <p className="code-indent">
                    clear: <i>true</i>,
                  </p>
                  <p className="code-indent">
                    reusable: <i>true</i>,
                  </p>
                  <p className="code-indent">
                    tested: <i>true</i>
                  </p>
                  <p>{"}"};</p>
                </div>
                <div className="craft-card-bottom">
                  <span>
                    <span />
                    SMALL DETAILS. REAL IMPACT.
                  </span>
                  <ArrowUpRight size={17} />
                </div>
              </div>
              <div className="experience-stamp">
                <strong>4+</strong>
                <span>
                  years building
                  <br />
                  enterprise software
                </span>
              </div>
              <span className="art-orbit orbit-one" />
              <span className="art-orbit orbit-two" />
            </div>
          </section>
          <section className="practice-strip" aria-label="Professional focus">
            <span>MY EVERYDAY TOOLKIT</span>
            <div>
              <span>JavaScript</span>
              <span>jQuery</span>
              <span>Syncfusion</span>
              <span>HTML5 & CSS3</span>
              <span>Playwright</span>
            </div>
            <a href="#about">
              A little more about me
              <ArrowUpRight size={14} />
            </a>
          </section>
          <section id="work" className="work-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">01 / SELECTED WORK</span>
                <h2>
                  Useful things.
                  <br />
                  <em>Carefully put together.</em>
                </h2>
              </div>
              <p>
                Enterprise frontend contributions and
                <br className="desktop-break" /> independent application work.
              </p>
            </div>
            <article className="featured-project">
              <div className="project-visual">
                <ProjectPreview />
                <span className="project-visual-caption">
                  <span />A WORKING FRONTEND DEMO · FICTIONAL DATA
                </span>
              </div>
              <div className="project-copy">
                <span className="project-label">
                  INDEPENDENT REACT PROJECT
                </span>
                <h3>
                  Flowdesk<span>↗</span>
                </h3>
                <p className="project-tagline">
                  Every expense. One clear view.
                </p>
                <p className="project-description">
                  An expense-and-approval workspace demonstrating enterprise
                  UI patterns with React and TypeScript. Searchable tables,
                  validated forms, status workflows and browser persistence.
                </p>
                <div className="tags">
                  <span>React</span>
                  <span>TypeScript</span>
                  <span>Playwright</span>
                  <span>CSS</span>
                </div>
                <div className="project-actions">
                  <a
                    className="button primary"
                    href={profile.projectDemo}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Explore the demo
                    <ArrowUpRight size={16} />
                  </a>
                  <button
                    className="case-link"
                    onClick={() => setCaseId("flowdesk")}
                  >
                    Project story
                    <ArrowRight size={15} />
                  </button>
                </div>
                <p className="project-footnote">
                  Personal project · AI-assisted development · Browser-only demo
                </p>
              </div>
            </article>
            <div className="work-cases">
              {(
                [
                  {
                    id: "cards",
                    icon: Layers3,
                    title: "Configuration-driven card layouts",
                    description:
                      "A reusable grid type that renders card-based layouts from configuration, without screen-specific JavaScript or CSS.",
                    label: "REUSABLE COMPONENTS / JAVASCRIPT",
                  },
                  {
                    id: "workflows",
                    icon: Workflow,
                    title: "Safer navigation through complex workflows",
                    description:
                      "Configurable breadcrumbs, unsaved-change protection and wizard actions. Breadcrumb delivery across four stories and seven pull requests.",
                    label: "NAVIGATION / CONFIGURATION",
                  },
                  {
                    id: "grids",
                    icon: Grid2X2,
                    title: "Configurable enterprise grids",
                    description:
                      "Row-level conditional actions, column management, saved views and favourites across portal workflows.",
                    label: "DATA GRIDS / JQUERY",
                  },
                  {
                    id: "formatting",
                    icon: Braces,
                    title: "Consistent regional money formatting",
                    description:
                      "Defined grouping and separator rules for ten regions, with consistent values across inputs, display fields and grids.",
                    label: "REGIONAL FORMATTING / VALIDATION",
                  },
                  {
                    id: "upgrade",
                    icon: ShieldCheck,
                    title: "A planned Syncfusion component upgrade",
                    description:
                      "Owned the 25.1.39-to-29.2.10 upgrade across server packages and browser assets. Seventeen days from analysis to merge.",
                    label: "SYNCFUSION / COMPATIBILITY",
                  },
                ] as const
              ).map(({ id, icon: Icon, title, description, label }) => (
                <article className="work-case" key={id}>
                  <div className="work-case-top">
                    <span className="case-icon">
                      <Icon size={23} />
                    </span>
                    <span>PROFESSIONAL WORK · ODESSA</span>
                  </div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <div className="work-case-footer">
                    <span>{label}</span>
                    <button
                      className="case-link"
                      aria-label={`Read case study: ${title}`}
                      onClick={() => setCaseId(id)}
                    >
                      Read case study
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <p className="confidential-note">
              <ShieldCheck size={13} />
              Professional case studies are high-level descriptions. Company
              code, internal screenshots and customer data are not published.
            </p>
          </section>
          <section id="experience" className="experience-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">02 / EXPERIENCE</span>
                <h2>
                  One company.
                  <br />
                  <em>A steady progression.</em>
                </h2>
              </div>
              <p>
                Growing from implementation to ownership
                <br className="desktop-break" /> across enterprise frontend
                work.
              </p>
            </div>
            <div className="delivery-metrics" aria-label="Professional contribution record">
              <div><strong>495</strong><span>Work items contributed</span></div>
              <div><strong>456</strong><span>In completed states</span></div>
              <div><strong>4 + 9</strong><span>Docs published + contributed to</span></div>
              <p>August 2022–November 2026 contribution record. Work items include bugs, stories and tasks; completed states cover closed, released, done or resolved items.</p>
            </div>
            <div className="experience-layout">
              <div className="company-card">
                <span className="company-monogram">O</span>
                <h3>Odessa Technologies</h3>
                <p>Enterprise software</p>
                <span>August 2022 — present</span>
                <div className="company-tags">
                  <span>Automotive retail</span>
                  <span>Lease origination</span>
                  <span>Loan origination</span>
                </div>
              </div>
              <div className="timeline">
                <article className="timeline-item current">
                  <span className="timeline-dot" />
                  <div className="timeline-title">
                    <h3>Senior Software Engineer</h3>
                    <span>APR 2025 — PRESENT</span>
                  </div>
                  <p>
                    Shared UI framework delivery: configurable breadcrumbs and card
                    layouts, portal grid preferences, regional formatting and the
                    Syncfusion upgrade. Documented configuration and validation
                    guidance for product teams.
                  </p>
                  <div className="timeline-chip">
                    Current role
                    <ArrowUpRight size={12} />
                  </div>
                </article>
                <article className="timeline-item">
                  <span className="timeline-dot" />
                  <div className="timeline-title">
                    <h3>Software Engineer</h3>
                    <span>MAY 2023 — APR 2025</span>
                  </div>
                  <p>
                    Built reusable UI components, wizard navigation, origination
                    styles and chart layouts with JavaScript, jQuery and Syncfusion.
                    Collaborated with product and QA through validation and release.
                  </p>
                </article>
                <article className="timeline-item">
                  <span className="timeline-dot" />
                  <div className="timeline-title">
                    <h3>Associate Software Engineer</h3>
                    <span>AUG 2022 — MAY 2023</span>
                  </div>
                  <p>
                    Developed frontend fundamentals in an enterprise codebase,
                    collaborating with product and QA teams on enhancements and
                    defect resolution.
                  </p>
                </article>
              </div>
            </div>
          </section>
          <section id="about" className="about-section">
            <div className="about-copy">
              <span className="eyebrow">03 / A LITTLE ABOUT ME</span>
              <h2>
                I care about the parts
                <br />
                <em>people actually use.</em>
              </h2>
              <p>
                I’m a software engineer working in Bengaluru, originally from
                Coimbatore. Much of my work
                lives in enterprise applications, where small details in
                navigation, data grids and forms can make a complicated workflow
                feel easier.
              </p>
              <p>
                My work starts with reproducing the problem and finding its cause
                in the shared framework. I compare options, build configurable
                behaviour, validate changes and document how product teams can use
                them. Supporting work includes MVC requirements, basic C# changes
                and SQL for UI needs.
              </p>
              <div className="education">
                <span className="education-icon">
                  <BookIcon />
                </span>
                <div>
                  <strong>
                    B.E. Electronics & Instrumentation Engineering
                  </strong>
                  <span>Sri Ramakrishna Engineering College · CGPA 8.63</span>
                </div>
              </div>
            </div>
            <div className="skills-card">
              <div className="skills-card-header">
                <Terminal size={20} />
                <span>THE TOOLKIT</span>
              </div>
              <div className="skill-group">
                <span>PROFESSIONAL FRONTEND</span>
                <div className="skill-tags">
                  {[
                    "JavaScript (ES6+)",
                    "jQuery",
                    "Syncfusion",
                    "HTML5",
                    "CSS3",
                    "AJAX",
                    "JSON",
                    "Responsive UI",
                  ].map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </div>
              <div className="skill-group">
                <span>QUALITY & COLLABORATION</span>
                <div className="skill-tags">
                  {[
                    "Playwright",
                    "DevTools",
                    "Git",
                    "TFS",
                    "Defect analysis",
                    "Release sanity testing",
                  ].map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </div>
              <div className="skill-group">
                <span>SUPPORTING EXPERIENCE</span>
                <div className="skill-tags">
                  <span>ASP.NET MVC</span>
                  <span>C# basics</span>
                  <span>SQL</span>
                </div>
              </div>
              <div className="learning-note">
                <Sparkles size={17} />
                <p>
                  <strong>Project-based frontend skills</strong>React and TypeScript
                  through independent application work. Web API knowledge is at a
                  basic level.
                </p>
              </div>
            </div>
          </section>
          <section id="contact" className="contact-section">
            <span className="eyebrow">04 / WHAT’S NEXT?</span>
            <div className="contact-heading">
              <h2>
                Have a good problem
                <br />
                <em>to work on?</em>
              </h2>
            </div>
            <div className="contact-bottom">
              <p>
                I’m exploring software and frontend opportunities
                <br />
                in Tamil Nadu and Bengaluru.
              </p>
              <div className="email-copy">
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
                <button
                  className="icon-button"
                  aria-label="Copy email address"
                  onClick={copyEmail}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
            <p className="copy-status" role="status">
              {copied
                ? "Email address copied."
                : copyError
                  ? "Copy was unavailable. Use the email link to get in touch."
                  : ""}
            </p>
          </section>
        </main>
        <footer className="site-footer">
          <span>
            © {new Date().getFullYear()} Siddharth P
            <span className="footer-separator">/</span>Built with React &
            TypeScript
          </span>
          <div>
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub
              <ArrowUpRight size={12} />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
              <ArrowUpRight size={12} />
            </a>
            <a href="#top">
              Back to top
              <ArrowUpRight size={12} />
            </a>
          </div>
        </footer>
      </div>
      {caseId && <CaseStudy id={caseId} onClose={() => setCaseId(null)} />}
    </>
  );
}
function BookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="m3 8 9-4 9 4-9 4-9-4Z" />
      <path d="M6 10v6c4 3 8 3 12 0v-6M21 9v7" />
    </svg>
  );
}
