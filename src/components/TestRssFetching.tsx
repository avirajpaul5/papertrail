import { useEffect } from "react";
import { testRssFetching } from "../data/newsletterService";

export function TestRssFetching() {
  useEffect(() => {
    console.log("Running RSS fetch test...");
    testRssFetching();
  }, []);

  return (
    <div
      style={{ padding: "20px", background: "#f5f5f5", borderRadius: "8px" }}
    >
      <h2>RSS Fetch Test</h2>
      <p>Check the browser console for test results.</p>
      <button
        onClick={() => testRssFetching()}
        style={{
          padding: "10px 20px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Run Test Again
      </button>
    </div>
  );
}
