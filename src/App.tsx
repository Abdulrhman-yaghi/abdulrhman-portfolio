import { useEffect, useState } from "react";
import { profile } from "./config";
import "./App.css";

// Read once at module load; the prerendered year is corrected on hydration if it differs.
const year = new Date().getFullYear();
const template =
  "Application / website:\nExpected behavior:\nWhat happens instead:\nSteps to reproduce:\nRecent changes:\nDeadline:";
type ContactReason = "bug" | "project" | "hello";
const navItems = [
  ["services", "Services"],
  ["work", "Work"],
  ["about", "About"],
] as const;

const Arrow = ({ dir = "→" }: { dir?: string }) => (
  <span className="arrow" aria-hidden="true">
    {dir}
  </span>
);

/* Simple 24px line icons, drawn for this site. */
type IconName = "bug" | "api" | "data" | "clock" | "check" | "layout" | "plus";
function Icon({ name }: { name: IconName }) {
  const paths = {
    bug: (
      <>
        <rect x="7" y="8" width="10" height="12" rx="5" />
        <path d="M9 8a3 3 0 0 1 6 0M12 12v8M7 13H3m18 0h-4M7.5 17.5 4 20m12.5-2.5L20 20M7.5 9.5 4.5 7m12 2.5L19.5 7" />
      </>
    ),
    api: <path d="M8 7 3 12l5 5M16 7l5 5-5 5M10 12h4" />,
    data: (
      <>
        <ellipse cx="12" cy="6" rx="7" ry="3" />
        <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" />
      </>
    ),
    check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
    layout: (
      <>
        <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
        <path d="M3 9h18M9 9v10.5" />
      </>
    ),
    plus: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
        <path d="M12 8.5v7M8.5 12h7" />
      </>
    ),
  };
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}

const serviceGroups: {
  id: string;
  title: string;
  intro: string;
  items: { icon: IconName; title: string; text: string }[];
}[] = [
  {
    id: "build",
    title: "Build something new",
    intro: "From a first version to a working product.",
    items: [
      {
        icon: "layout",
        title: "Web applications",
        text: "Laravel applications with clear data models, business rules, user roles, and admin dashboards, like Stockroom.",
      },
      {
        icon: "api",
        title: "APIs & integrations",
        text: "REST APIs with validation and authentication, ready for a web or mobile front end to use.",
      },
      {
        icon: "plus",
        title: "Features for existing apps",
        text: "New features added to an application you already have, written to fit the code that’s there.",
      },
    ],
  },
  {
    id: "fix",
    title: "Fix what’s broken",
    intro: "You don’t need to know the cause.",
    items: [
      {
        icon: "bug",
        title: "Application bug fixes",
        text: "Unexpected errors or a feature that stopped working. I reproduce the problem and trace it through the code.",
      },
      {
        icon: "api",
        title: "APIs & authentication",
        text: "Failed requests, validation errors, login problems, and access issues between connected systems.",
      },
      {
        icon: "data",
        title: "SQL & database issues",
        text: "Incorrect results, failed queries, and data relationships that don’t behave as expected.",
      },
      {
        icon: "clock",
        title: "Queues & deployments",
        text: "Laravel jobs that fail, reminders that never run, and configuration issues after a deployment.",
      },
    ],
  },
];

function App() {
  const [reason, setReason] = useState<ContactReason>("project");
  const [brief, setBrief] = useState(template);
  const [emailStatus, setEmailStatus] = useState<"" | "copied" | "failed">("");
  const [reportStatus, setReportStatus] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");

  // Highlight the nav item for the section in the middle of the viewport.
  useEffect(() => {
    const sections = ["home", ...navItems.map(([id]) => id), "contact"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        // The hero has no nav item, so reaching it clears the highlight.
        for (const entry of entries)
          if (entry.isIntersecting)
            setActive(entry.target.id === "home" ? "" : entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const mailto = `mailto:${profile.email}`;
  const isBug = reason === "bug";
  const draftEmail = isBug
    ? `${mailto}?${new URLSearchParams({ subject: "Bug report", body: brief })}`
    : mailto;
  const gmailParams = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: profile.email,
  });
  if (isBug) {
    gmailParams.set("su", "Bug report");
    gmailParams.set("body", brief);
  }
  const gmail = `https://mail.google.com/mail/?${gmailParams}`;

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setEmailStatus("copied");
    } catch {
      setEmailStatus("failed");
    }
  }
  async function copyReport() {
    try {
      await navigator.clipboard.writeText(brief);
      setReportStatus("Bug report copied.");
    } catch {
      setReportStatus(
        "Copy wasn’t available. Select the text and copy it manually.",
      );
    }
  }
  const goToContact = (next: ContactReason) => () => {
    setReason(next);
    setMenuOpen(false);
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header theme-navy">
        <div className="wrap header-inner">
          <a className="brand" href="#home">
            <img
              src={`${import.meta.env.BASE_URL}monogram.svg`}
              width="36"
              height="36"
              alt=""
            />
            <span>Abdulrhman Yaghi</span>
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="menu-icon" aria-hidden="true" />
            Menu
          </button>
          <nav
            id="site-nav"
            className="site-nav"
            aria-label="Main navigation"
            data-open={menuOpen}
          >
            {navItems.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={active === id ? "true" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
            <a
              className="nav-contact"
              href="#contact"
              aria-current={active === "contact" ? "true" : undefined}
              onClick={goToContact("hello")}
            >
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        <section
          className="hero theme-navy"
          id="home"
          aria-labelledby="hero-title"
        >
          <div className="wrap hero-inner">
            <div className="hero-copy">
              <p className="kicker">
                <span className="dot" aria-hidden="true" />
                Backend developer in Amman, Jordan
              </p>
              <h1 id="hero-title">I build and fix web applications.</h1>
              <p className="lead">
                New features, APIs, and admin dashboards, built carefully. And
                when something stops working, I find the cause and fix it.
              </p>
              <div className="actions">
                <a
                  className="button"
                  href="#contact"
                  onClick={goToContact("project")}
                >
                  Tell me about your project <Arrow />
                </a>
                <a
                  className="text-link"
                  href="#contact"
                  onClick={goToContact("bug")}
                >
                  Something broken? Report a bug <Arrow />
                </a>
              </div>
              <ul className="facts" aria-label="At a glance">
                <li>Strongest in Laravel</li>
                <li>Also Python & Django</li>
                <li>Based in Amman · UTC+3</li>
              </ul>
            </div>
            <aside className="how-card" aria-labelledby="how-title">
              <h2 id="how-title">How it works</h2>
              <ol>
                <li>
                  <span className="step" aria-hidden="true">
                    1
                  </span>
                  <div>
                    <h3>You tell me what you need</h3>
                    <p>
                      A new project, a feature, or something that broke. A short
                      message is enough.
                    </p>
                  </div>
                </li>
                <li>
                  <span className="step" aria-hidden="true">
                    2
                  </span>
                  <div>
                    <h3>I plan it, or trace it</h3>
                    <p>
                      I map out what to build, or reproduce the issue and follow
                      the code, configuration, and data.
                    </p>
                  </div>
                </li>
                <li>
                  <span className="step" aria-hidden="true">
                    3
                  </span>
                  <div>
                    <h3>You get software that works</h3>
                    <p>
                      I test the workflow before handing it over, so you can see
                      it working.
                    </p>
                  </div>
                </li>
              </ol>
            </aside>
          </div>
        </section>

        <section
          className="section theme-paper"
          id="services"
          aria-labelledby="services-title"
        >
          <div className="wrap">
            <div className="section-intro">
              <h2 id="services-title">What I can help with</h2>
              <p>
                Starting something new, or stuck with something that broke?
                Either way, tell me what you want to happen.
              </p>
            </div>
            <div className="service-groups">
              {serviceGroups.map((group) => (
                <section
                  className="card service-group"
                  key={group.id}
                  aria-labelledby={`${group.id}-title`}
                >
                  <h3 id={`${group.id}-title`}>{group.title}</h3>
                  <p className="group-intro">{group.intro}</p>
                  <ul>
                    {group.items.map((item) => (
                      <li className="service" key={item.title}>
                        <span className="service-icon">
                          <Icon name={item.icon} />
                        </span>
                        <div>
                          <h4>{item.title}</h4>
                          <p>{item.text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section
          className="section theme-navy"
          id="work"
          aria-labelledby="work-title"
        >
          <div className="wrap">
            <div className="section-intro">
              <h2 id="work-title">Recent work</h2>
              <p>
                A working application, with source code and a walkthrough you
                can explore.
              </p>
            </div>
            <article className="project" aria-labelledby="stockroom-title">
              <figure className="project-figure">
                <img
                  src={`${import.meta.env.BASE_URL}stockroom-dashboard.png`}
                  width="1440"
                  height="1241"
                  alt="Stockroom dashboard showing sales totals, recent orders, and low-stock products"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>
                  The real application, with fictional demo data.
                </figcaption>
              </figure>
              <div className="project-body">
                <p className="project-type">
                  Personal project · Laravel & Filament
                </p>
                <h3 id="stockroom-title">Stockroom</h3>
                <p className="project-description">
                  An inventory dashboard that keeps orders, stock, and sales
                  reports in sync.
                </p>
                <ul className="checklist">
                  <li>
                    <Icon name="check" />
                    Orders check stock before they are confirmed.
                  </li>
                  <li>
                    <Icon name="check" />
                    Cancellations return stock exactly once.
                  </li>
                  <li>
                    <Icon name="check" />
                    Private sales reports run in the background.
                  </li>
                </ul>
                <div className="actions">
                  {profile.stockroomPreview && (
                    <a
                      className="button"
                      href={profile.stockroomPreview}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Explore the demo <Arrow dir="↗" />
                    </a>
                  )}
                  {profile.projects.stockroom && (
                    <a
                      className="text-link"
                      href={profile.projects.stockroom}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Source code <Arrow dir="↗" />
                    </a>
                  )}
                </div>
                <details className="project-details">
                  <summary>
                    What I built and tested
                    <span className="summary-icon" aria-hidden="true" />
                  </summary>
                  <dl>
                    <dt>The goal</dt>
                    <dd>
                      Give a small business one place to manage products,
                      customers, orders, and inventory.
                    </dd>
                    <dt>What I built</dt>
                    <dd>
                      The dashboard, stock checks, order cancellation, role
                      permissions, activity history, and private queued CSV
                      reports.
                    </dd>
                    <dt>How I tested it</dt>
                    <dd>
                      20 PHP tests and four browser tests cover key workflows,
                      permissions, report ownership, rollback, and two processes
                      competing for the last item in SQLite. The full Laravel
                      application runs locally; setup instructions are in the
                      repository. The public preview includes a guide and video.
                    </dd>
                  </dl>
                </details>
              </div>
            </article>
          </div>
        </section>

        <section
          className="section theme-paper"
          id="about"
          aria-labelledby="about-title"
        >
          <div className="wrap about">
            <div className="about-copy">
              <h2 id="about-title">Hi, I’m Abdulrhman.</h2>
              <p>
                I’m a backend developer based in Amman, Jordan. My strongest
                professional experience is in Laravel, with practical Django
                experience from my bootcamp work.
              </p>
              <p>
                I enjoy building features that are easy to follow, understanding
                how an existing system works, and finding the cause when
                something breaks.
              </p>
              <a
                className="text-link"
                href="#contact"
                onClick={goToContact("project")}
              >
                Hire me for a project or discuss a volunteer opportunity{" "}
                <Arrow />
              </a>
            </div>
            <div className="card skills">
              <h3>What I work with</h3>
              <dl>
                <dt>Most experience</dt>
                <dd>
                  <ul className="chips">
                    <li>Laravel</li>
                    <li>PHP</li>
                    <li>REST APIs</li>
                  </ul>
                </dd>
                <dt>Also</dt>
                <dd>
                  <ul className="chips">
                    <li>Python</li>
                    <li>Django</li>
                    <li>SQL</li>
                    <li>PostgreSQL</li>
                    <li>Git</li>
                  </ul>
                </dd>
                <dt>Tools</dt>
                <dd>
                  <ul className="chips">
                    <li>Filament</li>
                    <li>Docker</li>
                    <li>Laravel Passport</li>
                  </ul>
                </dd>
              </dl>
            </div>
          </div>
        </section>

        <section
          className="section theme-navy contact-section"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="wrap contact">
            <div className="contact-intro">
              <h2 id="contact-title">What can I help with?</h2>
              <p>
                A short message is enough to start. Tell me what you’re working
                on, and nothing is sent until you choose to send it.
              </p>
              <ul className="other-ways" aria-label="Other ways to reach me">
                {profile.linkedin && (
                  <li>
                    <a
                      className="text-link"
                      href={profile.linkedin}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Message me on LinkedIn <Arrow dir="↗" />
                    </a>
                  </li>
                )}
                {(
                  [
                    ["GitHub", profile.github],
                    ["Upwork", profile.upwork],
                    ["Mostaqel", profile.mostaqel],
                  ] as const
                )
                  .filter(([, url]) => url)
                  .map(([label, url]) => (
                    <li key={label}>
                      <a
                        className="text-link"
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {label} <Arrow dir="↗" />
                      </a>
                    </li>
                  ))}
                {profile.email && (
                  <li>
                    <button
                      className="link-button"
                      type="button"
                      onClick={copyEmail}
                    >
                      Copy my email address
                    </button>
                    <p
                      className="status"
                      role="status"
                      aria-label="Email copy status"
                    >
                      {emailStatus === "copied" && "Email address copied."}
                      {emailStatus === "failed" && (
                        <>
                          Copy wasn’t available. You can write to{" "}
                          <a href={mailto}>{profile.email}</a>.
                        </>
                      )}
                    </p>
                  </li>
                )}
              </ul>
            </div>

            <div className="contact-card">
              <fieldset className="reasons">
                <legend>I’d like to talk about</legend>
                <div className="reason-options">
                  {(
                    [
                      ["project", "A project"],
                      ["bug", "A bug"],
                      ["hello", "Something else"],
                    ] as const
                  ).map(([value, label]) => (
                    <label key={value}>
                      <input
                        type="radio"
                        name="contact-reason"
                        value={value}
                        checked={reason === value}
                        onChange={() => setReason(value)}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {isBug ? (
                <div className="reason-body">
                  <label className="brief-label" htmlFor="bug-brief">
                    Your bug report
                    <span>Optional. Edit it here or in your email.</span>
                  </label>
                  <textarea
                    id="bug-brief"
                    value={brief}
                    onChange={(event) => setBrief(event.target.value)}
                    spellCheck
                    rows={7}
                  />
                  <p className="helper">
                    Leave out passwords, access tokens, and private client data.
                  </p>
                </div>
              ) : (
                <div className="reason-body">
                  <h3>
                    {reason === "project"
                      ? "Let’s talk about your project."
                      : "Start a conversation."}
                  </h3>
                  <p>
                    {reason === "project"
                      ? "Tell me what you want to build or improve, your timeline, and any budget you have in mind. Volunteer opportunities are welcome too."
                      : "Have a question or an opportunity to share? Send me a message in your own words."}
                  </p>
                </div>
              )}

              <div className="actions contact-actions">
                <a className="button" href={draftEmail}>
                  {isBug ? "Email this report" : "Email me"} <Arrow />
                </a>
                <a
                  className="text-link"
                  href={gmail}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in Gmail instead <Arrow dir="↗" />
                </a>
              </div>
              <p className="helper">
                {isBug
                  ? "Your report opens as a draft. Review it before sending."
                  : "Your email opens as a blank draft."}
              </p>
              {isBug && (
                <>
                  <button
                    className="link-button"
                    type="button"
                    onClick={copyReport}
                  >
                    Copy the report instead
                  </button>
                  <p
                    className="status"
                    role="status"
                    aria-label="Report copy status"
                  >
                    {reportStatus}
                  </p>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer theme-navy">
        <div className="wrap footer-inner">
          <p suppressHydrationWarning>
            © {year} Abdulrhman Yaghi · Amman, Jordan
          </p>
          <div className="footer-links">
            {profile.linkedin && (
              <a
                className="text-link"
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn <Arrow dir="↗" />
              </a>
            )}
            <a className="text-link" href="#home">
              Back to top <Arrow dir="↑" />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
export default App;
