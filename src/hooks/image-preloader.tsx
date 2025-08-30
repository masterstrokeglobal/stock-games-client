// hooks/use-image-preloader.ts
import { useState, useEffect, useRef, useMemo } from "react";

interface ImagePreloaderState {
  isLoading: boolean;
  percentageLoaded: number;
  allImagesLoaded: boolean;
  error: string | null;
}

// Global cache to store preloaded images
const imageCache = new Map<string, HTMLImageElement>();

export const useImagePreloader = (imagePaths: string[]) => {
  const [state, setState] = useState<ImagePreloaderState>({
    isLoading: true,
    percentageLoaded: 0,
    allImagesLoaded: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (imagePaths.length === 0) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        allImagesLoaded: true,
      }));
      return;
    }

    abortControllerRef.current = new AbortController();
    let loadedCount = 0;
    let hasError = false;

    const preloadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        // Check if image is already in cache
        if (imageCache.has(src)) {
          resolve(imageCache.get(src)!);
          return;
        }

        const img = new Image();

        img.onload = () => {
          // Store in cache
          imageCache.set(src, img);
          resolve(img);
        };

        img.onerror = () => {
          reject(new Error(`Failed to load image: ${src}`));
        };

        img.src = src;
      });
    };

    const loadImages = async () => {
      try {
        const promises = imagePaths.map(async (imagePath) => {
          try {
            const img = await preloadImage(imagePath);
            loadedCount++;

            if (!abortControllerRef.current?.signal.aborted) {
              setState((prev) => ({
                ...prev,
                percentageLoaded: Math.round(
                  (loadedCount / imagePaths.length) * 100
                ),
              }));
            }

            return img;
          } catch (error) {
            if (!hasError) {
              hasError = true;
              console.warn(`Failed to preload image: ${imagePath}`, error);
            }
            loadedCount++;

            if (!abortControllerRef.current?.signal.aborted) {
              setState((prev) => ({
                ...prev,
                percentageLoaded: Math.round(
                  (loadedCount / imagePaths.length) * 100
                ),
              }));
            }

            return null;
          }
        });

        await Promise.allSettled(promises);

        if (!abortControllerRef.current?.signal.aborted) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            allImagesLoaded: true,
            percentageLoaded: 100,
          }));
        }
      } catch (error) {
        if (!abortControllerRef.current?.signal.aborted) {
          console.log("Failed to preload images", error);
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: "Failed to preload images",
            allImagesLoaded: false,
          }));
        }
      }
    };

    loadImages();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [imagePaths]);

  const getBackgroundStyle = useMemo(
    () =>
      (src: string): React.CSSProperties => {
        const backgroundImage = imageCache.has(src) ? `url('${src}')` : "";

        return {
          backgroundImage,
          backgroundSize: "100% 100%",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        };
      },
    [imageCache]
  );

  return { state, getBackgroundStyle };
};

// Utility function to get cached image
export const getCachedImage = (src: string): HTMLImageElement | null => {
  return imageCache.get(src) || null;
};

// Clear cache function (optional, for memory management)
export const clearImageCache = () => {
  imageCache.clear();
};
