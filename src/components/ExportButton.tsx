import React, { useState } from 'react';
import { Download, FileJson, Check } from 'lucide-react';
import { ColorPalette } from '../types/palette';
import { downloadFigmaJson } from '../utils/figmaExport';

interface ExportButtonProps {
  palette: ColorPalette;
  imageName?: string;
  className?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ 
  palette, 
  imageName,
  className = '' 
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    
    try {
      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      downloadFigmaJson(palette, imageName);
      setExported(true);
      setTimeout(() => setExported(false), 3000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`
        inline-flex items-center gap-3 px-6 py-3 
        bg-gradient-to-r from-primary-600 to-primary-700 
        hover:from-primary-700 hover:to-primary-800
        disabled:from-primary-400 disabled:to-primary-500
        text-white font-helvetica font-medium text-sm
        rounded-xl shadow-lg hover:shadow-xl
        transition-all duration-300 transform hover:scale-105
        disabled:cursor-not-allowed disabled:transform-none
        focus:outline-none focus:ring-4 focus:ring-primary-200
        ${className}
      `}
      aria-label="Export palette for Figma"
    >
      {exported ? (
        <>
          <Check size={18} />
          <span>Exported!</span>
        </>
      ) : isExporting ? (
        <>
          <div className="animate-spin">
            <FileJson size={18} />
          </div>
          <span>Exporting...</span>
        </>
      ) : (
        <>
          <Download size={18} />
          <span>Export for Figma</span>
        </>
      )}
    </button>
  );
};