import MeishiOmoteSketch from "@/components/MeishiOmoteSketch";
import MeishiUraSketch from "@/components/MeishiUraSketch";
import Image from "next/image";
import { useState } from "react";
import PhoneInput from "@/components/PhoneInput"; // 追加
import styles from "./Home.module.css";

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
    "好きな作品やデザインの画像を入れてください。"
  );
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [secondRoll, setSecondRoll] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // 電話番号を格納
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [judgment, setJudgment] = useState("");
  const [meishiData, setMeishiData] = useState<DisplayData>({
    position: { x: 200, y: 100 },
    size: "m",
    grid: { type: "perspective", detailedness: 5 },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!preview) {
      alert("画像を選択してください。");
      setLoading(false);
      return;
    }

    try {
      const base64Image = preview.split(",")[1];

      const requestData = {
        name,
        roll,
        secondRoll,
        email,
        phoneNumber, // ここで国コード付きの番号を送信
        image: base64Image,
      };

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
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
          <strong>名前（英語表記）：</strong>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.toUpperCase())}
            style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
          />
        </label>
        <label>
          <strong>第１ビジネスタイトル：</strong>
          <input
            type="text"
            value={roll}
            onChange={(e) => setRoll(e.target.value.toUpperCase())}
            style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
          />
        </label>
        <label>
          <strong>第２ビジネスタイトル：</strong>
          <input
            type="text"
            value={secondRoll}
            onChange={(e) => setSecondRoll(e.target.value.toUpperCase())}
            style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
          />
        </label>
        <label>
          <strong>メールアドレス：</strong>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
          />
        </label>

        {/* 電話番号入力コンポーネント */}
        <PhoneInput setPhoneNumber={setPhoneNumber} />

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
          <strong>画像をアップロード：</strong>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const reader = new FileReader();
              reader.onload = () => {
                setPreview(reader.result as string);
              };
              reader.readAsDataURL(file);
            }}
            style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
          />
        </label>

        {preview && (
          <div>
            <strong>プレビュー：</strong>
            <div style={{ position: "relative", height: "300px" }}>
              <Image
                src={preview}
                alt="選択した画像"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={
            loading || !roll || !name || !email || !phoneNumber || !preview
          }
          style={{ height: "2rem", padding: "2px 20px", marginRight: "10px" }}
        >
          {loading ? "生成中..." : "送信"}
        </button>
      </form>

      <div className={styles.sketchContainer}>
        <MeishiOmoteSketch
          data={{ name, roll, secondRoll, tel: phoneNumber, email }}
        />
        <MeishiUraSketch data={meishiData} />
      </div>

      {judgment && (
        <div style={{ marginTop: "1rem", width: "100%" }}>
          <h3>判断基準</h3>
          <p style={{ fontSize: "0.8rem" }}>{judgment}</p>
        </div>
      )}
    </div>
  );
}
