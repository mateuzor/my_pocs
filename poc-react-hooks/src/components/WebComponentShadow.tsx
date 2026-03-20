import { useEffect, useRef } from 'react';

// Shadow DOM encapsulates the element's internal structure and styles.
// Styles inside the shadow root don't leak out, and global styles don't leak in.
class StyledCard extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    // attachShadow creates an isolated DOM subtree attached to this element.
    // mode: 'open' means external JS can still access it via element.shadowRoot.
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['title', 'body'];
  }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const title = this.getAttribute('title') ?? 'Card';
    const body = this.getAttribute('body') ?? '';

    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: sans-serif;
        }
        .card {
          border: 2px solid #4299e1;
          border-radius: 8px;
          overflow: hidden;
          max-width: 280px;
        }
        .header {
          background: #4299e1;
          color: white;
          padding: 0.6rem 1rem;
          font-weight: bold;
        }
        .body {
          padding: 0.75rem 1rem;
          color: #2d3748;
          font-size: 0.9rem;
        }
      </style>
      <div class="card">
        <div class="header">${title}</div>
        <div class="body">${body}</div>
      </div>
    `;
  }
}

if (!customElements.get('styled-card')) {
  customElements.define('styled-card', StyledCard);
}

export function WebComponentShadow() {
  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>Web Components — Shadow DOM</h3>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        These cards have encapsulated styles. Global CSS cannot override their internals.
      </p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
        {/* @ts-ignore */}
        <styled-card title="Shadow DOM" body="Styles are fully encapsulated inside this element." />
        {/* @ts-ignore */}
        <styled-card title="No Leakage" body="Global page styles cannot reach inside the shadow root." />
      </div>
    </div>
  );
}
