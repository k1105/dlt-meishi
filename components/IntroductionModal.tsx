import {useState} from "react";
import Image from "next/image";
import styles from "./IntroductionModal.module.scss";

export default function IntroductionModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.stepsContainer}>
          <div className={styles.stepContent}>
            {currentStep === 1 && (
              <div className={styles.step}>
                <div className={styles.imageContainer}>
                  <Image
                    src="/images/step1.png"
                    alt="名刺の完成形サムネイル"
                    width={400}
                    height={300}
                    objectFit="contain"
                  />
                </div>
                <p>
                  このアプリケーション上で、名刺のデータを作成・入稿ができます。
                </p>
              </div>
            )}

            {currentStep === 2 && (
              <div className={styles.step}>
                <div className={styles.imageContainer}>
                  <Image
                    src="/images/step2.png"
                    alt="グリッドパターンの説明"
                    width={400}
                    height={300}
                    objectFit="contain"
                  />
                </div>
                <p>
                  この名刺のデザインは、それぞれの価値観・尺度をグリッドのパターンで体現しています。
                </p>
              </div>
            )}

            {currentStep === 3 && (
              <div className={styles.step}>
                <div className={styles.imageContainer}>
                  <Image
                    src="/images/step3.png"
                    alt="裏面のグリッドパターン"
                    width={400}
                    height={300}
                    objectFit="contain"
                  />
                </div>
                <p>
                  裏面には、あなたの情報に基づいたグリッドパターンが作成されます。
                </p>
              </div>
            )}
          </div>

          <div className={styles.stepIndicator}>
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`${styles.stepDot} ${
                  currentStep === step ? styles.active : ""
                }`}
              />
            ))}
          </div>

          <div className={styles.buttonContainer}>
            {currentStep > 1 && (
              <button
                className={`${styles.navigationButton} ${styles.backButton}`}
                onClick={handleBack}
              >
                戻る
              </button>
            )}
            <button
              className={`${styles.navigationButton} ${styles.nextButton}`}
              onClick={handleNext}
            >
              {currentStep === 3 ? "始める" : "次へ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
