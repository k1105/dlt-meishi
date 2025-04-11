import styles from "@/pages/Home.module.scss";
import {IBM_Plex_Mono} from "next/font/google";
import PhoneInput from "../PhoneInput";
import {Dispatch, SetStateAction} from "react";

const ibmPlexMono = IBM_Plex_Mono({subsets: ["latin"], weight: "500"});

export const FrontForm = ({
  sei,
  mei,
  lastName,
  firstName,
  roll,
  secondRoll,
  email,
  phone,
  isFrontDataValid,
  setFirstName,
  setLastName,
  setSei,
  setMei,
  setRoll,
  setSecondRoll,
  setEmail,
  setPhone,
  setStep,
}: {
  sei: string;
  mei: string;
  lastName: string;
  firstName: string;
  roll: string;
  secondRoll: string;
  email: string;
  phone: {
    countryCode: string;
    number: string;
  };
  isFrontDataValid: boolean;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setSei: (sei: string) => void;
  setMei: (mei: string) => void;
  setRoll: (roll: string) => void;
  setSecondRoll: (secondRoll: string) => void;
  setEmail: (email: string) => void;
  setPhone: Dispatch<
    SetStateAction<{
      countryCode: string;
      number: string;
    }>
  >;
  setStep: (step: number) => void;
}) => {
  return (
    <div>
      <p className={styles.infoText}>
        <span className={styles.segment}>まずは、</span>
        <span className={styles.segment}>表面の情報を</span>
        <span className={styles.segment}>入力します。</span>
      </p>
      <form
        className={styles.formContainer}
        onSubmit={(e) => {
          e.preventDefault();
          setStep(2);
        }}
      >
        <div className={styles.inputFormWrapper}>
          <label>
            <p className={`${styles.label} ${styles.required}`}>
              <span className={ibmPlexMono.className}>Name (Japanese)</span>
              <small>名前 (日本語表記)</small>
            </p>
            <div className={styles.inputPairContainer}>
              <input
                className={`${styles.inputPair} ${styles.inputForm}`}
                type="text"
                value={sei}
                onChange={(e) => setSei(e.target.value)}
                required
                placeholder="姓"
              />
              <input
                className={`${styles.inputPair} ${styles.inputForm}`}
                type="text"
                value={mei}
                onChange={(e) => setMei(e.target.value)}
                required
                placeholder="名"
              />
            </div>
          </label>
          <label>
            <p className={`${styles.label} ${styles.required}`}>
              <span className={ibmPlexMono.className}>Name</span>
              <small>名前 (大文字アルファベット)</small>
            </p>
            <div className={styles.inputPairContainer}>
              <input
                className={`${styles.inputPair} ${styles.inputForm} ${styles.upperCaseInput}`}
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={(e) => setLastName(e.target.value.toUpperCase())}
                required
                placeholder="LAST NAME"
              />
              <input
                className={`${styles.inputPair} ${styles.inputForm} ${styles.upperCaseInput}`}
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={(e) => setFirstName(e.target.value.toUpperCase())}
                required
                placeholder="FIRST NAME"
              />
            </div>
          </label>

          <label>
            <p className={`${styles.label} ${styles.required}`}>
              <span className={ibmPlexMono.className}>
                BUSINESS TITLE(Primary)
              </span>{" "}
              <small>第１ビジネスタイトル (大文字アルファベット)</small>
            </p>
            <input
              type="text"
              value={roll}
              onChange={(e) => setRoll(e.target.value)}
              onBlur={(e) => setRoll(e.target.value.toUpperCase())}
              className={`${styles.inputForm} ${styles.upperCaseInput}`}
              required
              placeholder="BUSINESS TITLE"
            />
          </label>

          <label>
            <p className={styles.label}>
              <span className={ibmPlexMono.className}>
                BUSINESS TITLE(Secondary)
              </span>
              <small>第２ビジネスタイトル (大文字アルファベット)</small>
            </p>
            <input
              type="text"
              value={secondRoll}
              onChange={(e) => setSecondRoll(e.target.value)}
              onBlur={(e) => setSecondRoll(e.target.value.toUpperCase())}
              className={`${styles.inputForm} ${styles.upperCaseInput}`}
              placeholder="BUSINESS TITLE"
            />
          </label>

          <label>
            <p className={`${styles.label} ${styles.required}`}>
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
    </div>
  );
};
