// AuthPage.jsx
// Combined login/signup screen with instant demo trial access.

import { useState } from "react";
import { useAuth } from "../context/useAuth";
import ThemeToggle from "./ThemeToggle";
import "./AuthPage.css";

export default function AuthPage({ onSuccess, onBack, theme, onToggleTheme }) {
  const { login, signup, tryDemo } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setSubmitting(true);
    setError("");

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMode = () => {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setError("");
  };

  const handleTryDemo = async () => {
    setDemoLoading(true);
    setError("");
    try {
      await tryDemo();
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="auth-split-page">
      {/* Left Branding Panel */}
      <div className="auth-left">
        <div className="auth-left-top">
          {onBack && (
            <button type="button" onClick={onBack} className="back-link">
              &larr; BACK TO HOME
            </button>
          )}
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>

        <div className="auth-left-content">
          <div className="auth-badge-pill">RESEARCH PORTAL</div>
          <h1 className="auth-heading">
            Welcome to <span className="gradient-text">SynapseDocs</span>.
          </h1>
          <p className="auth-desc">
            An autonomous multi-agent intelligence workspace. Ingest documents,
            query structured tables, and get citation-backed answers with automated critique verification.
          </p>
          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <span className="check-icon">✓</span>
              <span>Table-aware chunking &amp; isolated vector retrieval</span>
            </div>
            <div className="auth-feature-item">
              <span className="check-icon">✓</span>
              <span>Self-correcting LangGraph critique loop</span>
            </div>
            <div className="auth-feature-item">
              <span className="check-icon">✓</span>
              <span>Persistent multi-user conversation history</span>
            </div>
          </div>
        </div>

        <div className="auth-left-footer">
          <span>SYNAPSEDOCS AI</span>
          <span>ENTERPRISE RESEARCH PLATFORM</span>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-logo">
            <span className="synapse-logo-badge">✦</span>
            <span>SYNAPSE<strong>DOCS</strong></span>
          </div>

          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${mode === "login" ? "active" : ""}`}
              onClick={() => { setMode("login"); setError(""); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab ${mode === "signup" ? "active" : ""}`}
              onClick={() => { setMode("signup"); setError(""); }}
            >
              Create Account
            </button>
          </div>

          <h2 className="auth-title">
            {mode === "login" ? "Sign in to workspace" : "Create your account"}
          </h2>
          <p className="auth-subtitle">
            {mode === "login"
              ? "Access your indexed documents and research history."
              : "Set up your private research intelligence library."}
          </p>

          <form onSubmit={handleSubmit} className="auth-form-styled">
            <div className="input-group">
              <label htmlFor="auth-email">EMAIL ADDRESS</label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="auth-password">PASSWORD</label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                required
              />
            </div>

            {error && (
              <div className="result-box error auth-error">{error}</div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="auth-submit-btn"
            >
              {submitting
                ? mode === "login"
                  ? "Signing in..."
                  : "Creating account..."
                : mode === "login"
                  ? "Sign in to Workspace →"
                  : "Create Account →"}
            </button>
          </form>

          <div className="demo-divider">
            <span>OR TRY WITHOUT SIGNUP</span>
          </div>

          <button
            type="button"
            onClick={handleTryDemo}
            disabled={demoLoading}
            className="demo-btn"
          >
            {demoLoading ? "⏳ Creating demo session..." : "🚀 Launch Instant Demo"}
          </button>
          <p className="demo-note">
            Instant 24-hour workspace &bull; Upload documents &bull; Full multi-agent access
          </p>

          <p className="auth-toggle-text">
            {mode === "login" ? "Don't have an account yet? " : "Already have an account? "}
            <button
              type="button"
              className="auth-toggle-inline"
              onClick={toggleMode}
            >
              {mode === "login" ? "Create one here" : "Sign in here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

