import React from "react";
import BB8Toggle from "./BB8Toggle";
import "./CoverPage.css";

const TICKER_ITEMS = [
  "AXIOM RAG",
  "MULTI-AGENT RETRIEVAL",
  "TABLE-AWARE CHUNKING",
  "SELF-CORRECTING CRITIQUE",
  "ZERO-DRIFT PERSISTENCE",
  "CITED EVIDENCE",
  new Date()
    .toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase(),
  "AUTONOMOUS RESEARCH",
];

export default function CoverPage({ onEnterWorkspace, theme, onToggleTheme }) {
  const tickerText = TICKER_ITEMS.join(" \u00B7 ") + " \u00B7 ";

  return (
    <div className="cover-page">
      <nav className="cover-nav">
        <div className="cover-logo">
          <span className="axiom-logo-mark">▲</span> AXIOM / RAG
        </div>
        <div className="cover-links">
          <a href="#agents">AGENTS</a>
          <a href="#workflow">WORKFLOW</a>
          <a href="#manifesto">MANIFESTO</a>
        </div>
        <div className="cover-nav-actions">
          <BB8Toggle theme={theme} onToggle={onToggleTheme} size="sm" />
          <button className="cover-btn-dark" onClick={onEnterWorkspace}>
            Enter Workspace &rarr;
          </button>
        </div>
      </nav>

      <div className="cover-ticker">
        <div className="ticker-track">
          {[0, 1, 2, 3].map((i) => (
            <span key={i}>{tickerText}</span>
          ))}
        </div>
      </div>

      <main className="cover-main">
        <section className="hero-section">
          <div className="hero-content">
            <span className="section-label">
              AUTONOMOUS RESEARCH &amp; VERIFICATION ENGINE
            </span>
            <h1 className="hero-title">
              Read <span className="italic-serif">everything.</span>
              <br />
              Verify <span className="italic-serif underline">anything.</span>
            </h1>
            <p className="hero-description">
              Axiom RAG is an autonomous multi-agent document research assistant.
              It coordinates specialized agent nodes to parse structured tables,
              perform isolated vector retrieval, and execute an automated
              critique-and-retry loop to deliver cited, verified answers.
            </p>
            <div className="hero-actions">
              <button
                className="cover-btn-dark large"
                onClick={onEnterWorkspace}
              >
                Start Researching &rarr;
              </button>
              <button className="cover-link-btn" onClick={onEnterWorkspace}>
                OR SIGN IN &rarr;
              </button>
            </div>
          </div>
          <div className="hero-illustration">
            <div className="illustration-placeholder">
              <img
                src="/reading-room.png"
                alt="The Reading Room"
                className="reading-room-img"
              />
              <div className="illustration-caption">
                <span>FIG. 01</span>
                <span>AUTONOMOUS RESEARCH LAB</span>
              </div>
            </div>
          </div>
        </section>

        <section id="agents" className="features-section">
          <div className="feature-card">
            <span className="feature-label">AGENT 01 &middot; REWRITE &amp; PLANNING</span>
            <div className="feature-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h3 className="feature-title">Context Planner</h3>
            <p className="feature-desc">
              Resolves conversational follow-ups and pronoun drift into standalone search vectors.
            </p>
          </div>
          <div className="feature-card border-left border-right">
            <span className="feature-label">AGENT 02 &middot; TABLE &amp; VECTOR RETRIEVAL</span>
            <div className="feature-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="14" y="14" width="4" height="4" />
                <rect x="6" y="14" width="4" height="4" />
                <rect x="10" y="6" width="4" height="4" />
                <path d="M12 10v4" />
                <path d="M8 14v-2h8v2" />
              </svg>
            </div>
            <h3 className="feature-title">Precision Retriever</h3>
            <p className="feature-desc">
              Executes isolated vector searches in Qdrant with table-aware chunking and scroll scans.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-label">AGENT 03 &middot; SYNTHESIS &amp; CRITIQUE</span>
            <div className="feature-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M13 8H7" />
                <path d="M17 12H7" />
              </svg>
            </div>
            <h3 className="feature-title">Verifier &amp; Editor</h3>
            <p className="feature-desc">
              Synthesizes cited answers and tests claims against strict JSON schemas before returning.
            </p>
          </div>
        </section>

        <section id="workflow" className="workflow-section">
          <div className="workflow-header">
            <span className="section-label">&sect; 02 - THE WORKFLOW</span>
            <h2 className="workflow-title">
              Deep research with verified
              <br />
              accountability.
            </h2>
          </div>
          <div className="workflow-grid">
            <div className="workflow-step">
              <div className="step-number">01</div>
              <h4 className="step-title">Ingest &amp; Structure</h4>
              <p className="step-desc">
                Drop in PDFs. Axiom extracts text, identifies tables cleanly by row, and embeds with ONNX.
              </p>
            </div>
            <div className="workflow-step">
              <div className="step-number">02</div>
              <h4 className="step-title">Multi-Agent Reasoning</h4>
              <p className="step-desc">
                Specialized agents rewrite queries, retrieve scoped vectors, and synthesize answers.
              </p>
            </div>
            <div className="workflow-step">
              <div className="step-number">03</div>
              <h4 className="step-title">Critique &amp; Self-Correction</h4>
              <p className="step-desc">
                The critique node fact-checks every claim. Weak answers trigger widening retries automatically.
              </p>
            </div>
          </div>
        </section>

        <section id="manifesto" className="manifesto-section">
          <span className="section-label manifesto-label">
            &sect; 03 - MANIFESTO
          </span>
          <div className="manifesto-content">
            <h2 className="manifesto-quote">
              “Knowledge shouldn't rely on blind faith.
              <br />
              <span style={{ color: "#D93025" }}>
                We engineered Axiom so every single claim comes with verifiable
                <br />
                citations and deterministic evidence &mdash; bridging the gap between<br />
                hallucinations and true research.”
              </span>
            </h2>
            <div className="manifesto-author">
              <span className="author-star">✧</span> AXIOM RESEARCH LABS
            </div>
          </div>
        </section>
      </main>

      <footer className="cover-footer">
        <div className="footer-left">
          &copy; 2026 Axiom RAG &middot; Autonomous Research Systems
        </div>
        <div className="footer-right">
          <button className="cover-link-btn" onClick={onEnterWorkspace}>
            ENTER WORKSPACE &rarr;
          </button>
        </div>
      </footer>
    </div>
  );
}
