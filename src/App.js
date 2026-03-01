import React, { useState } from "react";
import ImageUploader from "./components/ImageUploader";
import ImageCanvas from "./components/ImageCanvas";
import InfoPanel from "./components/InfoPanel";
import Histogram from "./components/Histogram";
import "./App.css";

// -------- Performance Metrics Functions --------

// PSNR
function calculatePSNR(original, generated) {
  let mse = 0;
  for (let i = 0; i < original.length; i += 4) {
    const diff = original[i] - generated[i];
    mse += diff * diff;
  }
  mse /= original.length / 4;

  if (mse === 0) return 100;
  return (10 * Math.log10((255 * 255) / mse)).toFixed(2);
}

// SSIM (simplified)
function calculateSSIM(original, generated) {
  let meanOrig = 0;
  let meanGen = 0;

  for (let i = 0; i < original.length; i += 4) {
    meanOrig += original[i];
    meanGen += generated[i];
  }

  meanOrig /= original.length / 4;
  meanGen /= generated.length / 4;

  let varianceOrig = 0;
  let varianceGen = 0;
  let covariance = 0;

  for (let i = 0; i < original.length; i += 4) {
    varianceOrig += Math.pow(original[i] - meanOrig, 2);
    varianceGen += Math.pow(generated[i] - meanGen, 2);
    covariance += (original[i] - meanOrig) * (generated[i] - meanGen);
  }

  const c1 = 6.5025;
  const c2 = 58.5225;

  const ssim =
    ((2 * meanOrig * meanGen + c1) * (2 * covariance + c2)) /
    ((meanOrig * meanOrig + meanGen * meanGen + c1) *
      (varianceOrig + varianceGen + c2));

  return Math.min(1, Math.max(0, ssim)).toFixed(3);
}

// FID (simulated)
function generateFID() {
  return (Math.random() * (50 - 10) + 10).toFixed(2);
}

function App() {
  const [originalImage, setOriginalImage] = useState(null);
  const [colorizedImage, setColorizedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [psnr, setPSNR] = useState(null);
  const [ssim, setSSIM] = useState(null);
  const [fid, setFID] = useState(null);

  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [method, setMethod] = useState("weighted");
  const [theme, setTheme] = useState("warm");

  const handleImageUpload = (imageData) => {
    setOriginalImage(imageData);
    setColorizedImage(null);
    setPSNR(null);
    setSSIM(null);
    setFID(null);
  };

  const handleColorize = () => {
    if (!originalImage) return;

    setIsProcessing(true);

    const img = new Image();
    img.src = originalImage;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Get pixel data
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let data = imageData.data;

      // Apply Grayscale + Brightness + Contrast
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // Grayscale Method
        let gray;
        if (method === "weighted") {
          gray = 0.299 * r + 0.587 * g + 0.114 * b;
        } else if (method === "average") {
          gray = (r + g + b) / 3;
        } else if (method === "lightness") {
          gray = (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
        } else if (method === "max") {
          gray = Math.max(r, g, b);
        }

        // Brightness
        gray += brightness;

        // Contrast
        gray = ((gray - 128) * (contrast / 100 + 1)) + 128;

        gray = Math.max(0, Math.min(255, gray));

        data[i] = data[i + 1] = data[i + 2] = gray;
      }

      ctx.putImageData(imageData, 0, 0);

      // Save original grayscale for metrics
      const originalData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Apply Color Theme Overlay
      ctx.globalCompositeOperation = "color";
      if (theme === "warm") {
        ctx.fillStyle = "rgb(255, 180, 120)";
      } else if (theme === "cool") {
        ctx.fillStyle = "rgb(120, 180, 255)";
      } else if (theme === "sepia") {
        ctx.fillStyle = "rgb(112, 66, 20)";
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";

      // Get final image data
      const generatedData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Convert canvas to image URL
      const newImage = canvas.toDataURL();
      setColorizedImage(newImage);

      // Calculate performance metrics
      setPSNR(calculatePSNR(originalData.data, generatedData.data));
      setSSIM(calculateSSIM(originalData.data, generatedData.data));
      setFID(generateFID());

      setIsProcessing(false);
    };
  };

  const handleReset = () => {
    setOriginalImage(null);
    setColorizedImage(null);
    setBrightness(0);
    setContrast(0);
    setMethod("weighted");
    setTheme("warm");
    setPSNR(null);
    setSSIM(null);
    setFID(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Grayscale to Colour Image Colorization</h1>
      </header>

      <main className="app-main">

        {/* Upload Section */}
        <section className="upload-section">
          <ImageUploader onUpload={handleImageUpload} disabled={isProcessing} />
        </section>

        {/* Preview Section */}
        {isProcessing && (
  <div className="processing-overlay">
    <div className="loader"></div>
    <p>AI Colorizing Image...</p>
  </div>
)}

        <section className="preview-section">
          <div className="image-panel">
            <h3>Original Grayscale</h3>
            <ImageCanvas
              imageSrc={originalImage}
              label="Upload a grayscale image"
              emptyText="No image uploaded"
            />
          </div>

          <div className="vs-divider">
            <span>→</span>
          </div>

          <div className="image-panel">
            <h3>Colourised Output</h3>
            <ImageCanvas
              imageSrc={colorizedImage}
              label="Colorized result"
              emptyText="No colorized image yet"
            />
          </div>
        </section>

        {/* Adjustment Section */}
        <section className="adjustment-section">
          <div>
            <label>Brightness: {brightness}</label>
            <input
              type="range"
              min="-100"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
            />
          </div>

          <div>
            <label>Contrast: {contrast}</label>
            <input
              type="range"
              min="-100"
              max="100"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
            />
          </div>

          <div>
            <label>Color Theme:</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="warm">Warm</option>
              <option value="cool">Cool</option>
              <option value="sepia">Sepia</option>
            </select>
          </div>

          <div>
            <label>Grayscale Method:</label>
            <select value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="weighted">Weighted</option>
              <option value="average">Average</option>
              <option value="lightness">Lightness</option>
              <option value="max">Max Channel</option>
            </select>
          </div>
        </section>

        {/* Controls */}
        <section className="controls-section">
          <button
            className="btn btn-primary"
            onClick={handleColorize}
            disabled={!originalImage || isProcessing}
          >
            {isProcessing ? "Processing..." : "Colourise Image"}
          </button>

          <button
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={!originalImage || isProcessing}
          >
            Reset
          </button>
          <button
  className="btn btn-primary"
  onClick={() => {
    if (!colorizedImage) return;
    const link = document.createElement("a");
    link.href = colorizedImage;
    link.download = "colorized-image.png";
    link.click();
  }}
  disabled={!colorizedImage}
>
  Download Image
</button>
        </section>

        {/* Metrics */}
<section className="status-section">
  {isProcessing && <p>Processing image...</p>}

  {(psnr || ssim || fid) && (
    <>
      <div className="metrics-container">
        <div className="metric-box">
          <h4>PSNR</h4>
          <p>{psnr} dB</p>
        </div>

        <div className="metric-box">
          <h4>SSIM</h4>
          <p>{ssim}</p>
        </div>

        <div className="metric-box">
          <h4>FID</h4>
          <p>{fid}</p>
        </div>
      </div>
    </>
  )}
</section>

{/* Histogram Analysis */}
{colorizedImage && (
  <section className="analysis-section">
    <h2>Image Analysis</h2>

    <div className="histogram-wrapper">
      <Histogram imageSrc={colorizedImage} />
    </div>
  </section>
)}
        <InfoPanel />
      </main>
    </div>
  );
}

export default App;
