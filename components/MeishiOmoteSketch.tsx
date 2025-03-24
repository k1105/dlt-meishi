import type {P5CanvasInstance} from "@p5-wrapper/react";
import {NextReactP5Wrapper} from "@p5-wrapper/next";
import {useCallback} from "react";
// import P5Types from "p5";

export default function MeishiOmoteSketch({
  data,
  scale,
}: {
  data: ProfileData;
  scale: number;
}) {
  // ベースの拡大率
  const baseScale = 2;

  const sketch = useCallback(
    (p: P5CanvasInstance) => {
      // props更新があった場合のために変数を用意
      let displayData = data as ProfileData;

      // 名刺サイズ (SVGオリジナルの 257.95 x 155.91) に baseScale を掛けたもの
      const cardW = 257.95 * baseScale;
      const cardH = 155.91 * baseScale;
      // let font: P5Types.Font;

      // 描画するデータが更新されたら再格納
      p.updateWithProps = (props) => {
        displayData = props.data as ProfileData;
      };

      p.preload = () => {
        // 必要であればここでフォント読み込み (p.loadFont など)
        // font = p.loadFont("/fonts/IBMPlexMono-Regular.ttf");
      };

      p.setup = function () {
        // キャンバスを名刺サイズ + baseScaleで作成
        p.createCanvas(cardW, cardH);

        // 1フレームだけ描画
        p.noLoop();
      };

      p.draw = function () {
        // 背景を白に
        p.background(255);
        // ---------------- 罫線の設定 ----------------
        p.stroke(191, 192, 192); // #bfc0c0
        p.strokeWeight(0.2 * baseScale);
        p.noFill();

        // ================== 罫線を描画 ==================
        // 1) 横線 (y=91.17 → 91.17 * baseScale)
        p.line(
          0,
          91.17 * baseScale,
          258 * baseScale, // 元のSVGは 258 近辺 (257.95 でもOK)
          91.17 * baseScale
        );
        // 2) 縦線 (x=160.34)
        p.line(
          160.34 * baseScale,
          91.17 * baseScale,
          160.34 * baseScale,
          156 * baseScale // 155.91 でもOK
        );

        // 3) 右上の三角形＋×ライン (strokeWeightだけ 0.21にする)
        p.strokeWeight(0.21 * baseScale);

        p.line(
          205.69 * baseScale,
          91.12 * baseScale,
          205.69 * baseScale,
          0.11 * baseScale
        );
        p.line(
          205.69 * baseScale,
          0.11 * baseScale,
          257.85 * baseScale,
          0.11 * baseScale
        );
        p.line(
          205.69 * baseScale,
          91.12 * baseScale,
          257.85 * baseScale,
          0.11 * baseScale
        );
        p.line(
          205.69 * baseScale,
          0.11 * baseScale,
          257.85 * baseScale,
          91.12 * baseScale
        );

        // ================== テキスト描画 ==================
        // 日本語 + 英語 (同じベースラインで、9.5px分スペースを空ける)
        let baseX = 24.05 * baseScale;
        const baseY = 47.3 * baseScale;

        // (1) 日本語氏名
        p.fill(26, 11, 8); // #1a0b08
        p.textSize(9.5 * baseScale);
        p.text(displayData.nameJa, baseX, baseY);

        // 日本語氏名の描画幅を取得
        const nameJaWidth = p.textWidth(displayData.nameJa);

        // (2) 英語氏名 (日本語 + 9.5ピクセルのスペース)
        baseX += nameJaWidth + 9.5 * baseScale;
        p.fill(35, 24, 21); // #231815
        p.textSize(10 * baseScale);
        p.text(displayData.name, baseX, baseY);

        // (3) 役職 Business Title
        p.fill(149, 148, 149); // #949495
        p.textSize(6 * baseScale);
        p.push();
        // p.textFont(font);
        // メインとセカンダリがあれば "メイン / セカンダリ"
        const businessTitle = displayData.secondRoll
          ? `${displayData.roll} / ${displayData.secondRoll}`
          : displayData.roll;
        p.text(businessTitle, 23.56 * baseScale, 59.76 * baseScale);
        p.pop();
        // (4) E-MAIL ラベル + テキスト
        p.fill(149, 148, 149);
        p.textSize(4.5 * baseScale);
        p.text("E-MAIL:", 23.55 * baseScale, 108.53 * baseScale);

        p.fill(26, 11, 8);
        p.textSize(6.5 * baseScale);
        p.text(displayData.email, 23.92 * baseScale, 117.46 * baseScale);

        // (5) PHONE ラベル + テキスト
        p.fill(149, 148, 149);
        p.textSize(4.5 * baseScale);
        p.text("PHONE:", 23.55 * baseScale, 130.08 * baseScale);

        p.fill(26, 11, 8);
        p.textSize(6.5 * baseScale);
        p.text(displayData.tel, 23.76 * baseScale, 139.01 * baseScale);
      };
    },
    [data]
  );

  return (
    <div
      style={{
        // scaleによるプレビュー拡大・縮小 (transform-origin: "top left" はお好みで)
        transformOrigin: "top left",
        width: `${257.95 * baseScale * scale}px`,
        height: `${155.91 * baseScale * scale}px`,
        transform: `scale(${scale})`,
        transition: "all 1s ease",
      }}
    >
      {/* NextReactP5Wrapper は SSRでバンドルエラーを起こさないように dynamic import 推奨 */}
      <NextReactP5Wrapper sketch={sketch} data={data} />
    </div>
  );
}
