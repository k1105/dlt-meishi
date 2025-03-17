import type {P5CanvasInstance} from "@p5-wrapper/react";
import {NextReactP5Wrapper} from "@p5-wrapper/next";
import {useCallback} from "react";

export default function MeishiOmoteSketch({data}: {data: ProfileData}) {
  // p5.js のスケッチ関数（インスタンスモード）
  const sketch = useCallback(
    (p: P5CanvasInstance) => {
      let displayData = data as ProfileData;
      const meishiSize = {w: 257.95, h: 155.91};

      // Props 更新時にデータを再代入
      p.updateWithProps = (props) => {
        displayData = props.data as ProfileData;
      };

      p.setup = function () {
        p.createCanvas(266.54, 164.46);
        p.background(0);
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
        p.textSize(16.03);
        p.textFont("Helvetica");
        p.text(displayData.name, 12.68, 35.65);

        // Email
        p.textSize(6.5);
        p.text(displayData.email, 12.58, 128.38);

        // Tel
        p.text(displayData.tel, 12.42, 152.77);

        // 2段目 (roll, second roll)
        p.fill(148, 148, 149);
        p.textSize(6);
        p.text(
          `${displayData.roll}${
            displayData.secondRoll && ` / ${displayData.secondRoll}`
          }`,
          11.98,
          51.42
        );
        p.text("DENTSU LAB TOKYO", 12.68, 60.36);

        // ラベル
        p.textSize(4.5);
        p.text("E-MAIL:", 12.21, 119.45);
        p.text("PHONE:", 12.21, 143.84);

        // ライン
        p.stroke(191, 192, 192);
        p.strokeWeight(0.2);
        p.line(0, 74.06, 257.95, 74.06);
        p.line(159.45, 74.06, 159.45, 164.46);

        // 三角形構造
        p.line(213.5, 0.06, 213.5, 74.06);
        p.line(213.5, 74.06, 266.46, 74.06);
        p.line(266.46, 86.59, 207.73, 0.06);
        p.line(213.5, 74.06, 263.72, 0.06);
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
