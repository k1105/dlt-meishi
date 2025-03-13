import MeishiOmoteSketch from "@/components/MeishiOmoteSketch";
import MeishiUraSketch from "@/components/MeishiUraSketch";
import Image from "next/image";
import { useState } from "react";
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
  const [tel, setTel] = useState("");
  const [preview, setPreview] = useState<string | null>(null); // リサイズ後のBase64を保持
  const [loading, setLoading] = useState(false);
  const [judgment, setJudgment] = useState("");
  const [meishiData, setMeishiData] = useState<DisplayData>({
    position: { x: 200, y: 100 },
    size: "m",
    grid: { type: "perspective", detailedness: 5 },
  });

  /**
   * ▼ 画像アップロード時の処理
   *   - FileReader で一度画像を読み込み
   *   - 生成した <img> にロード完了イベントを仕掛ける
   *   - Canvas に描画＆リサイズ → toDataURL() でJPEGに圧縮
   *   - 出来上がったBase64を preview にセット
   */

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      // ★ ここを new Image() ではなく、document.createElement('img') にする
      const img = document.createElement("img");

      img.onload = () => {
        // ここにリサイズ処理
        const maxSize = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setPreview(dataUrl);
        }
      };

      // FileReader で読み込んだ base64 データを img の src に設定
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  /**
   * ▼ 送信処理
   *   - preview に既にリサイズ後の base64 が入っている
   *   - "data:image/jpeg;base64," の余分な部分を split で取り除き、API へ送信
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!preview) {
      alert("画像を選択してください。");
      setLoading(false);
      return;
    }

    try {
      // "data:image/jpeg;base64,xxxx..." から base64 部分のみ取り出し
      const base64Image = preview.split(",")[1];

      const requestData = {
        question,
        roll,
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
        <label>
          <strong>電話番号：</strong>
          <input
            type="text"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
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
          <strong>画像をアップロード：</strong>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
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
          disabled={loading || !roll || !question || !preview}
          style={{ height: "2rem", padding: "2px 20px", marginRight: "10px" }}
        >
          {loading ? "生成中..." : "送信"}
        </button>
      </form>
      <div className={styles.sketchContainer}>
        <MeishiOmoteSketch data={{ name, roll, secondRoll, tel, email }} />
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
