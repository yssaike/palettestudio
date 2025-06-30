export interface ColorInfo {
  hex: string;
  rgb: [number, number, number];
  hsl: [number, number, number];
  name: string;
}

export interface ColorPalette {
  primary: ColorInfo[];
  secondary: ColorInfo[];
  brand: ColorInfo[];
  semantic: {
    success: ColorInfo;
    warning: ColorInfo;
    error: ColorInfo;
    info: ColorInfo;
  };
}

export interface NatureImage {
  id: string;
  url: string;
  alt: string;
  photographer: string;
}