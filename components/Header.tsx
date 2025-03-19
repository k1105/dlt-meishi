import Image from "next/image";
import styles from "./Header.module.scss";
import {Inter} from "next/font/google";
import {IBM_Plex_Mono} from "next/font/google";

const interBold = Inter({subsets: ["latin"], weight: "700"});
const ibmPlexMono = IBM_Plex_Mono({subsets: ["latin"], weight: "500"});

export const Header = ({step}: {step: number}) => {
  const sceneTitleList = ["FRONT", "BACK", "overview"];
  return (
    <>
      <div className={`${styles.header} ${interBold.className}`}>
        <Image src={"/dl_logo.svg"} width={280} height={170} alt="logo" />
        <h1>Business Card Creator</h1>
        <p className={`${styles.status} ${ibmPlexMono.className}`}>
          {step < 4 && `${sceneTitleList[step - 1]} - ${step}/3`}
        </p>
      </div>
    </>
  );
};
