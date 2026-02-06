import { Component, ReactNode } from 'react';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div style={{ padding: '20px', backgroundColor: '#fee', borderRadius: '8px' }}>❌ Component crashed</div>;
    return this.props.children;
  }
}

export default ErrorBoundary;
