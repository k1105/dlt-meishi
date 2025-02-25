import MeishiSketch from "@/components/MeishiSketch";
import { useState } from "react";

interface DisplayData {
  position: {
    x: number;
    y: number;
  };
  size: string;
  grid: {
    type: string;
    detailedness: number;
  };
}

export default function Home() {
  const [question, setQuestion] = useState(
    "これだけは譲れないルールを教えてください。"
  );
  const [roll, setRoll] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const [judgment, setJudgment] = useState("");

  // ❶ data を useMemo で安定化させる
  // 依存配列を空 ([]) にすると、初回だけ生成され、再レンダリングでも同じオブジェクトが返る
  const [meishiData, setMeishiData] = useState<DisplayData>({
    position: { x: 200, y: 100 },
    size: "m",
    grid: { type: "perspective", detailedness: 5 },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer, roll }),
      });

      const data = await response.json();
      setJudgment(data.judgment);
      if (data.jsonData) setMeishiData(data.jsonData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <form onSubmit={handleSubmit}>
        <label>
          <strong>ビジネスタイトル：</strong>
          <input
            type="text"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
            style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
          />
        </label>
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
          disabled={loading || !roll || !question || !answer}
          style={{ padding: "10px 20px", marginRight: "10px" }}
        >
          {loading ? "生成中..." : "送信"}
        </button>
        <button disabled={true} style={{ padding: "10px 20px" }}>
          SVG出力 (未実装)
        </button>
      </form>

      {/* ❷ 安定化した meishiData を渡す */}
      <MeishiSketch data={meishiData} />

      {judgment && (
        <div style={{ marginTop: "1rem", width: "100%" }}>
          <h3>判断基準</h3>
          <p style={{ fontSize: "0.8rem" }}>{judgment}</p>
        </div>
      )}
    </div>
  );
}
