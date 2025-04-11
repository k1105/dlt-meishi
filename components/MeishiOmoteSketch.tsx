import type {P5CanvasInstance} from "@p5-wrapper/react";
import {NextReactP5Wrapper} from "@p5-wrapper/next";
import {useCallback} from "react";
import type p5 from "p5";

export default function MeishiOmoteSketch({
  data,
  scale,
}: {
  data: ProfileData;
  scale: number;
}) {
  // ベースの拡大率
  const baseScale = 2;

  const sketch = useCallback((p: P5CanvasInstance) => {
    let displayData: ProfileData;
    let qrSvg: p5.Image;

    // 名刺サイズ (SVGオリジナルの 257.95 x 155.91) に baseScale を掛けたもの
    const cardW = 257.95 * baseScale;
    const cardH = 155.91 * baseScale;

    // 「縦線」の x 座標 (元:160.34) と、そこから 10px 手前に収めたいので「160.34 - 10」
    // もちろん baseScale との兼ね合いで最終値を計算する
    const verticalLineX = 160.34 * baseScale;
    const marginFromLine = -35 * baseScale; // 縦線から10px手前
    // 名前表示を始める X 座標
    const nameBaseX = 24.05 * baseScale;

    // テキスト間のスペース（もともと9.5px）
    // これも文字サイズに合わせて変化させるか、固定にするかはお好みだけど、
    // 「全体的にスケールする」挙動にしたいので、 baseScale は掛けておく
    const nameGapBase = 4.5 * baseScale;

    // ◆ 氏名(日本語+英語)の合計幅を計算するヘルパー
    function measureNameWidth(jaSize: number, enSize: number): number {
      // 1) 日本語を jaSize で測る
      p.textSize(jaSize);
      const wJa = p.textWidth(displayData.nameJa);
      // 2) 英語を enSize で測る
      p.textSize(enSize);
      const wEn = p.textWidth(displayData.name);
      // 合計( 日本語 + gap + 英語 )
      return wJa + nameGapBase + wEn;
    }

    // Props 更新時にデータを再代入
    p.updateWithProps = (props) => {
      if ((props.data as ProfileData).name !== "") {
        displayData = props.data as ProfileData;
        p.redraw(); // データ変化時に再描画
      }
    };

    p.preload = () => {
      // カスタムフォントを使うならここで読み込み
      // font = p.loadFont("/fonts/IBMPlexMono-Regular.ttf");
      qrSvg = p.loadImage("/qr.svg");
    };

    p.setup = function () {
      p.createCanvas(cardW, cardH);
      p.noLoop();
    };

    p.draw = function () {
      // 背景を白に
      p.background(255);

      // ----------------- 罫線の設定 -----------------
      p.stroke(191, 192, 192); // #bfc0c0
      p.strokeWeight(0.2 * baseScale);
      p.noFill();

      // (1) 横線 (y=91.17)
      p.line(0, 91.17 * baseScale, 258 * baseScale, 91.17 * baseScale);
      // (2) 縦線 (x=160.34)
      p.line(verticalLineX, 91.17 * baseScale, verticalLineX, 156 * baseScale);

      // (3) 右上の三角形＋×ライン
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

      // ----------------- テキスト描画 -----------------
      // ◆ まずは氏名(日本語 & 英語)に関して、もとの想定サイズで合計幅を測る
      const nameJaDefaultSize = 9.5 * baseScale; // 日本語
      const nameEnDefaultSize = 10 * baseScale; // 英語

      // 「表示領域の最大幅」= 縦線 - 10pxマージン - 文字の開始X
      const maxNameWidth = verticalLineX - marginFromLine - nameBaseX;

      // いまのサイズで合計幅を測る
      p.textSize(nameJaDefaultSize);
      const totalWidth = measureNameWidth(nameJaDefaultSize, nameEnDefaultSize);

      // 名前を縮小する係数 (1.0 から下げていく)
      let shrinkScale = 1.0;
      if (totalWidth > maxNameWidth) {
        // 余白が足りない場合は、ぴったり収まるようにスケール計算
        shrinkScale = maxNameWidth / totalWidth;
      }

      // ------ 日本語 + 英語の描画 ------
      // 実際に描画で使うサイズ (日本語, 英語それぞれに shrinkScale を掛ける)
      const nameJaSize = nameJaDefaultSize * shrinkScale;
      const nameEnSize = nameEnDefaultSize * shrinkScale;

      // (A) 日本語
      p.fill(26, 11, 8); // #1a0b08
      p.textSize(nameJaSize);
      p.text(displayData.nameJa, nameBaseX, 47.3 * baseScale);

      // 日本語テキスト幅を再度取得（縮小後サイズで）
      const nameJaWidth = p.textWidth(displayData.nameJa);

      // (B) 英語 (日本語 + gap 分ずらして描画)
      p.fill(35, 24, 21); // #231815
      p.textSize(nameEnSize);
      p.text(
        displayData.name,
        nameBaseX + nameJaWidth + nameGapBase,
        47.3 * baseScale
      );

      // ---------- 役職 (roll / secondRoll) ----------
      p.fill(149, 148, 149); // #949495
      p.textSize(6 * baseScale);
      const businessTitle = displayData.secondRoll
        ? `${displayData.roll} / ${displayData.secondRoll}`
        : displayData.roll;
      p.text(businessTitle, 23.56 * baseScale, 59.76 * baseScale);

      // ---------- E-MAIL ----------
      p.fill(149, 148, 149);
      p.textSize(4.5 * baseScale);
      p.text("E-MAIL:", 23.55 * baseScale, 108.53 * baseScale);

      p.fill(26, 11, 8);
      p.textSize(6.5 * baseScale);
      p.text(displayData.email, 23.92 * baseScale, 117.46 * baseScale);

      // ---------- PHONE ----------
      p.fill(149, 148, 149);
      p.textSize(4.5 * baseScale);
      p.text("PHONE:", 23.55 * baseScale, 130.08 * baseScale);

      p.fill(26, 11, 8);
      p.textSize(6.5 * baseScale);
      p.text(displayData.tel, 23.76 * baseScale, 139.01 * baseScale);

      // ---------- QRコード ----------
      const qrSize = 28.35 * baseScale; // QRコードの元のサイズにbaseScaleを掛ける
      p.image(qrSvg, 194.972 * baseScale, 109.2866 * baseScale, qrSize, qrSize);
    };
  }, []);

  return (
    <div
      style={{
        transformOrigin: "top left",
        width: `${257.95 * baseScale * scale}px`,
        height: `${155.91 * baseScale * scale}px`,
        transform: `scale(${scale})`,
        transition: "all 1s ease",
      }}
    >
      <NextReactP5Wrapper sketch={sketch} data={data} />
    </div>
  );
}
