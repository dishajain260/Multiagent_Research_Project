import React from "react";
import ThemeToggle from "./ThemeToggle";
import "./CoverPage.css";

const TICKER_ITEMS = [
  "SYNAPSEDOCS AI",
  "LANGGRAPH MULTI-AGENT",
  "TABLE-AWARE CHUNKING",
  "SELF-CORRECTING CRITIQUE",
  "ISOLATED VECTOR SEARCH",
  "EVIDENCE-BACKED CITATIONS",
  "AUTONOMOUS RESEARCH",
];

export default function CoverPage({
  onEnterWorkspace,
  isLoggedIn = false,
  userEmail = "",
  theme,
  onToggleTheme,
}) {
  const tickerText = TICKER_ITEMS.join(" \u2022 ") + " \u2022 ";

  return (
    <div className="cover-page">
      {/* Navigation */}
      <nav className="cover-nav">
        <div className="cover-logo" onClick={onEnterWorkspace} style={{ cursor: "pointer" }}>
          <span className="synapse-logo-badge">✦</span>
          <span className="cover-logo-text">
            SYNAPSE<strong>DOCS</strong>
          </span>
          <span className="cover-version-pill">v2.0</span>
        </div>
        <div className="cover-links">
          <a href="#agents">Architecture</a>
          <a href="#workflow">Pipeline</a>
          <a href="#benchmarks">Benchmarks</a>
        </div>
        <div className="cover-nav-actions">
          {isLoggedIn && (
            <span className="signed-in-user-pill">
              ● {userEmail}
            </span>
          )}
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button className="cover-btn-primary" onClick={onEnterWorkspace}>
            {isLoggedIn ? "Open Workspace →" : "Launch Workspace →"}
          </button>
        </div>
      </nav>

      {/* Marquee Ticker */}
      <div className="cover-ticker">
        <div className="ticker-track">
          {[0, 1, 2, 3].map((i) => (
            <span key={i}>{tickerText}</span>
          ))}
        </div>
      </div>

      <main className="cover-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="pulse-dot"></span>
              AUTONOMOUS MULTI-AGENT DOCUMENT INTELLIGENCE
            </div>
            <h1 className="hero-title">
              Deep research across complex documents with{" "}
              <span className="gradient-text">verified precision.</span>
            </h1>
            <p className="hero-description">
              SynapseDocs AI orchestrates specialized autonomous agents through
              LangGraph to parse structured tables, execute isolated vector
              retrieval in Qdrant, and run automated critique-and-retry loops
              for hallucination-free answers with verifiable citations.
            </p>
            <div className="hero-actions">
              <button
                className="cover-btn-primary large"
                onClick={onEnterWorkspace}
              >
                {isLoggedIn ? "Return to Active Workspace →" : "Start Researching →"}
              </button>
              <button
                className="cover-btn-secondary large"
                onClick={onEnterWorkspace}
              >
                {isLoggedIn ? "View Document Sessions" : "Sign In / Demo Access"}
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">0.954</span>
                <span className="stat-label">Faithfulness Score</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Context Recall</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">4 Agents</span>
                <span className="stat-label">Self-Correcting Graph</span>
              </div>
            </div>
          </div>
        </section>

        {/* Multi-Agent Architecture Section */}
        <section id="agents" className="features-section">
          <div className="section-header-centered">
            <span className="section-pill">MULTI-AGENT TOPOLOGY</span>
            <h2 className="section-heading">
              Four specialized agents working in unison.
            </h2>
            <p className="section-subheading">
              Every query is routed through a resilient LangGraph state machine
              designed to self-correct retrieval gaps.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-top">
                <span className="feature-badge">01</span>
                <span className="feature-model">Groq LLaMA 3.1</span>
              </div>
              <h3 className="feature-title">Query Rewriter</h3>
              <p className="feature-desc">
                Disambiguates follow-ups and resolves conversational pronouns
                into standalone vector search queries using prior turns.
              </p>
            </div>

            <div className="feature-card highlight-card">
              <div className="feature-top">
                <span className="feature-badge">02</span>
                <span className="feature-model">FastEmbed ONNX</span>
              </div>
              <h3 className="feature-title">Precision Retriever</h3>
              <p className="feature-desc">
                Performs filtered vector search in Qdrant with table-aware row
                preservation and multi-tenant data isolation.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-top">
                <span className="feature-badge">03</span>
                <span className="feature-model">GPT OSS 120B</span>
              </div>
              <h3 className="feature-title">Synthesis Engine</h3>
              <p className="feature-desc">
                Generates comprehensive answers grounded strictly in retrieved
                passages with exact page number citations.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-top">
                <span className="feature-badge">04</span>
                <span className="feature-model">JSON Schema Verifier</span>
              </div>
              <h3 className="feature-title">Critique &amp; Retry Loop</h3>
              <p className="feature-desc">
                Audits claims against retrieved text. If completeness fails, it
                widens search parameters and retries automatically.
              </p>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section id="workflow" className="workflow-section">
          <div className="section-header-centered">
            <span className="section-pill">SYSTEM WORKFLOW</span>
            <h2 className="section-heading">How SynapseDocs Processes Documents</h2>
          </div>
          <div className="workflow-grid">
            <div className="workflow-step">
              <div className="step-circle">01</div>
              <h4 className="step-title">Ingest &amp; Extract</h4>
              <p className="step-desc">
                Extracts PDF text and complex tables by row, preserving column
                headers across chunk boundaries.
              </p>
            </div>
            <div className="workflow-step">
              <div className="step-circle">02</div>
              <h4 className="step-title">Embed &amp; Isolate</h4>
              <p className="step-desc">
                Embeds with ONNX Runtime and indexes points with deterministic
                user-ownership tags.
              </p>
            </div>
            <div className="workflow-step">
              <div className="step-circle">03</div>
              <h4 className="step-title">Synthesize &amp; Verify</h4>
              <p className="step-desc">
                Generates answers and runs fact-checking. Every claim is
                linked directly to its source chunk.
              </p>
            </div>
          </div>
        </section>

        {/* Benchmarks Section */}
        <section id="benchmarks" className="benchmarks-section">
          <div className="benchmarks-card">
            <div className="benchmarks-text">
              <span className="section-pill">RAGAS EVALUATION SUITE</span>
              <h2 className="benchmarks-title">Engineered for Zero Hallucinations</h2>
              <p className="benchmarks-desc">
                Tested against multi-hop question sets and negative control tests
                to guarantee grounded facts and verifiable source evidence.
              </p>
            </div>
            <div className="benchmarks-grid">
              <div className="bench-box">
                <span className="bench-val">0.954</span>
                <span className="bench-lbl">Faithfulness</span>
              </div>
              <div className="bench-box">
                <span className="bench-val">0.795</span>
                <span className="bench-lbl">Answer Relevancy</span>
              </div>
              <div className="bench-box">
                <span className="bench-val">0.724</span>
                <span className="bench-lbl">Context Precision</span>
              </div>
              <div className="bench-box">
                <span className="bench-val">1.000</span>
                <span className="bench-lbl">Context Recall</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="cover-footer">
        <div className="footer-left">
          &copy; 2026 SynapseDocs AI &middot; Created by Disha Jain &middot; Autonomous Research Platform
        </div>
        <div className="footer-right">
          <button className="cover-btn-secondary" onClick={onEnterWorkspace}>
            Launch Workspace &rarr;
          </button>
        </div>
      </footer>
    </div>
  );
}

