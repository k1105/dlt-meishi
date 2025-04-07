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
  const minimumGridSize = 4.96 * baseScale;
  const maxGridSize = minimumGridSize * 4;

  const sketch = useCallback((p: P5CanvasInstance) => {
    let displayData = data as PatternData;
    // サイズリスト（ロゴサイズの定義）
    const sizeList: Record<string, number> = {
      xl: maxGridSize * 6,
      l: maxGridSize * 5,
      m: maxGridSize * 4,
      s: maxGridSize * 3,
      xs: maxGridSize * 2,
    };

    const meishiSize = {w: 257.95 * baseScale, h: 155.91 * baseScale};
    const offset = 34.02 * baseScale;
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
    };

    p.draw = function () {
      const targetImageHeight = displayData.size
        ? sizeList[displayData.size]
        : sizeList["m"];
      const imageScale = (targetImageHeight / logoImage.height) * 10;
      const styleType = displayData.grid.type;
      const detailedness = displayData.grid.detailedness;
      const logoSize = {
        w: (logoImage.width / 10) * imageScale,
        h: targetImageHeight,
      };
      const unitSize = minimumGridSize * detailedness;

      p.noStroke();
      p.background(230);
      // Slider の値を表示
      p.textSize(15);
      imageX =
        offset +
        ((meishiSize.w - offset * 2 - logoSize.w) * displayData.position.x) /
          100;
      imageY =
        offset +
        ((meishiSize.h - offset * 2 - logoSize.h) * displayData.position.y) /
          100;

      imageX = p.floor(imageX / unitSize) * unitSize;
      imageY = p.floor(imageY / unitSize) * unitSize;

      const rectCorners = {
        lt: {x: imageX, y: imageY},
        lb: {x: imageX, y: imageY + logoSize.h},
        rt: {x: imageX + logoSize.w, y: imageY},
        rb: {x: imageX + logoSize.w, y: imageY + logoSize.h},
      };

      // 名刺のベースとなる矩形を描く
      p.push();
      p.translate(p.width / 2, p.height / 2);
      p.rect(-meishiSize.w / 2, -meishiSize.h / 2, meishiSize.w, meishiSize.h);
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
        drawHybridGrid(p, meishiSize, rectCorners, unitSize);
      }
      p.pop();

      // マスク用の長方形
      p.fill(230);
      p.noStroke();
      p.rect(meishiSize.w, -p.height, p.width, 2 * p.height);
      p.push();
      p.noStroke();
      p.translate(imageX, imageY);
      p.image(logoImage, 0, 0, logoSize.w, logoSize.h);
      p.pop();
      p.pop();

      // p.save("meishi_ura.svg");
      p.noLoop();
    };
  }, []);

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
