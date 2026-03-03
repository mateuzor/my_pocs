import React from 'react';

// Error boundaries must be class components — React doesn't support
// functional error boundaries yet (as of React 18)
export class RemoteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    // Track whether a child component has thrown during rendering
    this.state = { hasError: false, error: null };
  }

  // getDerivedStateFromError is called when a child throws
  // It updates state so the next render shows the fallback UI
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log the error — in production this would go to an error reporting service
    console.error('[RemoteErrorBoundary] Remote module failed to load:', error, info);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI shown when the remote chunk fails to load
      // This happens when the remote app is down or the network is unavailable
      return (
        <div style={{
          padding: '1rem',
          border: '1px solid #feb2b2',
          borderRadius: '8px',
          background: '#fff5f5',
          color: '#c53030',
          maxWidth: '300px',
        }}>
          <strong>Remote unavailable</strong>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#555' }}>
            {this.props.componentName} could not be loaded.
            {this.props.fallbackMessage && <><br />{this.props.fallbackMessage}</>}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
