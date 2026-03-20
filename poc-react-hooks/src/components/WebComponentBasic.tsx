import { useEffect, useRef } from 'react';

// Custom elements extend HTMLElement and follow a defined lifecycle
class AlertBadge extends HTMLElement {
  // observedAttributes tells the browser which attribute changes to watch
  static get observedAttributes() {
    return ['type', 'label'];
  }

  connectedCallback() {
    // fires when the element is inserted into the DOM
    this.render();
  }

  attributeChangedCallback() {
    // fires whenever an observed attribute changes
    this.render();
  }

  render() {
    const type = this.getAttribute('type') ?? 'info';
    const label = this.getAttribute('label') ?? '';

    const colors: Record<string, string> = {
      info: '#3182ce',
      success: '#38a169',
      warning: '#d69e2e',
      error: '#e53e3e',
    };

    this.style.cssText = `
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      background: ${colors[type] ?? colors.info};
      color: white;
      font-size: 0.8rem;
      font-weight: bold;
      font-family: sans-serif;
    `;
    this.textContent = label;
  }
}

// The tag name must contain a hyphen — that's the custom element naming rule
if (!customElements.get('alert-badge')) {
  customElements.define('alert-badge', AlertBadge);
}

// React doesn't natively support custom elements with complex props,
// so we use a ref to imperatively set attributes after mount
export function WebComponentBasic() {
  const badgeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (badgeRef.current) {
      badgeRef.current.setAttribute('type', 'success');
      badgeRef.current.setAttribute('label', 'Custom Element');
    }
  }, []);

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>Web Components — Custom Element</h3>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        The badges below are native custom elements — not React components.
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
        {/* @ts-ignore — TypeScript doesn't know about custom HTML elements by default */}
        <alert-badge type="info" label="Info" />
        {/* @ts-ignore */}
        <alert-badge type="success" label="Success" />
        {/* @ts-ignore */}
        <alert-badge type="warning" label="Warning" />
        {/* @ts-ignore */}
        <alert-badge type="error" label="Error" />
        {/* Controlled via ref to show imperative attribute setting */}
        <alert-badge ref={badgeRef} />
      </div>
    </div>
  );
}
