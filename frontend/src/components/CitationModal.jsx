import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function CitationModal({ source, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("child"); // "child" | "parent"
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !source) return null;

  const displayText =
    activeTab === "child"
      ? source.text || source.parent_text || "No snippet text available."
      : source.parent_text || source.text || "No parent context available.";

  const handleCopy = () => {
    navigator.clipboard.writeText(displayText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="citation-modal-backdrop" onClick={onClose}>
      <div
        className="citation-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="citation-modal-header">
          <div className="citation-modal-title-wrap">
            <span className="citation-modal-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              {source.source_file || "Source Document"}
            </span>
            <h3 className="citation-modal-heading">
              Page {source.page_number ?? "N/A"} &middot; {source.section_header || "General Section"}
            </h3>
          </div>

          <button
            className="citation-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Metadata Badges */}
        <div className="citation-modal-meta">
          <span className={`meta-pill ${source.chunk_type === "table" ? "pill-table" : "pill-text"}`}>
            {source.chunk_type === "table" ? "📊 Table Chunk" : "📄 Prose Chunk"}
          </span>

          {source.score !== null && source.score !== undefined && (
            <span className="meta-pill pill-score">
              Cosine Score: {(source.score * 100).toFixed(1)}%
            </span>
          )}

          {source.section_header && (
            <span className="meta-pill pill-section">
              § {source.section_header}
            </span>
          )}
        </div>

        {/* Toggle Tabs */}
        <div className="citation-modal-tabs">
          <button
            className={`modal-tab-btn ${activeTab === "child" ? "active" : ""}`}
            onClick={() => setActiveTab("child")}
          >
            Retrieved Match ({source.chunk_type === "table" ? "Table Slice" : "Chunk"})
          </button>
          <button
            className={`modal-tab-btn ${activeTab === "parent" ? "active" : ""}`}
            onClick={() => setActiveTab("parent")}
          >
            Full Parent Context (LLM Context)
          </button>

          <button
            className="citation-copy-btn"
            onClick={handleCopy}
            title="Copy text snippet"
          >
            {copied ? "✓ Copied" : "Copy Snippet"}
          </button>
        </div>

        {/* Snippet Body */}
        <div className="citation-modal-body">
          <div className="citation-markdown-view">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {displayText}
            </ReactMarkdown>
          </div>
        </div>

        {/* Footer */}
        <div className="citation-modal-footer">
          <span className="citation-footer-hint">
            Directly retrieved from Qdrant vector store with user isolation.
          </span>
          <button className="citation-btn-primary" onClick={onClose}>
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
