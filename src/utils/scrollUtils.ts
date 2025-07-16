/**
 * Enhanced scroll utilities for precise positioning and smooth animations
 */

export interface ScrollOptions {
  offset?: number;
  duration?: number;
  easing?: (t: number) => number;
  onComplete?: () => void;
}

export interface ViewportInfo {
  width: number;
  height: number;
  scrollTop: number;
  scrollHeight: number;
}

/**
 * Get current viewport information
 */
export function getViewportInfo(): ViewportInfo {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    scrollTop: window.pageYOffset || document.documentElement.scrollTop,
    scrollHeight: document.documentElement.scrollHeight
  };
}

/**
 * Calculate responsive offset based on viewport size
 */
export function calculateResponsiveOffset(viewportWidth: number, viewportHeight: number): number {
  const baseOffset = Math.min(viewportHeight * 0.1, 120);
  
  if (viewportWidth >= 1536) return baseOffset + 40; // 2xl screens
  if (viewportWidth >= 1280) return baseOffset + 20; // xl screens  
  if (viewportWidth >= 1024) return baseOffset + 10; // lg screens
  if (viewportWidth >= 768) return baseOffset;       // md screens
  return Math.max(baseOffset - 20, 20); // mobile
}

/**
 * Calculate precise target scroll position
 */
export function calculateTargetPosition(
  element: HTMLElement, 
  offset: number,
  viewportHeight: number
): number {
  const elementTop = element.offsetTop;
  const targetPosition = elementTop - offset;
  const maxScroll = document.documentElement.scrollHeight - viewportHeight;
  
  return Math.min(Math.max(0, targetPosition), maxScroll);
}

/**
 * Enhanced easing functions
 */
export const easingFunctions = {
  easeInOutQuart: (t: number): number => {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
  },
  
  easeInOutCubic: (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
  
  easeOutExpo: (t: number): number => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }
};

/**
 * Smooth scroll to element with precise positioning
 */
export function smoothScrollToElement(
  elementId: string, 
  options: ScrollOptions = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    const element = document.getElementById(elementId);
    if (!element) {
      reject(new Error(`Element with id "${elementId}" not found`));
      return;
    }

    const viewport = getViewportInfo();
    const offset = options.offset ?? calculateResponsiveOffset(viewport.width, viewport.height);
    const duration = options.duration ?? 600;
    const easing = options.easing ?? easingFunctions.easeInOutQuart;
    
    const targetPosition = calculateTargetPosition(element, offset, viewport.height);
    const startPosition = viewport.scrollTop;
    const distance = targetPosition - startPosition;
    
    // Skip animation if already at target position
    if (Math.abs(distance) < 5) {
      element.focus({ preventScroll: true });
      element.setAttribute('tabindex', '-1');
      options.onComplete?.();
      resolve();
      return;
    }

    // Check for native smooth scroll support
    const supportsNativeSmooth = 'scrollBehavior' in document.documentElement.style;
    
    if (supportsNativeSmooth) {
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Verify position after animation
      setTimeout(() => {
        const currentPos = window.pageYOffset || document.documentElement.scrollTop;
        const tolerance = 5;
        
        if (Math.abs(currentPos - targetPosition) > tolerance) {
          window.scrollTo({ top: targetPosition, behavior: 'auto' });
        }
        
        element.focus({ preventScroll: true });
        element.setAttribute('tabindex', '-1');
        options.onComplete?.();
        resolve();
      }, duration + 50);
      
    } else {
      // Custom animation fallback
      let startTime: number | null = null;
      let animationId: number;

      const animate = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easing(progress);
        
        const currentPosition = startPosition + distance * easedProgress;
        window.scrollTo(0, currentPosition);
        
        if (progress < 1) {
          animationId = requestAnimationFrame(animate);
        } else {
          // Ensure exact final position
          window.scrollTo(0, targetPosition);
          element.focus({ preventScroll: true });
          element.setAttribute('tabindex', '-1');
          options.onComplete?.();
          resolve();
        }
      };

      animationId = requestAnimationFrame(animate);
    }
  });
}

/**
 * Add accessibility announcement for scroll action
 */
export function announceScrollAction(elementId: string, position: number): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = `Navigated to ${elementId} section at position ${Math.round(position)}px`;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    if (document.body.contains(announcement)) {
      document.body.removeChild(announcement);
    }
  }, 2000);
}

/**
 * Monitor scroll position for debugging and visual feedback
 */
export function createScrollMonitor(targetElementId: string): () => void {
  const handleScroll = () => {
    const element = document.getElementById(targetElementId);
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    const isOptimalPosition = rect.top >= 0 && rect.top <= window.innerHeight * 0.2;
    
    if (isOptimalPosition) {
      element.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.3)';
      setTimeout(() => {
        element.style.boxShadow = '';
      }, 1000);
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => window.removeEventListener('scroll', handleScroll);
}