import React, { useCallback, useEffect, useRef, useState } from "react";
import { debounce, normalizatePixels, useTrigger } from "~utils";
import * as tf from "@tensorflow/tfjs";
import { CustomCanvas } from "../components";

import "./App.css";

export default function App() {
  const [value, setValue] = useState("");
  const [dispatchClean, setDispatchClean] = useTrigger();
  const modelRef = useRef(null);

  const handleCanvasChange = useCallback((imageData: ImageData) => {
    setValue("");
    debounce(1000)(function () {
      if (modelRef.current) {
        const data = normalizatePixels(Array.from(imageData.data));
        const model: tf.LayersModel = modelRef.current;
        const result = model.predict(
          tf.buffer([1, 28, 28, 1], "int32", new Int32Array(data)).toTensor()
        );
        setValue("计算中...");
        (result as any).array().then((list) => {
          list = list[0];
          let maxK = 0,
            maxV = -Infinity;
          for (let i = 0; i < list.length; i++) {
            if (list[i] > maxV) {
              maxK = i;
              maxV = list[i];
            }
          }
          setValue(maxK as any);
        });
      }
    });
  }, []);

  useEffect(() => {
    tf.loadLayersModel(`${location.origin + location.pathname}model.json`).then(
      (model) => {
        modelRef.current = model;
      }
    );
  }, []);

  const handleClean = useCallback((emit) => {
    setDispatchClean(emit);
  }, []);

  const handleCleanButtonClick = useCallback(() => {
    dispatchClean();
  }, []);

  return (
    <div className="app">
      <p className="title">Digital Recognizing</p>
      <CustomCanvas
        className="shadow"
        width={28}
        height={28}
        onChange={handleCanvasChange}
        handleClean={handleClean}
      />
      <p>{value && `value: ${value}`}</p>
      <button onClick={handleCleanButtonClick}>clean</button>
    </div>
  );
}
