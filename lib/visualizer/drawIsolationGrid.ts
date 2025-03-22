import {P5CanvasInstance} from "@p5-wrapper/react";

export const drawIsolationGrid = (
  p: P5CanvasInstance,
  meishiSize: {w: number; h: number},
  rectCorners: {
    lt: {x: number; y: number};
    rt: {x: number; y: number};
    lb: {x: number; y: number};
    rb: {x: number; y: number};
  },
  imageScale: number
) => {
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
};
