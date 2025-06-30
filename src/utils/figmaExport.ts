import { ColorPalette, ColorInfo } from '../types/palette';
import { 
  FigmaColor, 
  FigmaColorStyle, 
  FigmaTextStyle, 
  FigmaEffectStyle, 
  FigmaExportData, 
  ExportError 
} from '../types/figma';

// Validation functions
function validateColorInfo(color: ColorInfo): boolean {
  return !!(
    color.hex && 
    color.rgb && 
    color.rgb.length === 3 &&
    color.hsl && 
    color.hsl.length === 3 &&
    color.name
  );
}

function validatePalette(palette: ColorPalette): ExportError | null {
  if (!palette) {
    return { code: 'INVALID_PALETTE', message: 'Palette data is missing or invalid' };
  }

  const requiredSections = ['primary', 'secondary', 'brand', 'semantic'];
  for (const section of requiredSections) {
    if (!palette[section as keyof ColorPalette]) {
      return { 
        code: 'MISSING_SECTION', 
        message: `Missing required palette section: ${section}`,
        details: { section }
      };
    }
  }

  // Validate color arrays
  const colorArrays = [palette.primary, palette.secondary, palette.brand];
  for (let i = 0; i < colorArrays.length; i++) {
    const array = colorArrays[i];
    if (!Array.isArray(array) || array.length === 0) {
      const sectionNames = ['primary', 'secondary', 'brand'];
      return {
        code: 'EMPTY_COLOR_ARRAY',
        message: `${sectionNames[i]} colors array is empty or invalid`,
        details: { section: sectionNames[i] }
      };
    }

    for (const color of array) {
      if (!validateColorInfo(color)) {
        return {
          code: 'INVALID_COLOR_DATA',
          message: `Invalid color data in ${sectionNames[i]} section`,
          details: { section: sectionNames[i], color }
        };
      }
    }
  }

  // Validate semantic colors
  const semanticKeys = ['success', 'warning', 'error', 'info'];
  for (const key of semanticKeys) {
    const color = palette.semantic[key as keyof typeof palette.semantic];
    if (!validateColorInfo(color)) {
      return {
        code: 'INVALID_SEMANTIC_COLOR',
        message: `Invalid semantic color data for ${key}`,
        details: { key, color }
      };
    }
  }

  return null;
}

// Convert hex to Figma RGB format (0-1 range)
function hexToFigmaRgb(hex: string): FigmaColor {
  try {
    const cleanHex = hex.replace('#', '');
    if (cleanHex.length !== 6) {
      throw new Error('Invalid hex format');
    }

    const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
    const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
    const b = parseInt(cleanHex.slice(4, 6), 16) / 255;

    return { 
      r: Math.max(0, Math.min(1, r)), 
      g: Math.max(0, Math.min(1, g)), 
      b: Math.max(0, Math.min(1, b)) 
    };
  } catch (error) {
    throw new Error(`Failed to convert hex ${hex} to Figma RGB: ${error}`);
  }
}

// Create Figma color style with proper validation
function createFigmaColorStyle(
  color: ColorInfo, 
  category: string, 
  index?: number
): FigmaColorStyle {
  try {
    const figmaRgb = hexToFigmaRgb(color.hex);
    const styleName = index !== undefined 
      ? `Palette Studio/${category}/${color.name} ${String(index + 1).padStart(2, '0')}`
      : `Palette Studio/${category}/${color.name}`;

    return {
      name: styleName,
      description: `Generated from nature photography • ${color.hex} • RGB(${color.rgb.join(', ')}) • HSL(${color.hsl.join(', ')})`,
      type: "PAINT",
      paints: [{
        type: "SOLID",
        color: figmaRgb,
        opacity: 1,
        visible: true
      }],
      key: `palette-studio-${category.toLowerCase()}-${color.hex.replace('#', '')}`
    };
  } catch (error) {
    throw new Error(`Failed to create Figma color style for ${color.name}: ${error}`);
  }
}

// Create text styles for design system
function createTextStyles(): FigmaTextStyle[] {
  return [
    {
      name: 'Palette Studio/Headings/Display',
      description: 'Large display headings using Bodoni Moda',
      type: 'TEXT',
      fontFamily: 'Bodoni Moda',
      fontWeight: 700,
      fontSize: 48,
      lineHeight: 1.2,
      letterSpacing: -0.02
    },
    {
      name: 'Palette Studio/Headings/H1',
      description: 'Primary headings using Bodoni Moda',
      type: 'TEXT',
      fontFamily: 'Bodoni Moda',
      fontWeight: 600,
      fontSize: 32,
      lineHeight: 1.25,
      letterSpacing: -0.01
    },
    {
      name: 'Palette Studio/Headings/H2',
      description: 'Secondary headings using Bodoni Moda',
      type: 'TEXT',
      fontFamily: 'Bodoni Moda',
      fontWeight: 600,
      fontSize: 24,
      lineHeight: 1.3
    },
    {
      name: 'Palette Studio/Body/Large',
      description: 'Large body text using Helvetica Neue',
      type: 'TEXT',
      fontFamily: 'Helvetica Neue',
      fontWeight: 400,
      fontSize: 18,
      lineHeight: 1.5
    },
    {
      name: 'Palette Studio/Body/Regular',
      description: 'Regular body text using Helvetica Neue',
      type: 'TEXT',
      fontFamily: 'Helvetica Neue',
      fontWeight: 400,
      fontSize: 16,
      lineHeight: 1.5
    },
    {
      name: 'Palette Studio/Body/Small',
      description: 'Small body text using Helvetica Neue',
      type: 'TEXT',
      fontFamily: 'Helvetica Neue',
      fontWeight: 400,
      fontSize: 14,
      lineHeight: 1.4
    },
    {
      name: 'Palette Studio/UI/Button',
      description: 'Button text using Helvetica Neue',
      type: 'TEXT',
      fontFamily: 'Helvetica Neue',
      fontWeight: 500,
      fontSize: 14,
      lineHeight: 1.2,
      letterSpacing: 0.01
    },
    {
      name: 'Palette Studio/UI/Caption',
      description: 'Caption text using Helvetica Neue',
      type: 'TEXT',
      fontFamily: 'Helvetica Neue',
      fontWeight: 400,
      fontSize: 12,
      lineHeight: 1.3
    }
  ];
}

// Create effect styles for shadows and blurs
function createEffectStyles(): FigmaEffectStyle[] {
  return [
    {
      name: 'Palette Studio/Shadows/Card',
      description: 'Card shadow effect',
      type: 'EFFECT',
      effects: [{
        type: 'DROP_SHADOW',
        visible: true,
        radius: 16,
        color: { r: 0, g: 0, b: 0, a: 0.1 },
        offset: { x: 0, y: 4 },
        spread: 0
      }]
    },
    {
      name: 'Palette Studio/Shadows/Button',
      description: 'Button shadow effect',
      type: 'EFFECT',
      effects: [{
        type: 'DROP_SHADOW',
        visible: true,
        radius: 8,
        color: { r: 0, g: 0, b: 0, a: 0.15 },
        offset: { x: 0, y: 2 },
        spread: 0
      }]
    },
    {
      name: 'Palette Studio/Shadows/Elevated',
      description: 'Elevated element shadow',
      type: 'EFFECT',
      effects: [{
        type: 'DROP_SHADOW',
        visible: true,
        radius: 24,
        color: { r: 0, g: 0, b: 0, a: 0.12 },
        offset: { x: 0, y: 8 },
        spread: 0
      }]
    }
  ];
}

// Generate comprehensive Figma-compatible JSON
export function generateFigmaJson(palette: ColorPalette, imageName?: string): { data: string; error?: ExportError } {
  try {
    // Validate input data
    const validationError = validatePalette(palette);
    if (validationError) {
      return { data: '', error: validationError };
    }

    const timestamp = new Date().toISOString();
    const dateString = timestamp.split('T')[0];
    const fileName = imageName 
      ? `${imageName.replace(/[^a-zA-Z0-9]/g, '_')}_design_system`
      : 'nature_palette_design_system';
    
    const colorStyles: FigmaColorStyle[] = [];

    // Process color categories with error handling
    const colorCategories = [
      { key: 'primary', colors: palette.primary, label: 'Primary' },
      { key: 'secondary', colors: palette.secondary, label: 'Secondary' },
      { key: 'brand', colors: palette.brand, label: 'Brand' }
    ];

    for (const category of colorCategories) {
      try {
        category.colors.forEach((color, index) => {
          colorStyles.push(createFigmaColorStyle(color, category.label, index));
        });
      } catch (error) {
        return {
          data: '',
          error: {
            code: 'COLOR_PROCESSING_ERROR',
            message: `Failed to process ${category.label} colors`,
            details: { category: category.key, error: String(error) }
          }
        };
      }
    }

    // Process semantic colors
    const semanticColors = [
      { key: 'success', color: palette.semantic.success, label: 'Success' },
      { key: 'warning', color: palette.semantic.warning, label: 'Warning' },
      { key: 'error', color: palette.semantic.error, label: 'Error' },
      { key: 'info', color: palette.semantic.info, label: 'Info' }
    ];

    try {
      semanticColors.forEach(({ color, label }) => {
        colorStyles.push(createFigmaColorStyle(color, `Semantic/${label}`));
      });
    } catch (error) {
      return {
        data: '',
        error: {
          code: 'SEMANTIC_COLOR_ERROR',
          message: 'Failed to process semantic colors',
          details: { error: String(error) }
        }
      };
    }

    // Create text and effect styles
    const textStyles = createTextStyles();
    const effectStyles = createEffectStyles();

    const figmaExport: FigmaExportData = {
      version: "2.0",
      generator: "Palette Studio - Advanced Color Palette Generator",
      generatedAt: timestamp,
      fileName: `${fileName}_${dateString}`,
      description: "Complete design system generated from nature photography including colors, typography, and effects",
      styles: {
        colors: colorStyles,
        text: textStyles,
        effects: effectStyles
      },
      metadata: {
        totalStyles: colorStyles.length + textStyles.length + effectStyles.length,
        colorCount: colorStyles.length,
        textStyleCount: textStyles.length,
        effectCount: effectStyles.length,
        categories: {
          primary: palette.primary.length,
          secondary: palette.secondary.length,
          brand: palette.brand.length,
          semantic: 4,
          textStyles: textStyles.length,
          effectStyles: effectStyles.length
        }
      }
    };

    return { data: JSON.stringify(figmaExport, null, 2) };
  } catch (error) {
    return {
      data: '',
      error: {
        code: 'EXPORT_GENERATION_ERROR',
        message: 'Failed to generate export data',
        details: { error: String(error) }
      }
    };
  }
}

// Download JSON file with error handling
export async function downloadFigmaJson(
  palette: ColorPalette, 
  imageName?: string
): Promise<{ success: boolean; error?: ExportError }> {
  try {
    const { data, error } = generateFigmaJson(palette, imageName);
    
    if (error) {
      return { success: false, error };
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = imageName 
      ? `${imageName.replace(/[^a-zA-Z0-9]/g, '_')}_design_system_${timestamp}.json`
      : `nature_palette_design_system_${timestamp}.json`;

    // Validate JSON before download
    try {
      JSON.parse(data);
    } catch (parseError) {
      return {
        success: false,
        error: {
          code: 'INVALID_JSON',
          message: 'Generated JSON is invalid',
          details: { parseError: String(parseError) }
        }
      };
    }

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'DOWNLOAD_ERROR',
        message: 'Failed to download file',
        details: { error: String(error) }
      }
    };
  }
}