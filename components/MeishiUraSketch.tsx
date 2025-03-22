"use client";

import type {P5CanvasInstance} from "@p5-wrapper/react";
import type {Image} from "p5";
import {NextReactP5Wrapper} from "@p5-wrapper/next";
import {useCallback} from "react";
import {drawHybridGrid} from "@/lib/visualizer/drawHybridGrid";
import {drawIsolationGrid} from "@/lib/visualizer/drawIsolationGrid";
import {drawPerspectiveGrid} from "@/lib/visualizer/drawPerspectiveGrid";

export default function MeishiUraSketch({
  data,
  scale,
}: {
  data: PatternData;
  scale: number;
}) {
  const baseScale = 2;
  // NextReactP5Wrapper を SSR 無効で動的にインポート
  // p5.js のスケッチ関数（インスタンスモード）
  const sketch = useCallback(
    (p: P5CanvasInstance) => {
      // p.data は P5Wrapper から渡される data プロパティです。
      // 例：{ position: { x: 220, y: 160 }, size: "m", grid: { type: "scale", detailedness: 6 } }
      let displayData = data as PatternData;
      // サイズリスト（ロゴサイズの定義）
      const sizeList: Record<string, number> = {
        xl: 2.7775 * baseScale,
        l: 2.3142 * baseScale,
        m: 1.8513 * baseScale,
        s: 1.3883 * baseScale,
        xs: 0.9258 * baseScale,
      };

      const meishiSize = {w: 257.95 * baseScale, h: 155.91 * baseScale};
      let logoImage: Image;
      let imageX: number, imageY: number;

      p.updateWithProps = (props) => {
        displayData = props.data as PatternData;
      };

      p.preload = function () {
        logoImage = p.loadImage("/dl_logo.png");
      };

      p.setup = function () {
        p.createCanvas(266.54 * baseScale, 164.46 * baseScale);
        p.strokeCap(p.SQUARE);
        console.log("logosize, width: ", logoImage.width / 10);
        console.log("logosize, height: ", logoImage.height / 10);
      };

      p.draw = function () {
        const imageScale = displayData.size ? sizeList[displayData.size] : 1;
        const styleType = displayData.grid.type;
        const detailedness = displayData.grid.detailedness;
        const logoSize = {
          w: (logoImage.width / 10) * imageScale,
          h: (logoImage.height / 10) * imageScale,
        };

        p.noStroke();
        p.background(230);
        // Slider の値を表示
        p.textSize(15);
        imageX = displayData.position.x * baseScale - logoSize.w / 2;
        imageY = displayData.position.y * baseScale - logoSize.h / 2;
        imageX = p.max(34.02, p.min(imageX, meishiSize.w - logoSize.w - 34.02));
        imageY = p.max(34.02, p.min(imageY, meishiSize.h - logoSize.h - 34.02));

        const rectCorners = {
          lt: {x: imageX, y: imageY},
          lb: {x: imageX, y: imageY + logoSize.h},
          rt: {x: imageX + logoSize.w, y: imageY},
          rb: {x: imageX + logoSize.w, y: imageY + logoSize.h},
        };

        // 名刺のベースとなる矩形を描く
        p.push();
        p.translate(p.width / 2, p.height / 2);
        p.rect(
          -meishiSize.w / 2,
          -meishiSize.h / 2,
          meishiSize.w,
          meishiSize.h
        );
        p.translate(-meishiSize.w / 2, -meishiSize.h / 2);
        p.stroke(100);
        p.strokeWeight(0.3);

        p.push();
        // グリッドのスタイルごとに描画処理を分岐
        if (styleType === "perspective") {
          drawPerspectiveGrid(
            p,
            meishiSize,
            rectCorners,
            imageX,
            imageY,
            logoSize
          );
        } else if (styleType === "isolation") {
          drawIsolationGrid(p, meishiSize, rectCorners, imageScale);
        } else if (styleType === "hybrid") {
          drawHybridGrid(p, meishiSize, rectCorners, detailedness);
        }
        p.pop();

        // マスク用の長方形
        p.fill(230);
        p.noStroke();
        p.rect(meishiSize.w, -p.height, p.width, 2 * p.height);
        p.push();
        p.noStroke();
        p.translate(imageX, imageY);
        p.image(
          logoImage,
          0,
          0,
          (logoImage.width / 10) * imageScale,
          (logoImage.height / 10) * imageScale
        );
        p.pop();
        p.pop();

        // p.save("meishi_ura.svg");
        p.noLoop();
      };
    },
    [data]
  );

  return (
    <div
      style={{
        width: `${266.54 * baseScale * scale}px`,
        height: `${164.46 * baseScale * scale}px`,
        transformOrigin: "top left",
        transform: `scale(${scale})`,
        transition: "all 1s ease",
      }}
    >
      <NextReactP5Wrapper sketch={sketch} data={data} />
    </div>
  );
}
