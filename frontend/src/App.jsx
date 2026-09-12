import { useState, useCallback, useEffect } from "react";
import { useAuth } from "./context/useAuth";
import { getConversation } from "./api";
import CoverPage from "./components/CoverPage";
import AuthPage from "./components/AuthPage";
import GuestBanner from "./components/GuestBanner";
import UploadPanel from "./components/UploadPanel";
import ChatPanel from "./components/ChatPanel";
import ConversationSidebar from "./components/ConversationSidebar";
import EvaluationDashboard from "./components/EvaluationDashboard";
import ThemeToggle from "./components/ThemeToggle";
import "./App.css";

export default function App() {
  const { user, loading, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  const [lastUploadedFile, setLastUploadedFile] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [initialMessages, setInitialMessages] = useState([]);
  const [loadKey, setLoadKey] = useState(0);
  const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);
  const [loadingConversation, setLoadingConversation] = useState(false);

  // New UI states
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  // Theme: persisted in localStorage, falls back to the OS-level
  // preference on first visit if the user hasn't picked one yet.
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    const saved = window.localStorage.getItem("axiom-theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("axiom-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  // View mode: 'workspace' | 'home' | 'auth'
  const [viewMode, setViewMode] = useState("workspace");

  // On phones/small tablets, start with the sidebar collapsed so it
  // doesn't cover the whole screen on first load. Desktop keeps it open.
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, []);

  const handleSelectConversation = useCallback(async (id) => {
    setLoadingConversation(true);
    try {
      const data = await getConversation(id);
      setConversationId(data.id);
      setInitialMessages(data.messages);
      setLoadKey((k) => k + 1);
    } catch (err) {
      console.error("Failed to load conversation:", err.message);
      setConversationId(null);
      setInitialMessages([]);
      setLoadKey((k) => k + 1);
    } finally {
      setLoadingConversation(false);
    }
  }, []);

  const handleNewChat = useCallback(() => {
    setConversationId(null);
    setInitialMessages([]);
    setLoadKey((k) => k + 1);
  }, []);

  const handleConversationIdChange = useCallback((newId) => {
    setConversationId(newId);
  }, []);

  const handleMessageSent = useCallback(() => {
    setSidebarRefreshKey((k) => k + 1);
  }, []);

  // When user is authenticated (login, signup, guest demo), automatically make sure viewMode is 'workspace' and showAuth is false
  useEffect(() => {
    if (user && (viewMode === "auth" || showAuth)) {
      setShowAuth(false);
      setViewMode("workspace");
    }
  }, [user, viewMode, showAuth]);

  if (loading) {
    return (
      <div className="app">
        <p className="chat-empty-state">Loading SynapseDocs AI...</p>
      </div>
    );
  }

  // Not logged in: show either AuthPage or CoverPage
  if (!user) {
    if (viewMode === "auth" || showAuth) {
      return (
        <AuthPage
          onSuccess={() => {
            setShowAuth(false);
            setViewMode("workspace");
          }}
          onBack={() => {
            setShowAuth(false);
            setViewMode("home");
          }}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      );
    }
    return (
      <CoverPage
        onEnterWorkspace={() => {
          setShowAuth(true);
          setViewMode("auth");
        }}
        isLoggedIn={false}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  // Logged-in user explicitly clicked "Home / Landing"
  if (viewMode === "home") {
    return (
      <CoverPage
        onEnterWorkspace={() => {
          setViewMode("workspace");
        }}
        isLoggedIn={true}
        userEmail={user?.email}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  // Logged-in user in active research workspace
  return (
    <div className="app-dashboard">
      <GuestBanner />
      <div className="dashboard-layout">
        {sidebarOpen && (
          <div
            className="sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <ConversationSidebar
          activeConversationId={conversationId}
          onSelect={handleSelectConversation}
          onNewChat={handleNewChat}
          refreshKey={sidebarRefreshKey}
          user={user}
          onLogout={logout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onOpenLibrary={() => setRightPanelOpen(true)}
          onGoHome={() => setViewMode("home")}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <div className="dashboard-main">
          {/* Workspace Top Bar */}
          <div className="workspace-top-bar">
            <div className="workspace-top-left">
              {!sidebarOpen && (
                <button
                  type="button"
                  className="top-bar-icon-btn"
                  onClick={() => setSidebarOpen(true)}
                  title="Open Sidebar"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="3" x2="9" y2="21"></line>
                  </svg>
                </button>
              )}
              <button
                type="button"
                className="top-bar-home-btn"
                onClick={() => setViewMode("home")}
                title="Go to Home Landing Page"
              >
                <span className="synapse-logo-badge" style={{ width: "22px", height: "22px", fontSize: "0.8rem", marginRight: "0.4rem" }}>✦</span>
                <span className="top-bar-brand-name">SYNAPSE<strong>DOCS</strong></span>
                <span className="top-bar-badge">&larr; Home</span>
              </button>
              {lastUploadedFile && (
                <span className="scope-indicator-pill">
                  📄 {lastUploadedFile}
                </span>
              )}
            </div>

            <div className="workspace-top-right">
              <button
                type="button"
                className="top-bar-action-btn"
                onClick={() => setRightPanelOpen(true)}
                title="Document Library"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <polyline points="9 15 12 12 15 15"></polyline>
                </svg>
                <span>Documents</span>
              </button>
              <button
                type="button"
                className="top-bar-action-btn primary"
                onClick={handleNewChat}
                title="New Research Session"
              >
                <span>+ New</span>
              </button>
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>
          </div>

          {loadingConversation ? (
            <div className="chat-panel">
              <p className="chat-empty-state">Loading conversation...</p>
            </div>
          ) : (
            <ChatPanel
              documentScope={lastUploadedFile}
              conversationId={conversationId}
              initialMessages={initialMessages}
              loadKey={loadKey}
              onConversationIdChange={handleConversationIdChange}
              onMessageSent={handleMessageSent}
              onOpenLibrary={() => setRightPanelOpen(true)}
              onGoHome={() => setViewMode("home")}
            />
          )}
        </div>

        {rightPanelOpen && (
          <div
            className="library-backdrop"
            onClick={() => setRightPanelOpen(false)}
          />
        )}

        {rightPanelOpen && (
          <div className="library-panel">
            <div className="library-header">
              <div>
                <span className="library-label">§ LIBRARY</span>
                <h2 className="library-title">Your documents</h2>
              </div>
              <button
                className="library-close-btn"
                onClick={() => setRightPanelOpen(false)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <UploadPanel
              onUploadSuccess={(filename) => setLastUploadedFile(filename)}
            />

            {lastUploadedFile && (
              <div className="indexed-docs">
                <span className="indexed-label">INDEXED (1)</span>
                <div className="indexed-item">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ marginRight: "0.75rem", opacity: 0.5 }}
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  <div className="indexed-item-details">
                    <span className="indexed-item-name">
                      {lastUploadedFile}
                    </span>
                    <span className="indexed-item-meta">
                      Ready &middot; Just now
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="library-eval-wrapper">
              <EvaluationDashboard />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
