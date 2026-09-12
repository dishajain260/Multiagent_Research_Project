import { useState, useEffect } from "react";
import { getConversations } from "../api";
import ThemeToggle from "./ThemeToggle";

export default function ConversationSidebar({
  activeConversationId,
  onSelect,
  onNewChat,
  refreshKey,
  user,
  onLogout,
  isOpen,
  onToggle,
  onOpenLibrary,
  onGoHome,
  theme,
  onToggleTheme,
}) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadConversations() {
      setLoading(true);
      setError("");
      try {
        const data = await getConversations();
        if (!cancelled) setConversations(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadConversations();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const filteredConversations = conversations.filter((c) =>
    (c.title || "New research").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) {
    return (
      <div className="conversation-sidebar conversation-sidebar--closed">
        <button
          className="sidebar-toggle-btn"
          onClick={onToggle}
          title="Open Sidebar"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
          </svg>
        </button>
        <ThemeToggle
          theme={theme}
          onToggle={onToggleTheme}
          className="sidebar-theme-toggle"
        />
      </div>
    );
  }

  return (
    <div className="conversation-sidebar">
      <div className="sidebar-header">
        <div
          className="sidebar-logo"
          onClick={onGoHome}
          title="Return to Home Landing Page"
          style={{ cursor: "pointer" }}
        >
          <span className="synapse-logo-badge" style={{ width: "24px", height: "24px", fontSize: "0.85rem", marginRight: "0.5rem" }}>✦</span>
          <span>SYNAPSE<strong>DOCS</strong></span>
        </div>
        <button
          className="sidebar-toggle-btn"
          onClick={onToggle}
          title="Close Sidebar"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
          </svg>
        </button>
      </div>

      <div className="sidebar-actions">
        <button
          type="button"
          className="sidebar-home-link-btn"
          onClick={onGoHome}
          title="Back to Landing Page"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "0.5rem" }}>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Home Landing Page
        </button>
        <button type="button" className="new-chat-btn-dark" onClick={onNewChat}>
          <span
            style={{
              fontSize: "1.2rem",
              marginRight: "0.5rem",
              fontWeight: "400",
            }}
          >
            +
          </span>{" "}
          New Research
          <span className="shortcut-hint">⌘N</span>
        </button>
        <button
          type="button"
          className="sidebar-upload-btn"
          onClick={onOpenLibrary}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ marginRight: "0.5rem" }}
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <polyline points="9 15 12 12 15 15"></polyline>
          </svg>
          Document Library
        </button>
      </div>

      <div className="sidebar-conversations">
        <div style={{ padding: "0 1rem 0.5rem" }}>
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "0.45rem 0.75rem",
              fontSize: "0.8rem",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--ink)",
            }}
          />
        </div>

        <span className="sidebar-label">RESEARCH SESSIONS</span>
        {loading && (
          <p className="chat-empty-state" style={{ padding: "0 1rem" }}>
            Loading...
          </p>
        )}
        {error && (
          <div className="result-box error" style={{ margin: "0 1rem" }}>
            {error}
          </div>
        )}

        {!loading && !error && filteredConversations.length === 0 && (
          <p className="chat-empty-state" style={{ padding: "0 1rem" }}>
            {searchQuery ? "No matching sessions" : "No sessions yet."}
          </p>
        )}

        <ul className="conversation-list">
          {filteredConversations.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className={
                  "conversation-item" +
                  (c.id === activeConversationId
                    ? " conversation-item--active"
                    : "")
                }
                onClick={() => onSelect(c.id)}
                title={c.title || "Untitled session"}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    marginRight: "0.6rem",
                    flexShrink: 0,
                    opacity: 0.6,
                  }}
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span className="conversation-title-text">
                  {c.title || "New research"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {user && (
        <div className="sidebar-footer">
          <div className="sidebar-footer-toggle-row">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
          <div className="sidebar-footer-user-row">
            <div className="user-info">
              <div className="user-avatar">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <span className="user-email-text">{user.email}</span>
                <span className="user-status-text">
                  {user.is_guest ? "GUEST SESSION" : "AUTHENTICATED"}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="logout-icon-btn"
              onClick={onLogout}
              title="Log Out"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

