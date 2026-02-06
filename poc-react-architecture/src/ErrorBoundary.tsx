import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

class ErrorBoundary extends Component<Props, { hasError: boolean }> {
  state = { hasError: false };
  
  static getDerivedStateFromError() { return { hasError: true }; }
  
  componentDidCatch(error: Error) {
    console.error('Error logged:', error);
    this.props.onError?.(error);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Error occurred</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
