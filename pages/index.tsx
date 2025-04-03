import {useEffect, useState} from "react";
import Image from "next/image";
import {handleImageChange} from "@/lib/handleImageChange";
import MeishiOmoteSketch from "@/components/MeishiOmoteSketch";
import MeishiUraSketch from "@/components/MeishiUraSketch";
import PhoneInput from "@/components/PhoneInput";
import Layout from "./layout";
import styles from "./Home.module.scss";
import {Inter} from "next/font/google";
import {IBM_Plex_Mono} from "next/font/google";

// const interBold = Inter({subsets: ["latin"], weight: "700"});
const inter = Inter({subsets: ["latin"], weight: "400"});
const ibmPlexMono = IBM_Plex_Mono({subsets: ["latin"], weight: "500"});

export default function Home() {
  const [step, setStep] = useState<number>(1);
  const [omoteScale, setOmoteScale] = useState<number>(1);
  const [uraScale, setUraScale] = useState<number>(1 / 3);
  const [name, setName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [nameJa, setNameJa] = useState<string>("");
  const [sei, setSei] = useState<string>("");
  const [mei, setMei] = useState<string>("");
  const [roll, setRoll] = useState<string>("");
  const [secondRoll, setSecondRoll] = useState<string>("");
  const [phone, setPhone] = useState<{
    countryCode: string;
    number: string;
  }>({
    countryCode: "+81",
    number: "",
  });
  const [email, setEmail] = useState<string>("");
  const [isFrontDataValid, setIsFrontDataValid] = useState<boolean>(false);
  const question = "好きな作品やデザインの画像を入れてください。";
  const [hasValidJsonData, setHasValidJsonData] = useState<boolean>(false);
  const [judgement, setJudgement] = useState("");

  const [pattern, setPattern] = useState<PatternData>({
    position: {
      x: 100,
      y: 100,
    },
    size: "xl",
    grid: {
      type: "hybrid",
      detailedness: 5,
    },
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [, setDropboxPath] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setIsFrontDataValid(
      name.length > 0 && roll.length > 0 && phone.number.length > 0
    );
  }, [name, roll, phone]);

  useEffect(() => {
    if (step === 1) {
      setOmoteScale(1);
      setUraScale(1 / 3);
    }
    if (step === 2) {
      setOmoteScale(1 / 3);
      setUraScale(1);
    }
    if (step === 3) {
      setOmoteScale(2 / 3);
      setUraScale(2 / 3);
    }
  }, [step]);

  useEffect(() => {
    setNameJa(`${sei} ${mei}`);
  }, [sei, mei]);

  useEffect(() => {
    setName(`${lastName} ${firstName}`);
  }, [firstName, lastName]);

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
        phoneNumber: `${phone.countryCode} ${phone.number}`, // ここで国コード付きの番号を送信
        image: base64Image,
      };

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      setJudgement(data.judgment);
      if (data.jsonData) {
        setPattern(data.jsonData);
        setHasValidJsonData(true);
      }
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
        tel: `${phone.countryCode} ${phone.number}`,
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
    <Layout step={step}>
      <div className={`${styles.main} ${inter.className}`}>
        <div className={styles.leftSideContainer}>
          {step === 1 && (
            <form
              className={styles.formContainer}
              onSubmit={(e) => {
                e.preventDefault();
                setStep(2);
              }}
            >
              <div className={styles.inputFormWrapper}>
                <label>
                  <p className={styles.label}>
                    <span className={ibmPlexMono.className}>Name (Kanji)</span>
                    <small>名前 (漢字表記)</small>
                  </p>
                  <div
                    style={{
                      width: "33rem",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <input
                      style={{width: "47%"}}
                      type="text"
                      value={sei}
                      onChange={(e) => setSei(e.target.value)}
                      className={styles.inputForm}
                      required
                      placeholder="姓"
                    />
                    <input
                      style={{width: "47%"}}
                      type="text"
                      value={mei}
                      onChange={(e) => setMei(e.target.value)}
                      className={styles.inputForm}
                      required
                      placeholder="名"
                    />
                  </div>
                </label>
                <label>
                  <p className={styles.label}>
                    <span className={ibmPlexMono.className}>
                      Name (Alphabet)
                    </span>{" "}
                    <small>名前 (アルファベット表記)</small>
                  </p>
                  <div
                    style={{
                      width: "33rem",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <input
                      style={{width: "47%"}}
                      type="text"
                      value={lastName}
                      onChange={(e) =>
                        setLastName(e.target.value.toUpperCase())
                      }
                      className={styles.inputForm}
                      required
                      placeholder="LAST NAME"
                    />
                    <input
                      style={{width: "47%"}}
                      type="text"
                      value={firstName}
                      onChange={(e) =>
                        setFirstName(e.target.value.toUpperCase())
                      }
                      className={styles.inputForm}
                      required
                      placeholder="FIRST NAME"
                    />
                  </div>
                </label>

                <label>
                  <p className={styles.label}>
                    <span className={ibmPlexMono.className}>
                      BUSINESS TITLE(Primary)
                    </span>{" "}
                    <small>第１ビジネスタイトル</small>
                  </p>
                  <input
                    type="text"
                    value={roll}
                    onChange={(e) => setRoll(e.target.value.toUpperCase())}
                    className={styles.inputForm}
                    required
                  />
                </label>

                <label>
                  <p className={styles.label}>
                    <span className={ibmPlexMono.className}>
                      BUSINESS TITLE(Secondary)
                    </span>
                    <small>第２ビジネスタイトル</small>
                  </p>
                  <input
                    type="text"
                    value={secondRoll}
                    onChange={(e) =>
                      setSecondRoll(e.target.value.toUpperCase())
                    }
                    className={styles.inputForm}
                  />
                </label>

                <label>
                  <p className={styles.label}>
                    <span className={ibmPlexMono.className}>Mail</span>{" "}
                    <small>メールアドレス</small>
                  </p>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.inputForm}
                    required
                  />
                </label>

                {/* 電話番号入力コンポーネント */}
                <PhoneInput phone={phone} setPhone={setPhone} />
              </div>

              <button
                className={`${styles.nextButton} ${
                  !isFrontDataValid && styles.disabled
                }`}
                type="submit"
              >
                次へ
              </button>
            </form>
          )}

          {step === 2 && (
            <div>
              <div className={styles.verticalGridLayer} />
              <div className={styles.holizonalGridLayer} />
              {judgement ? (
                <div className={styles.judgement}>
                  <h3>あなたについて</h3>
                  <p>{judgement}</p>
                </div>
              ) : (
                <div>
                  <p className={styles.questionText}>{question}</p>
                  <p>
                    写真から抽出された特徴をもとに、裏面のデザインを生成します。
                  </p>
                </div>
              )}
              {/* 見えないinput */}
              <input
                id="hiddenFileInput"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleImageChange(e, setPreview);
                }}
                style={{
                  display: "none", // 完全に非表示
                }}
              />
              {!hasValidJsonData ? (
                <>
                  <label
                    htmlFor="hiddenFileInput"
                    className={styles.fileSelectButton}
                  >
                    ファイルを選択
                  </label>
                </>
              ) : (
                <div
                  className={styles.retryButton}
                  onClick={() => {
                    setHasValidJsonData(false);
                    setPreview(null);
                  }}
                >
                  <p>もう一度やる</p>
                </div>
              )}

              {/**
               * もし「ファイル名を表示」したくなったらここで `file?.name` を表示する。
               * 現在は「ファイル名不要」とのことなので表示しない。
               */}
              {/* {file && <p>{file.name}</p>} */}

              <div className={styles.imageWrapper}>
                {preview && (
                  <Image
                    src={preview}
                    alt="プレビュー"
                    fill
                    style={{objectFit: "contain"}}
                  />
                )}
              </div>

              {hasValidJsonData ? (
                <button
                  className={styles.nextButton}
                  onClick={() => setStep(3)}
                >
                  次へ
                </button>
              ) : (
                <button
                  className={`${styles.nextButton} ${
                    (loading || !preview) && styles.disabled
                  }`}
                  onClick={handleGeneratePattern}
                  disabled={loading || !preview}
                >
                  {loading ? "生成中..." : "デザインを生成"}
                </button>
              )}
            </div>
          )}

          {step === 3 && pattern && (
            <div className={styles.confirmTextWrapper}>
              <div>
                <p className={styles.label}>
                  <span className={ibmPlexMono.className}>Name (Kanji)</span>{" "}
                  <small>名前 (漢字表記)</small>
                </p>
                <p className={styles.confirmText}>{nameJa}</p>
              </div>
              <div>
                <p className={styles.label}>
                  <span className={ibmPlexMono.className}>Name (Alphabet)</span>{" "}
                  <small>名前 (アルファベット表記)</small>
                </p>
                <p className={styles.confirmText}>{name}</p>
              </div>

              <div>
                <p className={styles.label}>
                  <span className={ibmPlexMono.className}>
                    BUSINESS TITLE(Primary)
                  </span>{" "}
                  <small>第１ビジネスタイトル</small>
                </p>
                <p className={styles.confirmText}>{roll}</p>
              </div>
              <div>
                <p className={styles.label}>
                  <span className={ibmPlexMono.className}>
                    BUSINESS TITLE(Secondary)
                  </span>{" "}
                  <small>第２ビジネスタイトル</small>
                </p>
                <p className={styles.confirmText}>{secondRoll}</p>
              </div>
              <div>
                <p className={styles.label}>
                  <span className={ibmPlexMono.className}>Mail</span>{" "}
                  <small>メールアドレス</small>
                </p>
                <p className={styles.confirmText}>{email}</p>
              </div>
              <div>
                <p className={styles.label}>
                  <span className={ibmPlexMono.className}>Tel</span>{" "}
                  <small>電話番号</small>
                </p>
                <p
                  className={styles.confirmText}
                >{`${phone.countryCode} ${phone.number}`}</p>
              </div>
              <button
                className={styles.nextButton}
                onClick={() => {
                  handleUpload();
                  setStep(4);
                }}
              >
                確定して入稿
              </button>
            </div>
          )}

          {step === 4 && (
            <div>
              {!message ? (
                <p>{message}</p>
              ) : (
                <div className={styles.completionMessageContainer}>
                  <div className={styles.headlineContainer}>
                    <h2 className={styles.headlineEn}>
                      Your Business card has been successfully ordered.
                    </h2>
                    <h3 className={styles.headlineJa}>
                      名刺の発注が完了しました。
                    </h3>
                  </div>
                  <div className={styles.noteContainer}>
                    <p className={styles.noteEn}>
                      You will receive information on how to receive your
                      business card, along with an estimated delivery date.
                    </p>
                    <p className={styles.noteJa}>
                      名刺の受け取り方法は納品予定日とともに別途ご連絡します。
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {step > 1 && step < 4 && (
            <div
              className={styles.backLink}
              onClick={() => setStep((prev) => prev - 1)}
            >
              <p>戻る</p>
            </div>
          )}
        </div>
        <div className={styles.rightSideContainer}>
          <div className={styles.preview}>
            <div
              className={`${styles.meishiContainer} ${ibmPlexMono.className}`}
            >
              <p>FRONT</p>
              <MeishiOmoteSketch
                data={{
                  name,
                  nameJa,
                  roll,
                  secondRoll,
                  tel: `${phone.countryCode} ${phone.number}`,
                  email,
                }}
                scale={omoteScale}
              />
            </div>

            <div
              className={`${styles.meishiContainer} ${ibmPlexMono.className}`}
            >
              <p>BACK</p>
              <MeishiUraSketch data={pattern} scale={uraScale} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
