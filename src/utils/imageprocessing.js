export function convertToGrayscale(data, method) {
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];
    let gray;

    switch (method) {
      case "average":
        gray = (r + g + b) / 3;
        break;
      case "lightness":
        gray = (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
        break;
      case "max":
        gray = Math.max(r, g, b);
        break;
      default:
        gray = 0.299 * r + 0.587 * g + 0.114 * b;
    }

    data[i] = data[i + 1] = data[i + 2] = gray;
  }
}