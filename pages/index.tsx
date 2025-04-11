import {useEffect, useState, useMemo} from "react";
import Image from "next/image";
import {handleImageChange} from "@/lib/handleImageChange";
import MeishiOmoteSketch from "@/components/MeishiOmoteSketch";
import MeishiUraSketch from "@/components/MeishiUraSketch";
import Layout from "./layout";
import styles from "./Home.module.scss";
import {Inter} from "next/font/google";
import {IBM_Plex_Mono} from "next/font/google";
import {FrontForm} from "@/components/scene/FrontForm";
import IntroductionModal from "@/components/IntroductionModal";

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
  const [employeeNumber, setEmployeeNumber] = useState<string>("");
  const [office, setOffice] = useState<string>("tokyo");
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
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [isPreviewUpdated, setIsPreviewUpdated] = useState<boolean>(false);
  const [innerWidth, setInnerWidth] = useState<number>(0);
  const [error, setError] = useState<{
    statusCode: number;
    message: string;
  } | null>(null);

  const [pattern, setPattern] = useState<PatternData>({
    position: {
      x: 50,
      y: 60,
    },
    size: "l",
    grid: {
      type: "hybrid",
      detailedness: 5,
    },
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [, setDropboxPath] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const frontData = useMemo(
    () => ({
      name,
      nameJa,
      roll,
      secondRoll,
      tel: `${phone.countryCode} ${phone.number}`,
      email,
    }),
    [name, nameJa, roll, secondRoll, phone, email]
  );

  useEffect(() => {
    if (window) setInnerWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    setIsPreviewUpdated(true);
  }, [pattern, email, phone, name, nameJa, roll, secondRoll]);

  useEffect(() => {
    if (isPreviewMode) {
      setIsPreviewUpdated(false);
    }
  }, [isPreviewMode]);

  useEffect(() => {
    setIsFrontDataValid(
      name.length > 0 &&
        roll.length > 0 &&
        email.length > 0 &&
        phone.number.length > 0
    );
  }, [name, roll, phone, email]);

  useEffect(() => {
    if (innerWidth < 600) {
      setOmoteScale(2 / 3);
      setUraScale(2 / 3);
    } else {
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
    }
  }, [step, innerWidth]);

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
    setLoading(true);
    setMessage("アップロード中...");
    setError(null);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          name,
          nameJa,
          roll,
          secondRoll,
          tel: `${phone.countryCode} ${phone.number}`,
          email,
          pattern,
          employeeNumber,
          office,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setDropboxPath(data.dropboxPath);
        setMessage(
          `✅ アップロード成功！Dropbox に保存されました: ${data.dropboxPath}`
        );
        setStep(5);
      } else {
        setError({
          statusCode: response.status,
          message: "エラーが発生しました。",
        });
      }
    } catch (error) {
      setError({
        statusCode: 500,
        message: `エラーが発生しました。エラーの詳細：${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      step={step}
      isPreviewMode={isPreviewMode}
      setIsPreviewMode={setIsPreviewMode}
      setIsPreviewUpdated={setIsPreviewUpdated}
      isPreviewUpdated={isPreviewUpdated}
    >
      <IntroductionModal />
      <div className={`${styles.main} ${inter.className}`}>
        {(innerWidth > 600 || !isPreviewMode) && (
          <div className={styles.leftSideContainer}>
            {step === 1 && (
              <FrontForm
                sei={sei}
                mei={mei}
                lastName={lastName}
                firstName={firstName}
                roll={roll}
                secondRoll={secondRoll}
                email={email}
                phone={phone}
                isFrontDataValid={isFrontDataValid}
                setFirstName={setFirstName}
                setLastName={setLastName}
                setSei={setSei}
                setMei={setMei}
                setRoll={setRoll}
                setSecondRoll={setSecondRoll}
                setEmail={setEmail}
                setPhone={setPhone}
                setStep={setStep}
              />
            )}

            {step === 2 && (
              <div>
                <div className={styles.verticalGridLayer} />
                <div className={styles.holizonalGridLayer} />
                {judgement ? (
                  <div className={styles.judgement}>
                    <h3>あなたについて</h3>
                    <p>{judgement}</p>
                    {innerWidth < 600 && (
                      <p>
                        ※
                        生成された名刺デザインはPreviewタブを押してご確認ください。
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className={styles.infoText}>
                      <span className={styles.segment}>写真から抽出された</span>
                      <span className={styles.segment}>情報をもとに</span>
                      <span className={styles.segment}>裏面のデザインを</span>
                      <span className={styles.segment}>生成します。</span>
                    </p>
                    <p className={styles.questionText}>{question}</p>
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
                    <p>リトライ</p>
                  </div>
                )}

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
                <p className={styles.infoText}>
                  入力情報に間違いがないか、ご確認ください。
                </p>
                <div>
                  <p className={styles.label}>
                    <span className={ibmPlexMono.className}>Name (Kanji)</span>{" "}
                    <small>名前 (漢字表記)</small>
                  </p>
                  <p className={styles.confirmText}>{nameJa}</p>
                </div>
                <div>
                  <p className={styles.label}>
                    <span className={ibmPlexMono.className}>
                      Name (Alphabet)
                    </span>{" "}
                    <small>名前 (大文字アルファベット)</small>
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
                    setStep(4);
                  }}
                >
                  次へ
                </button>
              </div>
            )}

            {step === 4 && (
              <div>
                <p className={styles.infoText}>
                  最後に、名刺の発注に必要な情報を入力してください。
                </p>
                <form className={styles.formContainer}>
                  <div className={styles.inputFormWrapper}>
                    <label>
                      <p>社員番号</p>
                      <input
                        type="text"
                        className={styles.inputForm}
                        value={employeeNumber}
                        placeholder="例: d12345"
                        onChange={(e) => setEmployeeNumber(e.target.value)}
                        disabled={loading}
                      />
                    </label>
                    <label>
                      <p>勤務地</p>
                      <select
                        className={styles.inputForm}
                        value={office}
                        onChange={(e) => setOffice(e.target.value)}
                        disabled={loading}
                      >
                        <option value="tokyo">東京</option>
                        <option value="osaka">大阪</option>
                      </select>
                    </label>
                  </div>
                  {loading && (
                    <div className={styles.loadingContainer}>
                      <div className={styles.loadingSpinner} />
                      <p className={styles.loadingText}>アップロード中...</p>
                    </div>
                  )}
                  <button
                    className={`${styles.nextButton} ${
                      (employeeNumber.length === 0 || loading) &&
                      styles.disabled
                    }`}
                    onClick={() => {
                      handleUpload();
                    }}
                    disabled={employeeNumber.length === 0 || loading}
                  >
                    {loading ? "アップロード中..." : "確定して入稿"}
                  </button>
                </form>
              </div>
            )}

            {step === 5 && (
              <div>
                {!message ? (
                  <p>{message}</p>
                ) : error ? (
                  <div className={styles.completionMessageContainer}>
                    <h3 className={styles.errorTitle}>{error.message}</h3>
                    <div className={styles.errorMessage}>
                      <p>ステータスコード：{error.statusCode}</p>
                      <p>
                        この画面が表示された場合、開発担当者（1CRP DLT 1部 山岸
                        奏大）にまでご連絡ください。
                      </p>
                      <p>メールアドレス：</p>
                      <p>yamagishi.kanata@dentsu.co.jp</p>
                    </div>
                  </div>
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
                        <span className={styles.textBlock}>
                          名刺はご自身で受け取りが必要です。
                        </span>
                        <span className={styles.textBlock}>
                          納品日は追ってご連絡します。（数日以内に受け取りに行ってください。）
                        </span>
                        <span className={styles.textBlock}>
                          【東京オフィスの方】
                        </span>
                        <span className={styles.textBlock}>
                          名刺の受け取り場所： D-Proサービスセンター40F East{" "}
                          <br />
                          (執務室の外にございます)
                          <br />
                          営業時間： 平日9:00～18:00
                          <br />
                        </span>
                        <span className={styles.textBlock}>
                          【関西オフィスの方】 関西オフィスへ発送します。
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step > 1 && step < 5 && (
              <div
                className={styles.backLink}
                onClick={() => setStep((prev) => prev - 1)}
              >
                <p>戻る</p>
              </div>
            )}
          </div>
        )}
        {(innerWidth > 600 || isPreviewMode) && (
          <div className={styles.rightSideContainer}>
            <div className={styles.preview}>
              <div className={ibmPlexMono.className}>
                <p className={styles.meishiTitle}>FRONT</p>
                <MeishiOmoteSketch data={frontData} scale={omoteScale} />
              </div>

              <div className={ibmPlexMono.className}>
                <p className={styles.meishiTitle}>BACK</p>
                <MeishiUraSketch data={pattern} scale={uraScale} />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
