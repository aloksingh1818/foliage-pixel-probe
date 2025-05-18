import { createWorker } from 'tesseract.js';

interface CalibrationData {
  referenceArea: number;  // in cm²
  referencePixels: number;
  pixelToCmRatio: number;
}

interface MeasurementResult {
  leafArea: number;
  greenPixelCount: number;
  redPixelCount: number;
  calibrationArea: number;
  pixelToCmRatio: number;
}

export class ImageProcessingService {
  private calibrationData: CalibrationData | null = null;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private processedImageCache: Map<string, ImageData> = new Map();

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  async setCalibration(referenceArea: number, referenceImage: string): Promise<void> {
    const img = await this.loadImage(referenceImage);
    this.canvas.width = img.width;
    this.canvas.height = img.height;
    this.ctx.drawImage(img, 0, 0);

    // Apply preprocessing
    const imageData = this.preprocessImage(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
    const referencePixels = this.countRedPixels(imageData.data);
    
    if (referencePixels === 0) {
      throw new Error('No red reference object detected. Please ensure the reference object is clearly visible.');
    }

    this.calibrationData = {
      referenceArea,
      referencePixels,
      pixelToCmRatio: referenceArea / referencePixels
    };

    // Cache the processed image
    this.processedImageCache.set(referenceImage, imageData);
  }

  async measureLeafArea(imageUrl: string): Promise<MeasurementResult> {
    if (!this.calibrationData) {
      throw new Error('Calibration not set. Please set calibration first.');
    }

    // Check if we have a cached processed image
    let imageData = this.processedImageCache.get(imageUrl);
    
    if (!imageData) {
      const img = await this.loadImage(imageUrl);
      this.canvas.width = img.width;
      this.canvas.height = img.height;
      this.ctx.drawImage(img, 0, 0);
      
      // Apply preprocessing
      imageData = this.preprocessImage(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
      this.processedImageCache.set(imageUrl, imageData);
    }

    const greenPixels = this.countGreenPixels(imageData.data);
    const redPixels = this.countRedPixels(imageData.data);
    
    if (greenPixels === 0) {
      throw new Error('No leaf detected in the image. Please ensure the leaf is clearly visible.');
    }

    const leafArea = greenPixels * this.calibrationData.pixelToCmRatio;

    return {
      leafArea: Math.round(leafArea * 100) / 100, // Round to 2 decimal places
      greenPixelCount: greenPixels,
      redPixelCount: redPixels,
      calibrationArea: this.calibrationData.referenceArea,
      pixelToCmRatio: this.calibrationData.pixelToCmRatio
    };
  }

  private async loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  private preprocessImage(imageData: ImageData): ImageData {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    // Create a new ImageData for the processed result
    const processedData = new Uint8ClampedArray(data.length);
    
    // Apply adaptive thresholding and color normalization
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Calculate luminance
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      
      // Normalize colors based on luminance
      processedData[i] = Math.min(255, Math.max(0, r * (255 / luminance)));
      processedData[i + 1] = Math.min(255, Math.max(0, g * (255 / luminance)));
      processedData[i + 2] = Math.min(255, Math.max(0, b * (255 / luminance)));
      processedData[i + 3] = data[i + 3]; // Keep original alpha
    }

    return new ImageData(processedData, width, height);
  }

  private countGreenPixels(data: Uint8ClampedArray): number {
    let count = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Enhanced green detection with HSL-like color space
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const delta = max - min;
      
      // Calculate hue-like value
      let hue = 0;
      if (delta === 0) {
        hue = 0;
      } else if (max === g) {
        hue = 60 * (((b - r) / delta) + 2);
      }
      
      // Check if pixel is green using both hue and saturation
      const saturation = max === 0 ? 0 : delta / max;
      if (hue >= 80 && hue <= 160 && saturation > 0.2 && g > 50) {
        count++;
      }
    }
    return count;
  }

  private countRedPixels(data: Uint8ClampedArray): number {
    let count = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Enhanced red detection with HSL-like color space
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const delta = max - min;
      
      // Calculate hue-like value
      let hue = 0;
      if (delta === 0) {
        hue = 0;
      } else if (max === r) {
        hue = 60 * (((g - b) / delta) % 6);
      }
      
      // Check if pixel is red using both hue and saturation
      const saturation = max === 0 ? 0 : delta / max;
      if ((hue >= 340 || hue <= 20) && saturation > 0.2 && r > 50) {
        count++;
      }
    }
    return count;
  }

  getCalibrationData(): CalibrationData | null {
    return this.calibrationData;
  }

  clearCache(): void {
    this.processedImageCache.clear();
  }
}

export const imageProcessingService = new ImageProcessingService(); 