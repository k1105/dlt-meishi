"use client";
import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState(
    "これだけは譲れないルールを教えてください。"
  );
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer }),
      });

      console.log(response);

      const data = await response.json();
      console.log("🔹 **判断基準（原因）**:", data.judgment);
      console.log("🟢 **フォーマット（JSON）**:", data.jsonData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>デザインパターン生成</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <strong>質問：</strong>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
          />
        </label>
        <label>
          <strong>回答：</strong>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            style={{
              width: "100%",
              height: "100px",
              marginBottom: "10px",
              padding: "5px",
            }}
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "10px 20px" }}
        >
          {loading ? "生成中..." : "送信"}
        </button>
      </form>
    </div>
  );
}
