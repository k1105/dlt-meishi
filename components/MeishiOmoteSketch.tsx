import type {P5CanvasInstance} from "@p5-wrapper/react";
import {NextReactP5Wrapper} from "@p5-wrapper/next";
import {useCallback} from "react";

export default function MeishiOmoteSketch({data}: {data: ProfileData}) {
  const scale = 2;
  // p5.js のスケッチ関数（インスタンスモード）
  const sketch = useCallback(
    (p: P5CanvasInstance) => {
      let displayData = data as ProfileData;
      const meishiSize = {w: 257.95 * scale, h: 155.91 * scale};

      // Props 更新時にデータを再代入
      p.updateWithProps = (props) => {
        displayData = props.data as ProfileData;
      };

      p.setup = function () {
        p.createCanvas(266.54 * scale, 164.46 * scale);
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
        p.textSize(16.03 * scale);
        p.textFont("Helvetica");
        p.text(displayData.name, 12.68 * scale, 35.65 * scale);

        // Email
        p.textSize(6.5 * scale);
        p.text(displayData.email, 12.58 * scale, 128.38 * scale);

        // Tel
        p.text(displayData.tel, 12.42 * scale, 152.77 * scale);

        // 2段目 (roll, second roll)
        p.fill(148, 148, 149);
        p.textSize(6 * scale);
        p.text(
          `${displayData.roll}${
            displayData.secondRoll && ` / ${displayData.secondRoll}`
          }`,
          11.98 * scale,
          51.42 * scale
        );
        p.text("DENTSU LAB TOKYO", 12.68 * scale, 60.36 * scale);

        // ラベル
        p.textSize(4.5 * scale);
        p.text("E-MAIL:", 12.21 * scale, 119.45 * scale);
        p.text("PHONE:", 12.21 * scale, 143.84 * scale);

        // ライン
        p.stroke(230);
        p.strokeWeight(0.5 * scale);
        p.line(0 * scale, 74.06 * scale, 257.95 * scale, 74.06 * scale);
        p.line(159.45 * scale, 74.06 * scale, 159.45 * scale, 164.46 * scale);

        // 三角形構造
        p.line(213.5 * scale, 0.06 * scale, 213.5 * scale, 74.06 * scale);
        p.line(213.5 * scale, 74.06 * scale, 266.46 * scale, 74.06 * scale);
        p.line(266.46 * scale, 86.59 * scale, 207.73 * scale, 0.06 * scale);
        p.line(213.5 * scale, 74.06 * scale, 266.54 * scale, 0 * scale);
      };

      p.draw = function () {
        // 一度だけ描画
        p.noLoop();
      };
    },
    [data]
  );

  return (
    <div style={{marginTop: "1rem"}}>
      {/* NextReactP5Wrapper は SSR 無効化のために dynamic import 推奨 */}
      <NextReactP5Wrapper sketch={sketch} data={data} />
    </div>
  );
}
