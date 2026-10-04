import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function App() {
  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [solution, setSolution] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    const description = problem.trim();
    if (!description || loading) return;

    setLoading(true);
    setError("");
    setSolution(null);

    try {
      const response = await fetch("/.netlify/functions/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem: description }),
        signal: AbortSignal.timeout(55000),
      });
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("The solver is unavailable. Please try again shortly.");
      }
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Unable to get a solution. Please try again.");
      }
      if (
        typeof result.summary !== "string" ||
        !Array.isArray(result.steps) ||
        result.steps.length === 0 ||
        !result.steps.every((step) => typeof step === "string") ||
        typeof result.warning !== "string" ||
        !["ai", "fallback"].includes(result.source)
      ) {
        throw new Error("The solver returned an unexpected answer. Please try again.");
      }
      setSolution(result);
    } catch (requestError) {
      setError(
        requestError.name === "TimeoutError" || requestError.name === "AbortError"
          ? "This request took too long. Please try again."
          : requestError instanceof TypeError
            ? "Could not connect to the solver. Check your connection and try again."
            : requestError.message || "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="UTIS-X home">UTIS<span>—X</span></a>
        <span className="header-note">Your everyday tech troubleshooter</span>
      </header>
      <main>
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow">A little clarity goes a long way</p>
          <h1 id="page-title">Tech trouble?<br /><span>Start here.</span></h1>
          <p className="intro-copy">From stubborn Wi-Fi to confusing settings, describe what’s happening. Get practical steps to help you move forward.</p>
          <p className="privacy-note">Leave out passwords, account numbers, and other private information.</p>
        </section>
        <section className="workspace" aria-label="Technology problem solver">
          <form onSubmit={handleSubmit}>
            <label htmlFor="problem">What’s not working?</label>
            <p className="field-help" id="problem-help">Include your device, app, any error message, and what you’ve already tried.</p>
            <textarea
              id="problem"
              name="problem"
              aria-describedby="problem-help character-count"
              placeholder="For example: My laptop connects to Wi-Fi, but websites won’t load. My phone works on the same network…"
              value={problem}
              onChange={(event) => setProblem(event.target.value)}
              maxLength={4000}
              required
              disabled={loading}
            />
            <div className="form-footer">
              <span id="character-count">{problem.length.toLocaleString()} / 4,000</span>
              <button type="submit" disabled={loading || !problem.trim()}>{loading ? "Working through it…" : "Find a way forward"}<span aria-hidden="true">↗</span></button>
            </div>
          </form>
          {error && <div className="error-message" role="alert">{error}</div>}
          <div aria-live="polite" aria-busy={loading}>
            {loading && <div className="loading-state" role="status"><p>Looking for useful next steps…</p><div /><div /><div /></div>}
            {solution && (
              <section className="solution" aria-labelledby="solution-title">
                <p className="eyebrow">{solution.source === "fallback" ? "General troubleshooting · AI is unavailable" : "Your troubleshooting guide"}</p>
                <h2 id="solution-title">{solution.summary}</h2>
                <ol>{solution.steps.map((step, index) => <li key={index}>{step}</li>)}</ol>
                {solution.warning && <p className="solution-warning">{solution.warning}</p>}
              </section>
            )}
          </div>
        </section>
      </main>
      <footer>Guidance, not a guarantee. Back up important data before making changes.</footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<React.StrictMode><App /></React.StrictMode>);
