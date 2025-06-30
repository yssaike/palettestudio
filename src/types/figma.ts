export interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface FigmaPaint {
  type: 'SOLID' | 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'GRADIENT_ANGULAR' | 'GRADIENT_DIAMOND' | 'IMAGE';
  color?: FigmaColor;
  opacity?: number;
  visible?: boolean;
}

export interface FigmaColorStyle {
  name: string;
  description?: string;
  type: 'PAINT';
  paints: FigmaPaint[];
  remote?: boolean;
  key?: string;
}

export interface FigmaTextStyle {
  name: string;
  description?: string;
  type: 'TEXT';
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  lineHeight?: number;
  letterSpacing?: number;
  textCase?: 'ORIGINAL' | 'UPPER' | 'LOWER' | 'TITLE';
}

export interface FigmaEffectStyle {
  name: string;
  description?: string;
  type: 'EFFECT';
  effects: FigmaEffect[];
}

export interface FigmaEffect {
  type: 'DROP_SHADOW' | 'INNER_SHADOW' | 'LAYER_BLUR' | 'BACKGROUND_BLUR';
  visible: boolean;
  radius: number;
  color?: FigmaColor;
  offset?: { x: number; y: number };
  spread?: number;
}

export interface FigmaExportData {
  version: string;
  generator: string;
  generatedAt: string;
  fileName: string;
  description: string;
  styles: {
    colors: FigmaColorStyle[];
    text: FigmaTextStyle[];
    effects: FigmaEffectStyle[];
  };
  components?: any[];
  metadata: {
    totalStyles: number;
    colorCount: number;
    textStyleCount: number;
    effectCount: number;
    categories: Record<string, number>;
  };
}

export interface ExportError {
  code: string;
  message: string;
  details?: any;
}