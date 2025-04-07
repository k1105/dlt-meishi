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
  unitSize: number
) => {
  p.line(
    Math.ceil(rectCorners.lt.x / unitSize) * unitSize,
    0,
    Math.ceil(rectCorners.lt.x / unitSize) * unitSize,
    meishiSize.h
  );
  p.line(
    Math.ceil(rectCorners.rt.x / unitSize) * unitSize,
    0,
    Math.ceil(rectCorners.rt.x / unitSize) * unitSize,
    meishiSize.h
  );
  p.line(
    0,
    Math.ceil(rectCorners.rt.y / unitSize) * unitSize,
    meishiSize.w,
    Math.ceil(rectCorners.rt.y / unitSize) * unitSize
  );
  p.line(
    0,
    Math.ceil(rectCorners.rb.y / unitSize) * unitSize,
    Math.ceil(rectCorners.rb.x / unitSize) * unitSize,
    Math.ceil(rectCorners.rb.y / unitSize) * unitSize
  );
  let step = 1;

  p.translate(
    Math.ceil(rectCorners.rt.x / unitSize) * unitSize,
    Math.ceil(rectCorners.rt.y / unitSize) * unitSize
  );
  p.push();
  while (
    step * unitSize <
    meishiSize.w - Math.ceil(rectCorners.rt.x / unitSize) * unitSize
  ) {
    p.translate(unitSize, 0);
    p.line(
      0,
      0,
      0,
      meishiSize.h - Math.ceil(rectCorners.rt.y / unitSize) * unitSize
    );
    step++;
  }
  p.pop();
  p.push();
  step = 1;
  while (
    step * unitSize <
    meishiSize.h - Math.ceil(rectCorners.rt.y / unitSize) * unitSize
  ) {
    p.translate(0, unitSize);
    p.line(
      0,
      0,
      meishiSize.w - Math.ceil(rectCorners.rt.x / unitSize) * unitSize,
      0
    );
    step++;
  }
  p.pop();
};
