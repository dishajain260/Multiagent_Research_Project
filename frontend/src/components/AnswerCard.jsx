import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import AgentTracePanel from "./AgentTracePanel";
import CitationModal from "./CitationModal";

function getVerificationStatus(trace, critiquePassed) {
  const critiqueStep = [...(trace || [])]
    .reverse()
    .find((step) => step.node === "critique_node");

  // No critique step available
  if (!critiqueStep) {
    return {
      label: critiquePassed ? "Verified" : "Best effort — unverified",
      className: critiquePassed ? "accepted" : "unverified",
    };
  }

  const feedback = critiqueStep.critique_feedback || "";

  // Critique infrastructure failed, so the answer was accepted
  // without an actual verification verdict.
  const acceptedWithoutVerification =
    feedback.includes("critique service was unavailable") ||
    feedback.includes("critique output could not be processed") ||
    feedback.includes("critique context was too large") ||
    feedback.includes("critique did not complete");

  if (acceptedWithoutVerification) {
    return {
      label: "Accepted — not verified",
      className: "unverified",
    };
  }

  // Summary intentionally skips critique.
  if (
    feedback === "Summary generated through map-reduce summarization process"
  ) {
    return {
      label: "Summary generated",
      className: "accepted",
    };
  }

  // Actual successful critique
  if (critiquePassed) {
    return {
      label: "Critique Verified",
      className: "verified",
    };
  }

  // Actual critique failure
  return {
    label: "Best effort — unverified",
    className: "unverified",
  };
}

export default function AnswerCard({ result }) {
  const [selectedSource, setSelectedSource] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const { answer, critique_passed, revisions_taken, sources, trace } = result;

  const verificationStatus = getVerificationStatus(trace, critique_passed);

  const handleCopyAnswer = () => {
    navigator.clipboard.writeText(answer || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportBrief = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const sourceList = (sources || [])
      .map(
        (s, i) =>
          `### Source [${i + 1}]: ${s.source_file} (Page ${s.page_number})\n` +
          `- **Section:** ${s.section_header || "General"}\n` +
          `- **Type:** ${s.chunk_type || "text"}\n` +
          (s.score ? `- **Confidence Match:** ${(s.score * 100).toFixed(1)}%\n` : "") +
          `\n> ${s.text ? s.text.replace(/\n/g, "\n> ") : "N/A"}\n`
      )
      .join("\n");

    const content = `# SynapseDocs AI · Verified Research Report
Generated: ${new Date().toLocaleString()}
Verification Status: ${verificationStatus.label}
Revisions Taken: ${revisions_taken ?? 0}
Total Citations: ${(sources || []).length}

---

## 1. Executive Research Synthesis

${answer || ""}

---

## 2. Grounded Source Evidence & Citations

${sourceList || "No external citations recorded."}

---
*Report generated autonomously by SynapseDocs AI Multi-Agent Intelligence Platform.*
`;

    const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `synapsedocs-report-${timestamp}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="answer-card">
      {/* Top action header */}
      <div className="answer-card-header">
        <div className={`badge ${verificationStatus.className}`}>
          {verificationStatus.className === "verified" && "✓ "}
          {verificationStatus.label}
        </div>

        <div className="answer-card-actions">
          <button
            className="card-action-btn"
            onClick={handleCopyAnswer}
            title="Copy answer"
          >
            {copied ? "✓ Copied" : "Copy Answer"}
          </button>
          <button
            className="card-action-btn card-action-export"
            onClick={handleExportBrief}
            title="Export full research brief as Markdown"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export Brief
          </button>
        </div>
      </div>

      {/* Render Markdown answer */}
      <div className="answer-text">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {answer || ""}
        </ReactMarkdown>
      </div>

      {/* Revision metadata */}
      <div className="answer-footer-meta">
        <span className="meta-item">
          Revisions: <strong>{revisions_taken ?? 0}</strong>
        </span>
        {sources && (
          <span className="meta-item">
            Retrieved Chunks: <strong>{sources.length}</strong>
          </span>
        )}
      </div>

      {/* Interactive Sources Section */}
      {sources && sources.length > 0 && (
        <div className="sources">
          <div className="sources-header">
            <h4>Cited Sources & Evidence</h4>
            <span className="sources-hint">Click any source to inspect chunk text & scores</span>
          </div>

          <div className="sources-grid">
            {sources.map((source, index) => (
              <button
                key={index}
                className={`source-chip ${source.chunk_type === "table" ? "source-chip--table" : ""}`}
                onClick={() => setSelectedSource(source)}
                title="Inspect retrieved chunk text in detail"
              >
                <div className="source-chip-main">
                  <span className="source-chip-icon">
                    {source.chunk_type === "table" ? "📊" : "📄"}
                  </span>
                  <span className="source-chip-file">{source.source_file}</span>
                  <span className="source-chip-page">p. {source.page_number}</span>
                </div>
                <div className="source-chip-meta">
                  {source.score !== null && source.score !== undefined && (
                    <span className="source-chip-score">
                      {(source.score * 100).toFixed(0)}% match
                    </span>
                  )}
                  <span className="source-chip-inspect">Inspect ↗</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Agent execution trace */}
      <AgentTracePanel trace={trace} />

      {/* Interactive Citation Inspector Modal */}
      <CitationModal
        source={selectedSource}
        isOpen={Boolean(selectedSource)}
        onClose={() => setSelectedSource(null)}
      />
    </div>
  );
}
