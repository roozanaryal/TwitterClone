// Performance monitoring utilities
export class PerformanceMonitor {
  static measurements = new Map();

  static startMeasure(name) {
    this.measurements.set(name, performance.now());
  }

  static endMeasure(name) {
    const start = this.measurements.get(name);
    if (start) {
      const duration = performance.now() - start;
      console.log(`${name}: ${duration.toFixed(2)}ms`);
      this.measurements.delete(name);
      return duration;
    }
  }

  static measureComponent(WrappedComponent, componentName) {
    return function MeasuredComponent(props) {
      React.useEffect(() => {
        PerformanceMonitor.startMeasure(`${componentName} render`);
        return () => {
          PerformanceMonitor.endMeasure(`${componentName} render`);
        };
      });

      return React.createElement(WrappedComponent, props);
    };
  }

  static logRenderCount(componentName) {
    const renderCount = React.useRef(0);
    renderCount.current += 1;

    React.useEffect(() => {
      console.log(`🔄 ${componentName} rendered ${renderCount.current} times`);
    });
  }
}

// Web Vitals monitoring
export const measureWebVitals = () => {
  if (typeof window !== "undefined") {
    import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  }
};
