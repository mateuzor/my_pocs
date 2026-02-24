import { Routes, Route, Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";

// ---------------------------------------------------------------------------
// Section styles helper
// ---------------------------------------------------------------------------

const cardStyle: React.CSSProperties = {
  background: "#f8f9fa",
  border: "1px solid #dee2e6",
  borderRadius: 8,
  padding: "1rem 1.25rem",
  marginBottom: "1rem",
};

// ---------------------------------------------------------------------------
// Demo sub-pages
// ---------------------------------------------------------------------------

function CatalogPage() {
  return (
    <div>
      <Breadcrumbs useHandles={false} />
      <h2>Catalog</h2>
      <p>You are inside the catalog section.</p>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link to="electronics" style={linkStyle}>Electronics</Link>
        <Link to="books" style={linkStyle}>Books</Link>
      </div>
    </div>
  );
}

function CategoryPage() {
  return (
    <div>
      <Breadcrumbs useHandles={false} />
      <h2>Category</h2>
      <p>You are inside a specific category.</p>
      <Link to="item-42" style={linkStyle}>View Item 42</Link>
    </div>
  );
}

function ItemPage() {
  return (
    <div>
      <Breadcrumbs useHandles={false} />
      <h2>Item Detail</h2>
      <p>
        The <code>Breadcrumbs</code> component reads <code>useLocation()</code>{" "}
        and splits the URL pathname into segments. Each segment becomes a
        clickable link — except the last one, which is rendered as plain text
        with <code>aria-current="page"</code>.
      </p>
    </div>
  );
}

const linkStyle: React.CSSProperties = {
  padding: "0.4rem 0.9rem",
  background: "#0d6efd",
  color: "#fff",
  borderRadius: 6,
  textDecoration: "none",
};

// ---------------------------------------------------------------------------
// Main demo page
// ---------------------------------------------------------------------------

export default function BreadcrumbsDemo() {
  return (
    <div style={{ padding: "2rem", maxWidth: 680, margin: "0 auto" }}>
      <h1>Dynamic Breadcrumbs Demo</h1>

      <div style={cardStyle}>
        <strong>How it works:</strong>
        <ul style={{ margin: "0.5rem 0 0", paddingLeft: "1.5rem" }}>
          <li>
            <code>useLocation()</code> provides the current pathname
          </li>
          <li>
            <code>useMatches()</code> provides route match data including
            optional <code>handle.breadcrumb</code> metadata
          </li>
          <li>
            The component falls back to splitting the pathname when no handle
            metadata is present
          </li>
          <li>All segments except the last one are rendered as links</li>
          <li>
            The last segment gets <code>aria-current="page"</code> for
            accessibility
          </li>
        </ul>
      </div>

      <p>
        Navigate into the nested sections below to see the breadcrumbs update
        dynamically.
      </p>

      <Routes>
        <Route
          index
          element={
            <div>
              <Breadcrumbs useHandles={false} />
              <p>Click a section to explore nested routes:</p>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <Link to="catalog" style={linkStyle}>Go to Catalog</Link>
              </div>
            </div>
          }
        />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="catalog/:category" element={<CategoryPage />} />
        <Route path="catalog/:category/:item" element={<ItemPage />} />
      </Routes>
    </div>
  );
}
