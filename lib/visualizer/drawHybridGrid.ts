import {P5CanvasInstance} from "@p5-wrapper/react";

export const drawHybridGrid = (
  p: P5CanvasInstance,
  meishiSize: {w: number; h: number},
  rectCorners: {
    lt: {x: number; y: number};
    rt: {x: number; y: number};
    lb: {x: number; y: number};
    rb: {x: number; y: number};
  },
  detailedness: number
) => {
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
};
