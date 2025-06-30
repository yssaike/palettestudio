import { ColorInfo, ColorPalette } from '../types/palette';

// Convert RGB to HSL
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

// Convert RGB to Hex
function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Get color name based on HSL values
function getColorName(hsl: [number, number, number]): string {
  const [h, s, l] = hsl;
  
  if (s < 10) {
    if (l < 20) return 'Charcoal';
    if (l < 40) return 'Gray';
    if (l < 60) return 'Silver';
    if (l < 80) return 'Light Gray';
    return 'White';
  }
  
  if (h >= 0 && h < 30) return s > 50 ? 'Crimson' : 'Coral';
  if (h >= 30 && h < 60) return s > 50 ? 'Gold' : 'Amber';
  if (h >= 60 && h < 120) return s > 50 ? 'Emerald' : 'Sage';
  if (h >= 120 && h < 180) return s > 50 ? 'Teal' : 'Mint';
  if (h >= 180 && h < 240) return s > 50 ? 'Azure' : 'Sky';
  if (h >= 240 && h < 300) return s > 50 ? 'Violet' : 'Lavender';
  if (h >= 300 && h < 360) return s > 50 ? 'Magenta' : 'Rose';
  
  return 'Unknown';
}

// K-means clustering for color extraction
function kMeansColors(pixels: number[][], k: number): number[][] {
  const centroids: number[][] = [];
  
  // Initialize centroids randomly
  for (let i = 0; i < k; i++) {
    const randomIndex = Math.floor(Math.random() * pixels.length);
    centroids.push([...pixels[randomIndex]]);
  }
  
  for (let iteration = 0; iteration < 20; iteration++) {
    const clusters: number[][][] = Array(k).fill(null).map(() => []);
    
    // Assign pixels to nearest centroid
    pixels.forEach(pixel => {
      let minDistance = Infinity;
      let closestCentroid = 0;
      
      centroids.forEach((centroid, index) => {
        const distance = Math.sqrt(
          Math.pow(pixel[0] - centroid[0], 2) +
          Math.pow(pixel[1] - centroid[1], 2) +
          Math.pow(pixel[2] - centroid[2], 2)
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          closestCentroid = index;
        }
      });
      
      clusters[closestCentroid].push(pixel);
    });
    
    // Update centroids
    clusters.forEach((cluster, index) => {
      if (cluster.length > 0) {
        centroids[index][0] = Math.round(cluster.reduce((sum, pixel) => sum + pixel[0], 0) / cluster.length);
        centroids[index][1] = Math.round(cluster.reduce((sum, pixel) => sum + pixel[1], 0) / cluster.length);
        centroids[index][2] = Math.round(cluster.reduce((sum, pixel) => sum + pixel[2], 0) / cluster.length);
      }
    });
  }
  
  return centroids.map(centroid => [
    Math.max(0, Math.min(255, centroid[0])),
    Math.max(0, Math.min(255, centroid[1])),
    Math.max(0, Math.min(255, centroid[2]))
  ]);
}

// Create ColorInfo object
function createColorInfo(rgb: [number, number, number]): ColorInfo {
  const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
  return {
    hex: rgbToHex(rgb[0], rgb[1], rgb[2]),
    rgb,
    hsl,
    name: getColorName(hsl)
  };
}

// Sort colors by criteria
function sortColorsByLightness(colors: ColorInfo[]): ColorInfo[] {
  return colors.sort((a, b) => b.hsl[2] - a.hsl[2]);
}

function sortColorsBySaturation(colors: ColorInfo[]): ColorInfo[] {
  return colors.sort((a, b) => b.hsl[1] - a.hsl[1]);
}

export async function extractColorsFromImage(imageUrl: string): Promise<ColorPalette> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Set canvas size
      const maxSize = 400;
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels: number[][] = [];
      
      // Sample pixels (every 4th pixel for performance)
      for (let i = 0; i < imageData.data.length; i += 16) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const a = imageData.data[i + 3];
        
        if (a > 128) { // Only include non-transparent pixels
          pixels.push([r, g, b]);
        }
      }
      
      if (pixels.length === 0) {
        reject(new Error('No valid pixels found'));
        return;
      }
      
      // Extract dominant colors using k-means
      const dominantColors = kMeansColors(pixels, 12);
      const colorInfos = dominantColors.map(rgb => createColorInfo(rgb as [number, number, number]));
      
      // Sort and categorize colors
      const sortedByLightness = sortColorsByLightness([...colorInfos]);
      const sortedBySaturation = sortColorsBySaturation([...colorInfos]);
      
      // Create palette categories
      const primary = sortedByLightness.slice(0, 4);
      const secondary = sortedBySaturation.slice(0, 4);
      const brand = colorInfos
        .filter(color => color.hsl[1] > 30 && color.hsl[2] > 20 && color.hsl[2] < 80)
        .slice(0, 4);
      
      // Create semantic colors based on common associations
      const semantic = {
        success: colorInfos.find(c => c.hsl[0] >= 100 && c.hsl[0] <= 140 && c.hsl[1] > 30) || 
                createColorInfo([34, 197, 94]),
        warning: colorInfos.find(c => c.hsl[0] >= 35 && c.hsl[0] <= 65 && c.hsl[1] > 30) || 
                createColorInfo([251, 191, 36]),
        error: colorInfos.find(c => c.hsl[0] >= 0 && c.hsl[0] <= 20 && c.hsl[1] > 30) || 
              createColorInfo([239, 68, 68]),
        info: colorInfos.find(c => c.hsl[0] >= 200 && c.hsl[0] <= 240 && c.hsl[1] > 30) || 
             createColorInfo([59, 130, 246])
      };
      
      const palette: ColorPalette = {
        primary: primary.length >= 4 ? primary : [...primary, ...colorInfos].slice(0, 4),
        secondary: secondary.length >= 4 ? secondary : [...secondary, ...colorInfos].slice(0, 4),
        brand: brand.length >= 4 ? brand : [...brand, ...colorInfos].slice(0, 4),
        semantic
      };
      
      resolve(palette);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
}