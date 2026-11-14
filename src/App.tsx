import { useState } from "react";
import { profile } from "./config";
import "./App.css";

const Arrow = () => <span aria-hidden="true">↗</span>;
const skills = [
  "PHP",
  "Laravel",
  "Python",
  "Django",
  "REST APIs",
  "SQL",
  "PostgreSQL",
  "Git",
];
const template =
  "Application / website:\nExpected behavior:\nWhat happens instead:\nSteps to reproduce:\nRecent changes:\nDeadline:";
type ContactReason = "bug" | "project" | "hello";

function App() {
  const [paused, setPaused] = useState(false);
  const [reason, setReason] = useState<ContactReason>("bug");
  const [brief, setBrief] = useState(template);
  const [copyStatus, setCopyStatus] = useState("");
  const [templateStatus, setTemplateStatus] = useState("");
  const generalEmail = `mailto:${profile.email}`;
  const gmailParams = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: profile.email,
  });
  if (reason === "bug") {
    gmailParams.set("su", "Bug report");
    gmailParams.set("body", brief);
  }
  const gmail = `https://mail.google.com/mail/?${gmailParams}`;
  const email =
    reason === "bug"
      ? `${generalEmail}?${new URLSearchParams({ subject: "Bug report", body: brief })}`
      : generalEmail;
  async function copy(text: string, target: "email" | "template") {
    const update = target === "email" ? setCopyStatus : setTemplateStatus;
    try {
      await navigator.clipboard.writeText(text);
      update(target === "email" ? "Email copied." : "Bug report copied.");
    } catch {
      update("Copy wasn’t available. Select the text and copy it manually.");
    }
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="wrap header-inner">
          <a className="brand" href="#home" aria-label="Abdulrhman Yaghi home">
            <img
              src={`${import.meta.env.BASE_URL}monogram.svg`}
              width="40"
              height="40"
              alt=""
            />
            <span>Abdulrhman Yaghi</span>
          </a>
          <nav aria-label="Main navigation">
            <a href="#work">Work</a>
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a
              className="nav-contact"
              href="#contact"
              onClick={() => setReason("hello")}
            >
              Contact <Arrow />
            </a>
          </nav>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        <section className="hero wrap" id="home" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Backend developer · Amman, Jordan</p>
            <h1 id="hero-title">
              I fix bugs in
              <br />
              web applications.
            </h1>
            <p className="hero-description">
              Broken APIs, login issues, database errors, or jobs that stop
              running. I trace the cause and verify the fix.
            </p>
            <div className="actions">
              <a
                className="button primary"
                href="#contact"
                onClick={() => setReason("bug")}
              >
                Tell me about your bug <Arrow />
              </a>
              <a className="text-link" href="#work">
                View my work <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="experience">
              Laravel is my strongest professional experience.
              <br />I also work with Python and Django.
            </p>
          </div>
          <aside
            className={`working-note ${paused ? "paused" : ""}`}
            aria-label="How I approach a bug"
          >
            <div className="note-top">
              <span className="mono">A closer look</span>
            </div>
            <h2>
              Follow the request.
              <br />
              Find where it breaks.
            </h2>
            <div
              className="request-flow"
              role="img"
              aria-label="Illustration: a request moves through the API, application logic, and database. A failed step is fixed and verified."
            >
              <div className="flow-track" />
              <span className="packet" />
              {["API", "Logic", "Database"].map((name, index) => (
                <div className={`flow-node node-${index}`} key={name}>
                  <span className="node-symbol" aria-hidden="true">
                    {["→", "{ }", "≡"][index]}
                  </span>
                  <span>{name}</span>
                </div>
              ))}
            </div>
            <p>
              Reproduce the issue, make a focused change, then check the
              affected workflow.
            </p>
            <div className="note-footer">
              <span>Illustrated request flow</span>
              <button
                type="button"
                aria-pressed={paused}
                onClick={() => setPaused(!paused)}
              >
                {paused ? "Play animation" : "Pause animation"}
              </button>
            </div>
          </aside>
        </section>
        <section className="skills-band" aria-label="Core skills">
          <div className="wrap skills-inner">
            <h2>My core stack</h2>
            <div
              className="stack-window"
              tabIndex={0}
              aria-label="Core skills. Hover or focus to stop scrolling."
            >
              <div className="stack-track">
                {[0, 1].map((group) => (
                  <div
                    className="stack-group"
                    key={group}
                    aria-hidden={group === 1 ? true : undefined}
                  >
                    {skills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section
          className="section wrap work-section"
          id="work"
          aria-labelledby="work-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">Selected work</p>
              <h2 id="work-title">See what I build.</h2>
            </div>
            <p>
              A working application, with source code
              <br className="desktop-break" /> and a walkthrough you can
              explore.
            </p>
          </div>
          <article className="project">
            <div className="project-overview">
              <div>
                <p className="project-type">
                  Laravel / Filament · Personal project
                </p>
                <h3>Stockroom</h3>
                <p className="project-description">
                  An inventory dashboard that keeps orders, stock, and sales
                  reports in sync.
                </p>
                <div className="actions project-actions">
                  {profile.stockroomPreview && (
                    <a
                      className="button secondary"
                      href={profile.stockroomPreview}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Explore demo & guide <Arrow />
                    </a>
                  )}
                  {profile.projects.stockroom && (
                    <a
                      className="text-link"
                      href={profile.projects.stockroom}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Source code <Arrow />
                    </a>
                  )}
                </div>
              </div>
              <ul className="project-outcomes">
                <li>Orders check stock before they are confirmed.</li>
                <li>Cancellations return stock exactly once.</li>
                <li>Private sales reports run in the background.</li>
              </ul>
            </div>
            <figure className="project-figure">
              <a
                href={profile.stockroomPreview}
                target="_blank"
                rel="noreferrer"
                aria-label="Explore the Stockroom dashboard demo"
              >
                <img
                  src={`${import.meta.env.BASE_URL}stockroom-dashboard.png`}
                  width="1440"
                  height="1000"
                  alt="Stockroom dashboard showing sales totals, recent orders, and low-stock products"
                  loading="lazy"
                />
              </a>
              <figcaption>
                <span>Actual application. Fictional demo data.</span>
                <span>The public preview includes a guide and video.</span>
              </figcaption>
            </figure>
            <details className="project-details">
              <summary>
                <span className="summary-label">What I built and tested</span>
                <span aria-hidden="true" />
              </summary>
              <div className="case-study">
                <div>
                  <h4>The goal</h4>
                  <p>
                    Give a small business one place to manage products,
                    customers, orders, and inventory.
                  </p>
                </div>
                <div>
                  <h4>My contribution</h4>
                  <p>
                    Built the dashboard, stock checks, order cancellation, role
                    permissions, activity history, and private queued CSV
                    reports.
                  </p>
                </div>
                <div>
                  <h4>What I verified</h4>
                  <p>
                    20 PHP tests and four browser tests cover key workflows,
                    permissions, report ownership, rollback, and two processes
                    competing for the last item in SQLite.
                  </p>
                  <p>
                    The full Laravel application runs locally. Setup
                    instructions and test details are in the repository.
                  </p>
                </div>
              </div>
            </details>
          </article>
        </section>
        <section
          className="section wrap ruled-section"
          id="services"
          aria-labelledby="services-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">How I can help</p>
              <h2 id="services-title">Start with what’s broken.</h2>
            </div>
            <p>
              You don’t need to know the cause.
              <br className="desktop-break" /> Tell me what you expected to
              happen.
            </p>
          </div>
          <div className="services-list">
            {[
              [
                "Application bug fixes",
                "Unexpected errors or a feature that stopped working. I reproduce the problem and trace it through the code.",
              ],
              [
                "APIs & authentication",
                "Failed requests, validation errors, login problems, and access issues between connected systems.",
              ],
              [
                "SQL & database issues",
                "Incorrect results, failed queries, and data relationships that don’t behave as expected.",
              ],
              [
                "Queues & deployments",
                "Laravel jobs that fail, reminders that never run, and configuration issues after a deployment.",
              ],
            ].map(([title, description], i) => (
              <article key={title}>
                <span className="service-number mono">0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section
          className="process-section"
          id="process"
          aria-labelledby="process-title"
        >
          <div className="wrap section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Working together</p>
                <h2 id="process-title">A clear path to a fix.</h2>
              </div>
            </div>
            <ol className="process-list">
              {[
                [
                  "Reproduce",
                  "Understand the expected behavior and the steps that trigger the issue.",
                ],
                [
                  "Trace",
                  "Follow the code, configuration, and data to find the root cause.",
                ],
                [
                  "Fix",
                  "Make a focused change that fits the existing application.",
                ],
                [
                  "Verify",
                  "Repeat the original steps and check the affected workflow.",
                ],
              ].map(([title, description], i) => (
                <li key={title}>
                  <span className="step-number mono">0{i + 1}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section
          className="section wrap about"
          id="about"
          aria-labelledby="about-title"
        >
          <div>
            <p className="eyebrow">A little about me</p>
            <h2 id="about-title">Hi, I’m Abdulrhman.</h2>
          </div>
          <div className="about-copy">
            <p>
              I’m a backend developer based in Amman, Jordan. My strongest
              professional experience is in Laravel, with practical Django
              experience from my bootcamp work.
            </p>
            <p>
              I like understanding how an existing system works, finding the
              cause of a problem, and making the fix easy to follow.
            </p>
            <p className="toolkit">
              Also worked with{" "}
              <strong>Filament, Docker, and Laravel Passport.</strong>
            </p>
            <a
              className="text-link"
              href="#contact"
              onClick={() => setReason("project")}
            >
              Hire me for a project or discuss a volunteer opportunity <Arrow />
            </a>
          </div>
        </section>
        <section
          className="contact-section"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="wrap section contact-layout">
            <div className="contact-intro">
              <p className="eyebrow">Get in touch</p>
              <h2 id="contact-title">What can I help with?</h2>
              <p>
                A short message is enough to start.
                <br />
                Tell me what you’re working on.
              </p>
              <div className="direct-contact">
                <a className="email-address" href={generalEmail}>
                  {profile.email}
                </a>
                <button
                  className="copy-email"
                  type="button"
                  onClick={() => copy(profile.email, "email")}
                >
                  Copy email
                </button>
                <p
                  className="copy-status"
                  role="status"
                  aria-label="Email copy status"
                >
                  {copyStatus}
                </p>
              </div>
              {profile.linkedin && (
                <a
                  className="text-link"
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  Connect on LinkedIn <Arrow />
                </a>
              )}
              <div className="profile-links">
                {[
                  ["Upwork", profile.upwork],
                  ["Mostaqel", profile.mostaqel],
                  ["GitHub", profile.github],
                ]
                  .filter(([, url]) => url)
                  .map(([label, url]) => (
                    <a
                      className="text-link"
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {label} <Arrow />
                    </a>
                  ))}
              </div>
            </div>
            <div className="contact-options">
              <fieldset className="contact-reasons">
                <legend>I’d like to discuss</legend>
                <div>
                  {(
                    [
                      ["bug", "A bug"],
                      ["project", "A project"],
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
              <div className="contact-content">
                {reason === "bug" ? (
                  <>
                    <label className="brief-label" htmlFor="bug-brief">
                      Your bug report{" "}
                      <span>Optional — edit it here or in your email</span>
                    </label>
                    <textarea
                      id="bug-brief"
                      value={brief}
                      onChange={(event) => setBrief(event.target.value)}
                      spellCheck
                      rows={7}
                    />
                    <p className="helper">
                      Leave out passwords, access tokens, and private client
                      data.
                    </p>
                  </>
                ) : (
                  <div className="general-note">
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
                    <p className="helper">Your email opens as a blank draft.</p>
                  </div>
                )}
                <div className="actions contact-actions">
                  <a
                    className="button primary"
                    href={gmail}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={
                      reason === "bug"
                        ? "Report a bug via Gmail"
                        : "Contact via Gmail"
                    }
                  >
                    Open Gmail <Arrow />
                  </a>
                  <a
                    className="text-link"
                    href={email}
                    aria-label={
                      reason === "bug"
                        ? "Report via my email app"
                        : "Use my email app"
                    }
                  >
                    Use my email app <Arrow />
                  </a>
                </div>
                <p className="helper draft-note">
                  {reason === "bug"
                    ? "Your report is added to a draft. Review it before sending."
                    : "Nothing is sent until you choose to send it."}
                </p>
                {reason === "bug" && (
                  <>
                    <button
                      className="copy-report"
                      type="button"
                      onClick={() => copy(brief, "template")}
                    >
                      Copy bug report instead
                    </button>
                    <p
                      className="copy-status"
                      role="status"
                      aria-label="Template copy status"
                    >
                      {templateStatus}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="wrap footer">
        <span>© {new Date().getFullYear()} Abdulrhman Yaghi</span>
        <span>Amman, Jordan</span>
        <a className="text-link" href="#home">
          Back to top <span aria-hidden="true">↑</span>
        </a>
      </footer>
    </>
  );
}
export default App;
