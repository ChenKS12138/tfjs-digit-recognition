import React, { useCallback, useEffect, useRef, useState } from "react";

interface ICustomCanvas {
  width: number;
  height: number;
  className?: string;
  onChange?: (imgData: ImageData) => void;
  handleClean?: (emit: () => void) => void;
}

const SCALE = 8;

export default function CustomCanvas({
  width,
  height,
  className,
  onChange,
  handleClean,
}: ICustomCanvas) {
  const ref = useRef(null);
  const [isPress, setIsPress] = useState(false);

  const handlePressStart = useCallback(() => {
    setIsPress(true);
  }, [setIsPress]);

  const handlePressEnd = useCallback(() => {
    setIsPress(false);
  }, [setIsPress]);

  const handlePressMove = useCallback(
    (event: any) => {
      if (isPress) {
        const { offsetX, offsetY, movementX, movementY } = event;
        const context: CanvasRenderingContext2D = ref.current.getContext("2d");
        context.save();
        context.strokeStyle = "#000";
        context.beginPath();
        context.moveTo(
          (offsetX - movementX) / SCALE,
          (offsetY - movementY) / SCALE
        );
        context.lineTo(offsetX / SCALE, offsetY / SCALE);
        context.stroke();
        context.restore();
        onChange && onChange(context.getImageData(0, 0, width, height));
      }
    },
    [isPress, onChange, width, height]
  );

  useEffect(() => {
    handleClean &&
      handleClean(() => {
        const context: CanvasRenderingContext2D = ref.current.getContext("2d");
        context.save();
        context.clearRect(0, 0, width, height);
        context.restore();
      });
  }, [handleClean, width, height]);

  return (
    <canvas
      className={className}
      style={{
        width: width * SCALE,
        height: height * SCALE,
      }}
      ref={ref}
      width={width}
      height={height}
      onMouseDown={handlePressStart}
      onTouchStart={handlePressStart}
      onMouseMove={handlePressMove}
      onTouchMove={handlePressMove}
      onMouseUp={handlePressEnd}
      onTouchEnd={handlePressEnd}
      onMouseOut={handlePressEnd}
    />
  );
}
