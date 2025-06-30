import { ColorPalette, ColorInfo } from '../types/palette';

// Convert hex to RGB values (0-1 range for Figma)
function hexToFigmaRgb(hex: string): { r: number; g: number; b: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return { r, g, b };
}

// Create Figma color style object
function createFigmaColorStyle(color: ColorInfo, category: string, index?: number): any {
  const figmaRgb = hexToFigmaRgb(color.hex);
  const styleName = index !== undefined 
    ? `${category}/${color.name} ${index + 1}`
    : `${category}/${color.name}`;

  return {
    name: styleName,
    description: `${color.hex} • RGB(${color.rgb.join(', ')}) • HSL(${color.hsl.join(', ')})`,
    type: "PAINT",
    paints: [{
      type: "SOLID",
      color: figmaRgb,
      opacity: 1
    }]
  };
}

// Generate Figma-compatible JSON
export function generateFigmaJson(palette: ColorPalette, imageName?: string): string {
  const timestamp = new Date().toISOString().split('T')[0];
  const fileName = imageName ? `${imageName.replace(/[^a-zA-Z0-9]/g, '_')}_palette` : 'nature_palette';
  
  const figmaStyles: any[] = [];

  // Add primary colors
  palette.primary.forEach((color, index) => {
    figmaStyles.push(createFigmaColorStyle(color, 'Primary', index));
  });

  // Add secondary colors
  palette.secondary.forEach((color, index) => {
    figmaStyles.push(createFigmaColorStyle(color, 'Secondary', index));
  });

  // Add brand colors
  palette.brand.forEach((color, index) => {
    figmaStyles.push(createFigmaColorStyle(color, 'Brand', index));
  });

  // Add semantic colors
  const semanticColors = [
    { key: 'success', color: palette.semantic.success, label: 'Success' },
    { key: 'warning', color: palette.semantic.warning, label: 'Warning' },
    { key: 'error', color: palette.semantic.error, label: 'Error' },
    { key: 'info', color: palette.semantic.info, label: 'Info' }
  ];

  semanticColors.forEach(({ color, label }) => {
    figmaStyles.push(createFigmaColorStyle(color, 'Semantic', undefined));
  });

  const figmaExport = {
    version: "1.0",
    generator: "Palette Studio",
    generatedAt: new Date().toISOString(),
    fileName: `${fileName}_${timestamp}`,
    description: "Color palette generated from nature photography",
    styles: figmaStyles,
    metadata: {
      totalColors: figmaStyles.length,
      categories: {
        primary: palette.primary.length,
        secondary: palette.secondary.length,
        brand: palette.brand.length,
        semantic: 4
      }
    }
  };

  return JSON.stringify(figmaExport, null, 2);
}

// Download JSON file
export function downloadFigmaJson(palette: ColorPalette, imageName?: string): void {
  const jsonContent = generateFigmaJson(palette, imageName);
  const timestamp = new Date().toISOString().split('T')[0];
  const fileName = imageName 
    ? `${imageName.replace(/[^a-zA-Z0-9]/g, '_')}_palette_${timestamp}.json`
    : `nature_palette_${timestamp}.json`;

  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}