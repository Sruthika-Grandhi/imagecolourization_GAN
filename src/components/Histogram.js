import React, { useEffect, useRef } from "react";

function Histogram({ imageSrc }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = 256;
      canvas.height = 100;

      ctx.drawImage(img, 0, 0, 256, 100);

      const data = ctx.getImageData(0, 0, 256, 100).data;
      const hist = new Array(256).fill(0);

      for (let i = 0; i < data.length; i += 4) {
        hist[data[i]]++;
      }

      ctx.clearRect(0, 0, 256, 100);

      for (let i = 0; i < 256; i++) {
        ctx.fillRect(i, 100 - hist[i] / 50, 1, hist[i] / 50);
      }
    };
  }, [imageSrc]);

  return <canvas ref={canvasRef}></canvas>;
}

export default Histogram;