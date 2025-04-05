import Image from "next/image";
import styles from "./Header.module.scss";
import {Inter} from "next/font/google";
import {IBM_Plex_Mono} from "next/font/google";

const interBold = Inter({subsets: ["latin"], weight: "700"});
const ibmPlexMono = IBM_Plex_Mono({subsets: ["latin"], weight: "500"});

export const Header = ({
  step,
  isPreviewMode,
  setIsPreviewMode,
}: {
  step: number;
  isPreviewMode: boolean;
  setIsPreviewMode: (isPreviewMode: boolean) => void;
}) => {
  const sceneTitleList = ["FRONT", "BACK", "overview"];
  return (
    <>
      <div className={`${styles.header} ${interBold.className}`}>
        <Image
          className={styles.logo}
          src={"/dl_logo.svg"}
          width={280}
          height={120}
          alt="logo"
        />
        <Image
          className={styles.logoSp}
          src={"/dl_logo_only.svg"}
          width={60}
          height={60}
          alt="logo"
        />
        <h1 className={styles.title}>Dentsu Lab Business Card Creator</h1>
        <p className={`${styles.status} ${ibmPlexMono.className}`}>
          {step < 4 && `${sceneTitleList[step - 1]} - ${step}/3`}
        </p>
      </div>
      <div className={styles.previewSwitcherContainer}>
        <div
          className={`${styles.previewSwitcher} ${
            !isPreviewMode && styles.active
          }`}
          onClick={() => setIsPreviewMode(false)}
        >
          <p>Input</p>
        </div>
        <div
          className={`${styles.previewSwitcher} ${
            isPreviewMode && styles.active
          }`}
          onClick={() => setIsPreviewMode(true)}
        >
          <p>Preview</p>
        </div>
      </div>
    </>
  );
};
