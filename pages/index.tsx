import {useState} from "react";
import Image from "next/image";
import {handleImageChange} from "@/lib/handleImageChange";
import MeishiOmoteSketch from "@/components/MeishiOmoteSketch";
import MeishiUraSketch from "@/components/MeishiUraSketch";
import PhoneInput from "@/components/PhoneInput";

export default function Home() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState<string>("");
  const [roll, setRoll] = useState<string>("");
  const [secondRoll, setSecondRoll] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [question, setQuestion] = useState<string>(
    "好きな作品やデザインの画像を入れてください。"
  );
  const [judgement, setJudgement] = useState("");

  const [pattern, setPattern] = useState<PatternData>({
    position: {
      x: 100,
      y: 100,
    },
    size: "m",
    grid: {
      type: "perspective",
      detailedness: 3,
    },
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [, setDropboxPath] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // OpenAI API でデザイン生成
  const handleGeneratePattern = async (e: React.FormEvent) => {
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
        question,
        phoneNumber, // ここで国コード付きの番号を送信
        image: base64Image,
      };

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      setJudgement(data.judgment);
      if (data.jsonData) setPattern(data.jsonData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 最終的に Dropbox へデータ送信
  const handleUpload = async () => {
    setMessage("アップロード中...");

    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        name,
        roll,
        secondRoll,
        tel: phoneNumber,
        email,
        pattern,
      }),
    });

    const data = await response.json();
    if (data.success) {
      setDropboxPath(data.dropboxPath);
      setMessage(
        `✅ アップロード成功！Dropbox に保存されました: ${data.dropboxPath}`
      );
    } else {
      setMessage(`❌ アップロード失敗: ${data.error}`);
    }
  };

  return (
    <div style={{padding: "20px", maxWidth: "600px", margin: "auto"}}>
      {step === 1 && (
        <div style={{padding: "20px", maxWidth: "600px", margin: "auto"}}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep(2);
            }}
          >
            <label>
              <strong>名前（英語表記）：</strong>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.toUpperCase())}
                style={{width: "100%", marginBottom: "10px", padding: "5px"}}
              />
            </label>
            <label>
              <strong>第１ビジネスタイトル：</strong>
              <input
                type="text"
                value={roll}
                onChange={(e) => setRoll(e.target.value.toUpperCase())}
                style={{width: "100%", marginBottom: "10px", padding: "5px"}}
              />
            </label>
            <label>
              <strong>第２ビジネスタイトル：</strong>
              <input
                type="text"
                value={secondRoll}
                onChange={(e) => setSecondRoll(e.target.value.toUpperCase())}
                style={{width: "100%", marginBottom: "10px", padding: "5px"}}
              />
            </label>
            <label>
              <strong>メールアドレス：</strong>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{width: "100%", marginBottom: "10px", padding: "5px"}}
              />
            </label>

            {/* 電話番号入力コンポーネント */}
            <PhoneInput setPhoneNumber={setPhoneNumber} />

            <button type="submit">次へ</button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>裏面デザインを作成</h2>
          <label>
            <strong>質問：</strong>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              style={{width: "100%", marginBottom: "10px", padding: "5px"}}
            />
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              handleImageChange(e, setPreview);
            }}
          />
          {preview && (
            <Image src={preview} alt="プレビュー" width={200} height={200} />
          )}
          <button onClick={handleGeneratePattern} disabled={loading}>
            {loading ? "生成中..." : "デザインを生成"}
          </button>
          <button onClick={() => setStep(3)}>次へ</button>
        </div>
      )}

      {step === 3 && pattern && (
        <div>
          <h2>デザイン確認</h2>
          <pre>{JSON.stringify(pattern, null, 2)}</pre>
          <button onClick={handleUpload}>PDFを生成してDropboxに保存</button>
        </div>
      )}

      {message && <p>{message}</p>}

      <div>
        <MeishiOmoteSketch
          data={{name, roll, secondRoll, tel: phoneNumber, email}}
        />
        <MeishiUraSketch data={pattern} />
      </div>
      {judgement && (
        <div>
          <h3>判断理由</h3>
          <p>{judgement}</p>
        </div>
      )}
    </div>
  );
}
