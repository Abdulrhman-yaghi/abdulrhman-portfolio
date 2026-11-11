import { useState } from "react";
import { profile } from "./config";
import "./App.css";
const Arrow = () => <span aria-hidden="true">↗</span>;
const projects = [
  {
    id: "dishly",
    title: "Dishly",
    type: "BOOTCAMP CAPSTONE · DJANGO",
    subtitle: "From ingredients to a working recipe app.",
    goal: "Build a recipe application as a Django bootcamp capstone.",
    contribution:
      "Worked on recipes, ingredients, categories, likes, and authentication with PostgreSQL.",
    verification:
      "These features describe the capstone scope. A test report or verified demo is not yet included.",
    tags: ["Python", "Django", "PostgreSQL"],
  },
  {
    id: "tasks",
    title: "Laravel Tasks API",
    type: "PERSONAL PROJECT · LARAVEL",
    subtitle: "A focused foundation for a task API.",
    goal: "Practice building task endpoints with clear request handling.",
    contribution:
      "Implemented task endpoints, request validation, and user registration.",
    verification:
      "The implementation scope is documented here. Reproduction steps and fix details for the DELETE-route issue are needed before presenting it as a debugging case study.",
    tags: ["REST API", "Validation", "Registration"],
  },
] as const;
function ProjectVisual({ id }: { id: string }) {
  return (
    <div
      className="project-visual"
      aria-label="Illustrative architecture diagram"
    >
      <div className="diagram-label">
        <span>{id === "dishly" ? "RELATIONSHIP MAP" : "REQUEST TRACE"}</span>
        <span>ILLUSTRATIVE</span>
      </div>
      {id === "dishly" ? (
        <div className="schema">
          <div>
            <b>recipes</b>
            <span>id · title</span>
            <span>category_id</span>
          </div>
          <span className="relation">↔</span>
          <div>
            <b>ingredients</b>
            <span>id · name</span>
            <span>recipe relation</span>
          </div>
        </div>
      ) : (
        <div className="trace">
          <div>
            <b>POST</b>
            <span>/tasks</span>
            <i>→</i>
          </div>
          <div>
            ◇<span>Validate request</span>
            <i>✓</i>
          </div>
          <div>
            ◇<span>Application logic</span>
            <i>✓</i>
          </div>
          <div>
            ◇<span>JSON response</span>
            <i>↗</i>
          </div>
        </div>
      )}
    </div>
  );
}
function App() {
  const [paused, setPaused] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const brief =
    "Application / website:\nExpected behavior:\nWhat happens instead:\nSteps to reproduce:\nRecent changes:\nDeadline:";
  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(brief);
      setCopyStatus("Template copied to clipboard.");
    } catch {
      setCopyStatus("Select and copy the template above.");
    }
  }
  const contactHref = "#contact";
  const generalEmail = `mailto:${profile.email}`;
  const bugEmail = `${generalEmail}?subject=${encodeURIComponent("Bug report")}&body=${encodeURIComponent(brief)}`;
  const gmailBase = "https://mail.google.com/mail/?";
  const generalGmail =
    gmailBase + new URLSearchParams({ view: "cm", fs: "1", to: profile.email });
  const bugGmail =
    gmailBase +
    new URLSearchParams({
      view: "cm",
      fs: "1",
      to: profile.email,
      su: "Bug report",
      body: brief,
    });
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="header wrap">
        <a className="brand" href="#home" aria-label="Abdulrhman Yaghi home">
          <img
            src={`${import.meta.env.BASE_URL}monogram.svg`}
            alt=""
            width="43"
            height="40"
          />
          <span>
            Abdulrhman Yaghi<small>BACKEND DEVELOPER</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#services">Services</a>
          <a href="#work">Work</a>
          <a href="#process">Process</a>
          <a className="nav-contact" href="#contact">
            Let’s talk <Arrow />
          </a>
        </nav>
      </header>
      <main id="main">
        <section className="hero wrap" id="home">
          <div>
            <div className="eyebrow">
              <span className="status-dot" /> BACKEND DEVELOPER · AMMAN, JORDAN
            </div>
            <h1>
              I fix bugs.
              <br />
              <span>You get back</span>
              <br />
              to building<span>.</span>
            </h1>
            <p className="hero-description">
              Broken APIs. Database errors. Login issues.
              <br />
              Background jobs that fail. Let’s find the cause
              <br className="desktop-break" /> and get your application working
              again.
            </p>
            <div className="actions">
              <a className="button primary" href={contactHref}>
                Tell me about your bug <Arrow />
              </a>
              <a className="text-link" href="#work">
                View my work ↓
              </a>
            </div>
            <p className="experience">
              ⌘ &nbsp; Laravel is my strongest professional experience.
            </p>
          </div>
          <div className={`hero-art ${paused ? "paused" : ""}`}>
            <div className="art-heading">
              <span>ANATOMY OF A FIX</span>
              <span>TRACE / 001</span>
            </div>
            <div
              className="scene"
              role="img"
              aria-label="Illustrative request flowing through an API, application logic and a database. An amber error resolves to teal."
            >
              <div className="scene-grid" />
              <div className="connection one" />
              <div className="connection two" />
              <div className="packet" />
              {[
                ["API", "REQUEST IN", "↗"],
                ["Application", "TRACE THE CAUSE", "</>"],
                ["Database", "FOLLOW THE DATA", "▤"],
              ].map(([title, label, icon], i) => (
                <div className={`stage stage-${i}`} key={title}>
                  <span className="stage-number">0{i + 1}</span>
                  <div className="stage-icon">{icon}</div>
                  <b>{title}</b>
                  <small>{label}</small>
                </div>
              ))}
              <span className="request-label">request → response</span>
            </div>
            <div className="terminal">
              <div>
                <span>❯</span> trace.request <em>--inspect</em>
              </div>
              <div className="terminal-result">
                <span className="status-dot" /> Root cause → fix → verified
                workflow <span>✓</span>
              </div>
            </div>
            <div className="art-footer">
              <span>ILLUSTRATIVE REQUEST FLOW</span>
              <button onClick={() => setPaused(!paused)} aria-pressed={paused}>
                {paused ? "Play animation ▷" : "Pause animation Ⅱ"}
              </button>
            </div>
          </div>
        </section>
        <div className="skills-band">
          <div className="wrap skills-inner">
            <span className="mono">MY CORE STACK</span>
            <div
              className="stack-window"
              tabIndex={0}
              role="region"
              aria-label="Core skills; hover or focus to pause scrolling"
            >
              <div className="stack-track">
                {[0, 1].map((copy) => (
                  <div
                    className="stack-group"
                    key={copy}
                    aria-hidden={copy === 1 ? true : undefined}
                  >
                    {[
                      "PHP",
                      "Laravel",
                      "Python",
                      "Django",
                      "REST APIs",
                      "SQL",
                      "PostgreSQL",
                      "Git",
                    ].map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <section className="section wrap" id="services">
          <div className="section-heading">
            <div>
              <div className="eyebrow">01 / HOW I CAN HELP</div>
              <h2>
                Something’s broken.
                <br />
                Let’s work through it.
              </h2>
            </div>
            <p>
              Focused help for existing applications.
              <br />A clear problem, a careful investigation,
              <br />
              and a fix you can understand.
            </p>
          </div>
          <div className="services-grid">
            {[
              [
                "{ }",
                "Application bug fixes",
                "Unexpected errors or a feature that stopped working? I reproduce the issue and trace it through your application.",
              ],
              [
                "↔",
                "APIs & authentication",
                "Broken endpoints, validation errors, login problems, and access issues across your API and authentication flows.",
              ],
              [
                "▤",
                "SQL & database problems",
                "Query errors, incorrect results, and relationship problems. I follow the data to understand where things go wrong.",
              ],
              [
                "⌁",
                "Queues & deployments",
                "Background jobs that fail, reminders that don’t run, and configuration issues that appear during deployment.",
              ],
            ].map(([icon, title, text], i) => (
              <article className="service" key={title}>
                <div className="service-top">
                  <span>{icon}</span>
                  <small>0{i + 1}</small>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="section work-section wrap" id="work">
          <div className="section-heading">
            <div>
              <div className="eyebrow">02 / SELECTED WORK</div>
              <h2>Behind the endpoints.</h2>
            </div>
            <p>
              Selected learning projects.
              <br />
              Practical Django experience.
              <br />
              Personal projects built to learn.
            </p>
          </div>
          <div className="projects-grid">
            {projects.map((p) => (
              <article className="project" key={p.id}>
                <ProjectVisual id={p.id} />
                <div className="project-body">
                  <div className="project-type">{p.type}</div>
                  <h3>{p.title}</h3>
                  <p>{p.subtitle}</p>
                  <div className="tags">
                    {p.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <details>
                    <summary>
                      Inside the project <span aria-hidden="true">+</span>
                    </summary>
                    <dl>
                      <dt>THE GOAL</dt>
                      <dd>{p.goal}</dd>
                      <dt>MY CONTRIBUTION</dt>
                      <dd>{p.contribution}</dd>
                      <dt>VERIFICATION STATUS</dt>
                      <dd>{p.verification}</dd>
                    </dl>
                  </details>
                  {profile.projects[p.id] && (
                    <a className="project-source" href={profile.projects[p.id]}>
                      View project <Arrow />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
          <p className="privacy-note">
            ◇ &nbsp; Professional work, shared with care. Internal URLs, logs,
            credentials, and client data stay private.
          </p>
        </section>
        <section className="process-section" id="process">
          <div className="section wrap">
            <div className="section-heading">
              <div>
                <div className="eyebrow">03 / THE DEBUGGING PROCESS</div>
                <h2>
                  Find the cause.
                  <br />
                  Fix the right thing.
                </h2>
              </div>
              <p>
                No guesswork dressed up as a solution.
                <br />
                Here’s how I approach your bug.
              </p>
            </div>
            <ol className="process-grid">
              {[
                [
                  "Reproduce the issue",
                  "Understand what should happen, what actually happens, and the steps that trigger the problem.",
                ],
                [
                  "Trace the root cause",
                  "Follow the request through code, configuration, and data to find where the behavior breaks.",
                ],
                [
                  "Implement the fix",
                  "Make a focused change that addresses the cause and fits the existing application.",
                ],
                [
                  "Verify the workflow",
                  "Repeat the original steps and check the affected workflow for expected behavior.",
                ],
              ].map(([title, text], i) => (
                <li key={title}>
                  <span className="step-number">0{i + 1}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section className="about section wrap">
          <div>
            <div className="eyebrow">THE DEVELOPER BEHIND THE FIX</div>
            <h2>
              Hi, I’m Abdulrhman<span className="accent">.</span>
            </h2>
            <p>
              I’m a backend developer based in Amman, Jordan. Laravel is where I
              have my strongest professional experience, with practical Django
              experience through my bootcamp capstone.
            </p>
            <p>
              I focus on understanding existing code, following the problem to
              its source, and making the affected workflow work as intended.
            </p>
          </div>
          <aside>
            <span className="mono">ALSO IN MY TOOLKIT</span>
            <div className="toolkit">
              {["Filament", "Docker", "Laravel Passport"].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <div className="location">
              <span className="status-dot" /> Amman, Jordan{" "}
              <span className="mono">UTC +03:00</span>
            </div>
          </aside>
        </section>
        <section className="contact wrap" id="contact">
          <div>
            <div className="eyebrow">04 / LET’S GET IT WORKING</div>
            <h2>
              Tell me about
              <br />
              your bug<span className="accent">.</span>
            </h2>
            <p>
              No technical brief needed. Tell me what stopped working.
              <br />A short message is enough to start.
            </p>
            <div className="contact-links">
              {profile.email && (
                <div className="email-option">
                  <h3>Just want to get in touch?</h3>
                  <p>Start a conversation with a blank message.</p>
                  <a className="email-address" href={generalEmail}>
                    {profile.email}
                  </a>
                  <div className="email-actions">
                    <a
                      className="button outline"
                      href={generalGmail}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Contact via Gmail <Arrow />
                    </a>
                    <a className="text-link" href={generalEmail}>
                      Use my email app ↗
                    </a>
                  </div>
                </div>
              )}
              {profile.linkedin && (
                <a
                  className="button outline"
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Connect on LinkedIn <Arrow />
                </a>
              )}
              {profile.upwork && (
                <a className="button outline" href={profile.upwork}>
                  Message on Upwork <Arrow />
                </a>
              )}
              {profile.mostaqel && (
                <a className="button outline" href={profile.mostaqel}>
                  Message on Mostaqel <Arrow />
                </a>
              )}
            </div>
            {!profile.email && !profile.upwork && !profile.mostaqel && (
              <p className="contact-pending">
                Found me on a freelance platform? Send me a message there with
                what’s broken. Direct contact links will be added here soon.
              </p>
            )}
          </div>
          <div className="brief">
            <div className="brief-title mono">
              REPORT A BUG <span>↙</span>
            </div>
            <p>
              Open a draft with this template already filled in. Add your
              details, then send it when you’re ready.
            </p>
            <pre>{brief}</pre>
            {profile.email && (
              <div className="email-actions report-actions">
                <a
                  className="button primary"
                  href={bugGmail}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Report a bug via Gmail <Arrow />
                </a>
                <a className="text-link" href={bugEmail}>
                  Report via my email app ↗
                </a>
              </div>
            )}
            <button className="copy-button" onClick={copyBrief}>
              Copy bug report template <span aria-hidden="true">⧉</span>
            </button>
            <p role="status">{copyStatus}</p>
            <p>
              Keep passwords, tokens, and private client data out of your
              initial message.
            </p>
          </div>
        </section>
      </main>
      <a className="quick-contact" href={contactHref}>
        Have a bug? Let’s talk <Arrow />
      </a>
      <footer className="footer wrap">
        <span>© {new Date().getFullYear()} Abdulrhman Yaghi</span>
        <span>Built with care. Debugged with patience.</span>
        <div>
          {profile.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn ↗
            </a>
          )}
          {profile.github && <a href={profile.github}>GitHub ↗</a>}
          <a href="#home">Back to top ↑</a>
        </div>
      </footer>
    </>
  );
}
export default App;
