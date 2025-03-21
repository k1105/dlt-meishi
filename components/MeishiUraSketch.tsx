"use client";

import type {P5CanvasInstance} from "@p5-wrapper/react";
import type {Image} from "p5";
import {NextReactP5Wrapper} from "@p5-wrapper/next";
import {useCallback} from "react";

export default function MeishiUraSketch({data}: {data: PatternData}) {
  // NextReactP5Wrapper を SSR 無効で動的にインポート

  // p5.js のスケッチ関数（インスタンスモード）
  const sketch = useCallback(
    (p: P5CanvasInstance) => {
      // p.data は P5Wrapper から渡される data プロパティです。
      // 例：{ position: { x: 220, y: 160 }, size: "m", grid: { type: "scale", detailedness: 6 } }
      let displayData = data as PatternData;
      // サイズリスト（ロゴサイズの定義）
      const sizeList: Record<string, number> = {
        xl: 3,
        l: 2.5,
        m: 1.5,
        s: 1,
        xs: 0.5,
      };

      const meishiSize = {w: 257.95, h: 155.91};
      let logoImage: Image;
      let imageX: number, imageY: number;

      p.updateWithProps = (props) => {
        displayData = props.data as PatternData;
      };

      p.preload = function () {
        logoImage = p.loadImage("/dl_logo.png");
      };

      p.setup = function () {
        p.createCanvas(266.54, 164.46);
        p.strokeCap(p.SQUARE);
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
        imageX = displayData.position.x - logoSize.w / 2;
        imageY = displayData.position.y - logoSize.h / 2;
        imageX = p.max(0, p.min(imageX, meishiSize.w - logoSize.w));
        imageY = p.max(0, p.min(imageY, meishiSize.h - logoSize.h));

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
        if (styleType === "scale") {
          p.line(
            rectCorners.lb.x,
            rectCorners.lb.y,
            meishiSize.w,
            rectCorners.lb.y
          );
          p.line(
            rectCorners.lb.x,
            rectCorners.lb.y - logoSize.h / 2,
            rectCorners.lb.x,
            rectCorners.lb.y
          );
          p.line(
            rectCorners.rb.x,
            rectCorners.rb.y,
            rectCorners.rb.x,
            rectCorners.rb.y - logoSize.h / 2
          );
          p.push();
          let step = 1;
          while (
            rectCorners.rb.x + (step * logoSize.w) / detailedness <
            meishiSize.w
          ) {
            p.translate(logoSize.w / detailedness, 0);
            if (step % detailedness === 0) {
              p.line(
                rectCorners.rb.x,
                rectCorners.rb.y,
                rectCorners.rb.x,
                rectCorners.rb.y - logoSize.h / 2
              );
            } else {
              p.line(
                rectCorners.rb.x,
                rectCorners.rb.y,
                rectCorners.rb.x,
                rectCorners.rb.y - logoSize.h / 3
              );
            }
            step++;
          }
          p.pop();
        } else if (styleType === "perspective") {
          p.line(0, 0, rectCorners.lt.x, rectCorners.lt.y);
          p.line(0, 0, rectCorners.rt.x, rectCorners.rt.y);
          p.line(meishiSize.w, 0, rectCorners.lt.x, rectCorners.lt.y);
          p.line(0, meishiSize.h, rectCorners.lb.x, rectCorners.lb.y);
          p.line(meishiSize.w, 0, rectCorners.rt.x, rectCorners.rt.y);
          p.line(
            meishiSize.w,
            meishiSize.h,
            rectCorners.rb.x,
            rectCorners.rb.y
          );
          p.rect(imageX, imageY, logoSize.w, logoSize.h);
        } else if (styleType === "isolation") {
          p.push();
          p.line(
            0,
            rectCorners.lb.y + imageScale * -0.3,
            meishiSize.w,
            rectCorners.lb.y + imageScale * -0.3
          );
          p.line(
            0,
            rectCorners.lb.y + imageScale * -4.7,
            meishiSize.w,
            rectCorners.lb.y + imageScale * -4.7
          );
          p.line(
            0,
            rectCorners.lb.y + imageScale * -9.1,
            meishiSize.w,
            rectCorners.lb.y + imageScale * -9.1
          );
          p.line(
            0,
            rectCorners.lt.y + imageScale * 0.3,
            meishiSize.w,
            rectCorners.lt.y + imageScale * 0.3
          );
          p.line(
            0,
            rectCorners.lt.y + imageScale * 4.7,
            meishiSize.w,
            rectCorners.lt.y + imageScale * 4.7
          );
          p.line(
            0,
            rectCorners.lt.y + imageScale * 9.1,
            meishiSize.w,
            rectCorners.lt.y + imageScale * 9.1
          );
          p.line(
            rectCorners.lt.x + imageScale * 0.3,
            0,
            rectCorners.lt.x + imageScale * 0.3,
            meishiSize.h
          );
          p.line(
            rectCorners.lt.x + imageScale * 4.7,
            0,
            rectCorners.lt.x + imageScale * 4.7,
            meishiSize.h
          );
          p.line(
            rectCorners.lt.x + imageScale * 9.1,
            0,
            rectCorners.lt.x + imageScale * 9.1,
            meishiSize.h
          );
          p.line(
            rectCorners.rt.x + imageScale * -9.1,
            0,
            rectCorners.rt.x + imageScale * -9.1,
            meishiSize.h
          );
          p.line(
            rectCorners.rt.x + imageScale * -4.7,
            0,
            rectCorners.rt.x + imageScale * -4.7,
            meishiSize.h
          );
          p.line(
            rectCorners.rt.x + imageScale * -0.3,
            0,
            rectCorners.rt.x + imageScale * -0.3,
            meishiSize.h
          );
          p.pop();
        } else if (styleType === "hybrid") {
          p.line(rectCorners.lt.x, 0, rectCorners.lt.x, meishiSize.h);
          p.line(rectCorners.rt.x, 0, rectCorners.rt.x, meishiSize.h);
          p.line(0, rectCorners.rt.y, meishiSize.w, rectCorners.rt.y);
          p.line(0, rectCorners.rb.y, rectCorners.rb.x, rectCorners.rb.y);
          let step = 1;
          const unitSize = (meishiSize.w - rectCorners.rt.x) / 2 / detailedness;
          if (unitSize !== 0) {
            p.translate(rectCorners.rt.x, rectCorners.rt.y);
            p.push();
            while (step * unitSize < meishiSize.w - rectCorners.rt.x) {
              p.translate(unitSize, 0);
              p.line(0, 0, 0, meishiSize.h - rectCorners.rt.y);
              step++;
            }
            p.pop();
            p.push();
            step = 1;
            while (step * unitSize < meishiSize.h - rectCorners.rt.y) {
              p.translate(0, unitSize);
              p.line(0, 0, meishiSize.w - rectCorners.rt.x, 0);
              step++;
            }
            p.pop();
          }
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
    <div style={{marginTop: "1rem"}}>
      <NextReactP5Wrapper sketch={sketch} data={data} />
    </div>
  );
}
