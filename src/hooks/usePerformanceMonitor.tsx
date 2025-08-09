import { useEffect, useRef } from "react";

// Extend Window interface for gtag
declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    // eslint-disable-next-line no-unused-vars
    gtag?: (...args: any[]) => void;
  }
}

// Performance monitoring hook
export function usePerformanceMonitor(componentName?: string) {
  const renderStart = useRef<number>(Date.now());
  const mounted = useRef<boolean>(false);
  const threshold = 100; // 100ms threshold for performance warnings

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      const renderTime = Date.now() - renderStart.current;

      if (renderTime > threshold) {
        // Performance warning - legitimate use
        // eslint-disable-next-line no-console
        console.log(`${componentName} render time:`, renderTime, "ms");
      }

      // Report to analytics if available
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "timing_complete", {
          name: componentName || "component_render",
          value: renderTime,
        });
      }
    }
  }, [componentName]);

  return renderStart.current;
}

// Core Web Vitals monitoring (simplified)
export function initWebVitalsMonitoring() {
  if (typeof window === "undefined") return;

  // First Contentful Paint
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === "first-contentful-paint") {
        // eslint-disable-next-line no-console
        console.log("FCP:", entry.startTime);
        reportMetric("fcp", entry.startTime);
      }
    }
  });

  try {
    observer.observe({ entryTypes: ["paint"] });
  } catch {
    console.warn("Performance Observer not supported");
  }

  // Largest Contentful Paint
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    // eslint-disable-next-line no-console
    console.log("LCP:", lastEntry.startTime);
    reportMetric("lcp", lastEntry.startTime);
  });

  try {
    lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
  } catch {
    console.warn("LCP Observer not supported");
  }

  // Basic navigation timing
  window.addEventListener("load", () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      if (navigation) {
        const domLoad =
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart;
        const windowLoad = navigation.loadEventEnd - navigation.loadEventStart;

        // eslint-disable-next-line no-console
        console.log("DOM Load:", domLoad);
        // eslint-disable-next-line no-console
        console.log("Window Load:", windowLoad);

        reportMetric("domLoad", domLoad);
        reportMetric("windowLoad", windowLoad);
      }
    }, 100);
  });
}

// Report metric to analytics
function reportMetric(name: string, value: number) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "performance_metric", {
      metric_name: name,
      metric_value: value,
    });
  }
}

// Memory monitoring (simplified)
export function getMemoryInfo() {
  if (typeof window === "undefined") return null;

  const memory = (performance as any).memory;
  if (memory) {
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
    };
  }

  return null;
}

// Resource monitoring (simplified)
export function monitorResources() {
  if (typeof window === "undefined") return;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === "resource") {
        const resource = entry as any;
        // eslint-disable-next-line no-console
        console.log("Resource loaded:", {
          name: entry.name,
          duration: entry.duration,
          size: resource.transferSize || 0,
        });
      }
    }
  });

  try {
    observer.observe({ entryTypes: ["resource"] });
  } catch {
    console.warn("Resource Observer not supported");
  }
}

// Initialize all monitoring
export function initPerformanceMonitoring() {
  initWebVitalsMonitoring();
  monitorResources();

  // Log memory info periodically
  if (typeof window !== "undefined") {
    setInterval(() => {
      const memory = getMemoryInfo();
      if (memory) {
        // eslint-disable-next-line no-console
        console.log("Memory usage:", memory);
      }
    }, 30000); // Every 30 seconds
  }
}
