import { useCallback, useRef, useState } from "react";

export const normalizatePixels = <T extends any>(x: T[]) => {
  return Array.from({ length: x.length / 4 }).map((_v, k) =>
    x[k * 4 + 3] < 128 ? 0 : 1
  );
};

export const squeezeArray = <T extends number>(x: T[], scale: number) => {
  const size = Math.sqrt(x.length);
  const newSize = size / scale;
  return Array.from<T>({ length: x.length / (scale * scale) }).map(
    (_v, k, arr) =>
      (x[Math.floor(k / newSize) * scale] +
        x[Math.floor(k / newSize) * scale + 1] +
        x[(k % newSize) * scale]) /
      scale
  );
};

export function debounce(timeout: number) {
  let timer = null;
  return function (func: Function, ...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(func, timeout, ...args);
  };
}

export function useTrigger() {
  const env = useRef(null);

  const setFunc = useCallback((func) => {
    env.current = func;
  }, []);

  const triggerFunc = useCallback((...args) => {
    env && env.current && env.current(...args);
  }, []);

  return [triggerFunc, setFunc];
}
