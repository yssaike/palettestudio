import React, { useState } from 'react';
import { Download, FileJson, Check, AlertCircle, Info } from 'lucide-react';
import { ColorPalette } from '../types/palette';
import { downloadFigmaJson } from '../utils/figmaExport';
import { ExportError } from '../types/figma';

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
  const [error, setError] = useState<ExportError | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleExport = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    setError(null);
    setExported(false);
    
    try {
      // Small delay for better UX
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
          <Check size={18} className="text-green-500" />
          <span>Design System Exported!</span>
        </>
      );
    }
    
    if (error) {
      return (
        <>
          <AlertCircle size={18} className="text-red-500" />
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

  const getButtonStyles = () => {
    if (exported) {
      return 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700';
    }
    
    if (error) {
      return 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700';
    }
    
    return `
      bg-gradient-to-r from-primary-600 to-primary-700 
      hover:from-primary-700 hover:to-primary-800
      disabled:from-primary-400 disabled:to-primary-500
    `;
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleExport}
        disabled={isExporting}
        className={`
          inline-flex items-center gap-3 px-6 py-3 
          ${getButtonStyles()}
          text-white font-helvetica font-medium text-sm
          rounded-xl shadow-lg hover:shadow-xl
          transition-all duration-300 transform hover:scale-105
          disabled:cursor-not-allowed disabled:transform-none
          focus:outline-none focus:ring-4 focus:ring-primary-200
          ${className}
        `}
        aria-label="Export complete design system for Figma"
      >
        {getButtonContent()}
      </button>

      {/* Export Details */}
      {!error && !isExporting && (
        <div className="text-center">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 font-helvetica transition-colors"
          >
            <Info size={12} />
            <span>What's included?</span>
          </button>
          
          {showDetails && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg text-left max-w-sm">
              <p className="text-xs text-gray-600 font-helvetica mb-2 font-medium">
                Complete Design System Export:
              </p>
              <ul className="text-xs text-gray-600 font-helvetica space-y-1">
                <li>• {palette.primary.length + palette.secondary.length + palette.brand.length + 4} Color Styles</li>
                <li>• 8 Typography Styles (Bodoni + Helvetica)</li>
                <li>• 3 Shadow Effect Styles</li>
                <li>• Organized in Figma-compatible hierarchy</li>
                <li>• Complete metadata and descriptions</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="max-w-sm p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800 font-helvetica">
                Export Error
              </p>
              <p className="text-xs text-red-600 font-helvetica mt-1">
                {error.message}
              </p>
              {error.details && (
                <details className="mt-2">
                  <summary className="text-xs text-red-500 cursor-pointer font-helvetica">
                    Technical Details
                  </summary>
                  <pre className="text-xs text-red-500 mt-1 font-mono bg-red-100 p-2 rounded overflow-auto">
                    {JSON.stringify(error.details, null, 2)}
                  </pre>
                </details>
              )}
              <button
                onClick={() => setError(null)}
                className="text-xs text-red-600 hover:text-red-800 font-helvetica mt-2 underline"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};