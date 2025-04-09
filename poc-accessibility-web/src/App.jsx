import React from "react";
import { useEffect, useState, useRef } from "react";
import beachImage from "./images/beach.jpg";
import "./App.css";

export default function AccessibleApp() {
  const [isModalOpen, setModalOpen] = useState(false);
  const closeModalButtonRef = useRef(null);

  // When the modal opens, focus is automatically moved to the close button for accessibility
  useEffect(() => {
    document.title = "Accessible Web POC";
    if (isModalOpen && closeModalButtonRef.current) {
      closeModalButtonRef.current.focus();
    }
  }, [isModalOpen]);

  return (
    <>
      {/* Skip link allows keyboard users to bypass navigation and jump to the main content */}
      <a href="#content" className="skip-link">
        Skip to main content
      </a>

      {/* Landmark role 'banner' for screen readers, placed outside <main> as per WCAG */}
      <header role="banner">
        <h1>Welcome to the Web Accessibility POC</h1>
        <nav aria-label="Main navigation">
          <ul>
            <li>
              <a href="/about" aria-label="About the application">
                About
              </a>
            </li>
            <li>
              <a href="/contact" aria-label="Contact page">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        {/* Email form section with appropriate aria-label */}
        <section id="content" aria-label="Email form">
          <h2>Send your email</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Sent!");
            }}
          >
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              aria-required="true"
              aria-label="Email field"
            />
            <button type="submit" aria-label="Submit form">
              Submit
            </button>
          </form>
        </section>

        {/* Decorative image section with meaningful alt text */}
        <section aria-label="Decorative image">
          <figure>
            <img src={beachImage} alt="A beach with clear sky and calm sea" />
            <figcaption>Decorative image of a beach.</figcaption>
          </figure>
        </section>

        {/* Table with proper heading scope and caption */}
        <section aria-label="Users table">
          <h2>Active Users</h2>
          <table>
            <caption>Active Users</caption>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ana</td>
                <td>ana@email.com</td>
              </tr>
              <tr>
                <td>João</td>
                <td>joao@email.com</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Buttons section with clear actions and ARIA dialog trigger */}
        <section aria-label="Quick actions">
          <h2>Quick Actions</h2>
          <button onClick={() => alert("You clicked save")}>Save</button>
          <button onClick={() => alert("You clicked cancel")}>Cancel</button>
          <button onClick={() => setModalOpen(true)} aria-haspopup="dialog">
            Open Modal
          </button>
        </section>

        {/* Accessible modal with proper focus management */}
        {isModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="modal"
          >
            <h2 id="modal-title">Accessible Modal Window</h2>
            <p>
              This is an example of a modal with focus management and screen
              reader accessibility.
            </p>
            <button
              ref={closeModalButtonRef}
              onClick={() => setModalOpen(false)}
            >
              Close
            </button>
          </div>
        )}
      </main>

      {/* Footer landmark, also outside <main> */}
      <footer role="contentinfo">
        <p>&copy; 2025 Web Accessibility</p>
      </footer>
    </>
  );
}
