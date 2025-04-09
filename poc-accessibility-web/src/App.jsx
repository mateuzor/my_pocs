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
    <main>
      {/* ❌ Non-interactive heading with tabIndex */}
      <h1 tabIndex="0">Welcome to the Web Accessibility POC</h1>

      {/* ❌ Label not associated with input */}
      <section aria-label="Email form">
        <h2>Send your email</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Sent!");
          }}
        >
          <label>Email address</label> {/* Missing htmlFor */}
          <input
            id="email"
            name="email"
            type="email"
            required
            aria-required="true"
            aria-label="Email field"
          />
          {/* ❌ Button without type */}
          <button aria-label="Submit form">Submit</button>
        </form>
      </section>

      {/* ❌ Image without alt */}
      <section aria-label="Decorative image">
        <figure>
          <img src={beachImage} /> {/* Missing alt */}
          <figcaption>Decorative image of a beach.</figcaption>
        </figure>
      </section>

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

      <section aria-label="Quick actions">
        <h2>Quick Actions</h2>
        <div
          role="button"
          onClick={() => alert("You clicked save")}
          tabIndex="0"
        >
          Save
        </div>
        <button onClick={() => alert("You clicked cancel")}>Cancel</button>
        <button onClick={() => setModalOpen(true)} aria-haspopup="dialog">
          Open Modal
        </button>
      </section>

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
          <button ref={closeModalButtonRef} onClick={() => setModalOpen(false)}>
            Close
          </button>
        </div>
      )}

      <footer role="contentinfo">
        <p>&copy; 2025 Web Accessibility</p>
      </footer>
    </main>
  );
}
