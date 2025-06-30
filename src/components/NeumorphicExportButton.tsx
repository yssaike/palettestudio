import React, { useState } from 'react';
import { Download, FileJson, Check, AlertCircle, Info, Sparkles } from 'lucide-react';
import { ColorPalette } from '../types/palette';
import { downloadFigmaJson } from '../utils/figmaExport';
import { ExportError } from '../types/figma';
import { NeumorphicButton } from './NeumorphicButton';
import { NeumorphicCard } from './NeumorphicCard';

interface NeumorphicExportButtonProps {
  palette: ColorPalette;
  imageName?: string;
  className?: string;
}

export const NeumorphicExportButton: React.FC<NeumorphicExportButtonProps> = ({ 
  palette, 
  imageName,
  className = '' 
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);
  const [error, setError] = useState<ExportError | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleExport = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    setError(null);
    setExported(false);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const result = await downloadFigmaJson(palette, imageName);
      
      if (result.success) {
        setExported(true);
        setTimeout(() => setExported(false), 4000);
      } else {
        setError(result.error || { 
          code: 'UNKNOWN_ERROR', 
          message: 'An unknown error occurred during export' 
        });
      }
    } catch (err) {
      setError({
        code: 'UNEXPECTED_ERROR',
        message: 'An unexpected error occurred',
        details: { error: String(err) }
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getButtonContent = () => {
    if (exported) {
      return (
        <>
          <Check size={18} className="text-green-600" />
          <span>Design System Exported!</span>
        </>
      );
    }
    
    if (error) {
      return (
        <>
          <AlertCircle size={18} className="text-red-600" />
          <span>Export Failed</span>
        </>
      );
    }
    
    if (isExporting) {
      return (
        <>
          <div className="animate-spin">
            <FileJson size={18} />
          </div>
          <span>Generating Design System...</span>
        </>
      );
    }
    
    return (
      <>
        <Download size={18} />
        <span>Export Design System</span>
      </>
    );
  };

  const getButtonVariant = () => {
    if (exported) return 'success';
    if (error) return 'danger';
    return 'primary';
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <NeumorphicButton
        onClick={handleExport}
        disabled={isExporting}
        variant={getButtonVariant()}
        size="lg"
        className={`flex items-center gap-3 ${className}`}
      >
        {getButtonContent()}
      </NeumorphicButton>

      {/* Export Details */}
      {!error && !isExporting && (
        <div className="text-center">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-gray-50 to-gray-100 shadow-[2px_2px_4px_rgba(163,177,198,0.4),-2px_-2px_4px_rgba(255,255,255,0.9)] hover:shadow-[3px_3px_6px_rgba(163,177,198,0.3),-3px_-3px_6px_rgba(255,255,255,0.8)] rounded-xl transition-all duration-200 text-xs text-gray-600 hover:text-gray-800 font-helvetica"
          >
            <Info size={12} />
            <span>What's included?</span>
          </button>
          
          {showDetails && (
            <NeumorphicCard className="mt-4 p-4 rounded-2xl max-w-sm">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="text-primary-600" size={16} />
                <p className="text-xs text-gray-700 font-helvetica font-medium">
                  Complete Design System Export:
                </p>
              </div>
              <ul className="text-xs text-gray-600 font-helvetica space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-br from-primary-400 to-primary-500"></div>
                  {palette.primary.length + palette.secondary.length + palette.brand.length + 4} Color Styles
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-blue-500"></div>
                  8 Typography Styles (Bodoni + Helvetica)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-br from-purple-400 to-purple-500"></div>
                  3 Neuromorphic Shadow Effects
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-br from-green-400 to-green-500"></div>
                  Figma-compatible hierarchy
                </li>
              </ul>
            </NeumorphicCard>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <NeumorphicCard className="max-w-sm p-4 rounded-2xl bg-gradient-to-br from-red-50 to-red-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-100 to-red-200 shadow-[inset_1px_1px_2px_rgba(220,38,38,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertCircle size={16} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-800 font-helvetica">
                Export Error
              </p>
              <p className="text-xs text-red-600 font-helvetica mt-1">
                {error.message}
              </p>
              <NeumorphicButton
                onClick={() => setError(null)}
                variant="danger"
                size="sm"
                className="mt-3"
              >
                Try Again
              </NeumorphicButton>
            </div>
          </div>
        </NeumorphicCard>
      )}
    </div>
  );
};