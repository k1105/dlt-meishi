import type {P5CanvasInstance} from "@p5-wrapper/react";
import {NextReactP5Wrapper} from "@p5-wrapper/next";
import {useCallback} from "react";

export default function MeishiOmoteSketch({
  data,
  scale,
}: {
  data: ProfileData;
  scale: number;
}) {
  const baseScale = 2;
  // p5.js のスケッチ関数（インスタンスモード）
  const sketch = useCallback(
    (p: P5CanvasInstance) => {
      let displayData = data as ProfileData;
      const meishiSize = {w: 257.95 * baseScale, h: 155.91 * baseScale};

      // Props 更新時にデータを再代入
      p.updateWithProps = (props) => {
        displayData = props.data as ProfileData;
      };

      p.setup = function () {
        p.createCanvas(266.54 * baseScale, 164.46 * baseScale);
        p.background(230);
        p.push();
        p.noStroke();
        p.translate(p.width / 2, p.height / 2);
        p.rect(
          -meishiSize.w / 2,
          -meishiSize.h / 2,
          meishiSize.w,
          meishiSize.h
        );
        p.pop();

        // メインのテキスト
        p.fill(35, 24, 21);
        p.textSize(16.03 * baseScale);
        p.textFont("Helvetica");
        p.text(displayData.name, 12.68 * baseScale, 35.65 * baseScale);

        // Email
        p.textSize(6.5 * baseScale);
        p.text(displayData.email, 12.58 * baseScale, 128.38 * baseScale);

        // Tel
        p.text(displayData.tel, 12.42 * baseScale, 152.77 * baseScale);

        // 2段目 (roll, second roll)
        p.fill(148, 148, 149);
        p.textSize(6 * baseScale);
        p.text(
          `${displayData.roll}${
            displayData.secondRoll && ` / ${displayData.secondRoll}`
          }`,
          11.98 * baseScale,
          51.42 * baseScale
        );
        p.text("DENTSU LAB TOKYO", 12.68 * baseScale, 60.36 * baseScale);

        // ラベル
        p.textSize(4.5 * baseScale);
        p.text("E-MAIL:", 12.21 * baseScale, 119.45 * baseScale);
        p.text("PHONE:", 12.21 * baseScale, 143.84 * baseScale);

        // ライン
        p.stroke(230);
        p.strokeWeight(0.5 * baseScale);
        p.line(
          0 * baseScale,
          74.06 * baseScale,
          257.95 * baseScale,
          74.06 * baseScale
        );
        p.line(
          159.45 * baseScale,
          74.06 * baseScale,
          159.45 * baseScale,
          164.46 * baseScale
        );

        // 三角形構造
        p.line(
          213.5 * baseScale,
          0.06 * baseScale,
          213.5 * baseScale,
          74.06 * baseScale
        );
        p.line(
          213.5 * baseScale,
          74.06 * baseScale,
          266.46 * baseScale,
          74.06 * baseScale
        );
        p.line(
          266.46 * baseScale,
          86.59 * baseScale,
          207.73 * baseScale,
          0.06 * baseScale
        );
        p.line(
          213.5 * baseScale,
          74.06 * baseScale,
          266.54 * baseScale,
          0 * baseScale
        );
      };

      p.draw = function () {
        // 一度だけ描画
        p.noLoop();
      };
    },
    [data]
  );

  return (
    <div
      style={{
        transformOrigin: "top left",
        width: `${266.54 * baseScale * scale}px`,
        height: `${164.46 * baseScale * scale}px`,
        transform: `scale(${scale})`,
        transition: "all 1s ease",
      }}
    >
      {/* NextReactP5Wrapper は SSR 無効化のために dynamic import 推奨 */}
      <NextReactP5Wrapper sketch={sketch} data={data} />
    </div>
  );
}
