import {P5CanvasInstance} from "@p5-wrapper/react";

export const drawPerspectiveGrid = (
  p: P5CanvasInstance,
  meishiSize: {w: number; h: number},
  rectCorners: {
    lt: {x: number; y: number};
    rt: {x: number; y: number};
    lb: {x: number; y: number};
    rb: {x: number; y: number};
  },
  imageX: number,
  imageY: number,
  logoSize: {w: number; h: number}
) => {
  p.line(0, 0, rectCorners.lt.x, rectCorners.lt.y);
  p.line(0, meishiSize.h, rectCorners.lb.x, rectCorners.lb.y);
  p.line(meishiSize.w, 0, rectCorners.rt.x, rectCorners.rt.y);
  p.line(meishiSize.w, meishiSize.h, rectCorners.rb.x, rectCorners.rb.y);
  p.rect(imageX, imageY, logoSize.w, logoSize.h);

  if (meishiSize.h / 2 < imageY + logoSize.h / 2) {
    p.line(meishiSize.w, 0, rectCorners.lt.x, rectCorners.lt.y);
    p.line(0, 0, rectCorners.rt.x, rectCorners.rt.y);
  } else {
    p.line(0, meishiSize.h, rectCorners.rb.x, rectCorners.rb.y);
    p.line(meishiSize.w, meishiSize.h, rectCorners.lb.x, rectCorners.lb.y);
  }
};
