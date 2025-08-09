import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

/* eslint-disable react-refresh/only-export-components */
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  placeholder?: string;
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

export function LazyImage({
  src,
  alt,
  className,
  fallbackSrc,
  placeholder,
  blurDataURL,
  onLoad,
  onError,
  priority = false,
  sizes,
  quality = 75,
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(
    placeholder ||
      blurDataURL ||
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' fill='transparent'/></svg>",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      },
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority]);

  // Load the actual image when in view
  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
      onLoad?.();
    };
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
      if (fallbackSrc) {
        setImageSrc(fallbackSrc);
      }
      onError?.();
    };

    // Optimize image URL with quality and size parameters
    const optimizedSrc = optimizeImageUrl(src, quality, sizes);
    img.src = optimizedSrc;
  }, [isInView, src, fallbackSrc, onLoad, onError, quality, sizes]);

  const optimizeImageUrl = (
    url: string,
    _quality: number,
    sizes?: string,
  ): string => {
    // For TMDB images, we can specify size
    if (url.includes("image.tmdb.org")) {
      // Map sizes to TMDB size options
      const tmdbSizes = {
        w92: 92,
        w154: 154,
        w185: 185,
        w342: 342,
        w500: 500,
        w780: 780,
        original: 9999,
      };

      // Parse the desired width from sizes or use default
      const targetWidth = sizes ? parseInt(sizes.split("w")[1]) || 500 : 500;

      // Find the best TMDB size
      const bestSize =
        Object.entries(tmdbSizes).find(
          ([, width]) => width >= targetWidth,
        )?.[0] || "w500";

      // Replace the size in the URL
      return url.replace(/w\d+|original/, bestSize);
    }

    return url;
  };

  if (hasError && !fallbackSrc) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className,
        )}
      >
        <span className="text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <motion.img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />

      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Blur overlay for gradual loading */}
      {blurDataURL && isLoading && (
        <motion.div
          className="absolute inset-0 bg-cover bg-center filter blur-sm"
          style={{ backgroundImage: `url(${blurDataURL})` }}
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoading ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </div>
  );
}

// Hook for preloading images
export function useImagePreloader(imageSrcs: string[]) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const preloadImages = async (urls: string[]) => {
    setIsLoading(true);
    const promises = urls.map((url) => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(url);
        img.src = url;
      });
    });

    try {
      const loaded = await Promise.allSettled(promises);
      const successful = loaded
        .filter((result) => result.status === "fulfilled")
        .map((result) => (result as PromiseFulfilledResult<string>).value);

      setLoadedImages(new Set(successful));
    } catch (error) {
      console.error("Error preloading images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (imageSrcs.length > 0) {
      preloadImages(imageSrcs);
    }
  }, [imageSrcs]);

  return { loadedImages, isLoading, preloadImages };
}

// Image loading cache
class ImageCache {
  private static instance: ImageCache;
  private cache = new Map<string, Promise<string>>();

  static getInstance(): ImageCache {
    if (!ImageCache.instance) {
      ImageCache.instance = new ImageCache();
    }
    return ImageCache.instance;
  }

  async loadImage(src: string): Promise<string> {
    if (this.cache.has(src)) {
      return this.cache.get(src)!;
    }

    const promise = new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });

    this.cache.set(src, promise);
    return promise;
  }

  preload(src: string): void {
    this.loadImage(src).catch(() => {
      // Silently handle preload errors
    });
  }

  clear(): void {
    this.cache.clear();
  }

  getSize(): number {
    return this.cache.size;
  }
}

export const imageCache = ImageCache.getInstance();

// Utility function to generate blur data URL
export function generateBlurDataURL(color = "#f3f4f6"): string {
  const svg = `
    <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Responsive image sizes helper
export function generateSizes(breakpoints: { [key: string]: number }): string {
  return Object.entries(breakpoints)
    .map(([breakpoint, width]) => `(max-width: ${breakpoint}) ${width}px`)
    .join(", ");
}
