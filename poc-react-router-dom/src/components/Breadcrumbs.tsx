import { Link, useLocation, useMatches } from "react-router-dom";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RouteHandle {
  breadcrumb?: string;
}

interface BreadcrumbItem {
  label: string;
  path: string;
  isLast: boolean;
}

// ---------------------------------------------------------------------------
// Helper: derive breadcrumbs from either useMatches (when handles exist)
// or fall back to splitting the pathname into segments.
// ---------------------------------------------------------------------------

function buildFromPathname(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);

  const items: BreadcrumbItem[] = [
    { label: "Home", path: "/", isLast: segments.length === 0 },
  ];

  segments.forEach((seg, idx) => {
    const path = "/" + segments.slice(0, idx + 1).join("/");
    // Capitalize and replace hyphens/underscores with spaces
    const label = seg
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    items.push({ label, path, isLast: idx === segments.length - 1 });
  });

  return items;
}

// ---------------------------------------------------------------------------
// Breadcrumbs component
// ---------------------------------------------------------------------------

interface BreadcrumbsProps {
  /** If true, use route `handle.breadcrumb` metadata when available */
  useHandles?: boolean;
  separator?: string;
}

export default function Breadcrumbs({
  useHandles = true,
  separator = "/",
}: BreadcrumbsProps) {
  const location = useLocation();
  const matches = useMatches();

  let items: BreadcrumbItem[];

  if (useHandles && matches.some((m) => (m.handle as RouteHandle)?.breadcrumb)) {
    // Build breadcrumbs from route handle metadata
    items = matches
      .filter((m) => (m.handle as RouteHandle)?.breadcrumb)
      .map((m, idx, arr) => ({
        label: (m.handle as RouteHandle).breadcrumb!,
        path: m.pathname,
        isLast: idx === arr.length - 1,
      }));
    // Ensure Home is always first if not already included
    if (!items[0] || items[0].path !== "/") {
      items = [
        { label: "Home", path: "/", isLast: false },
        ...items.map((item, idx) => ({ ...item, isLast: idx === items.length - 1 })),
      ];
    }
  } else {
    items = buildFromPathname(location.pathname);
  }

  if (items.length <= 1 && items[0]?.path === "/") {
    return null; // Nothing to show on the root path
  }

  return (
    <nav aria-label="breadcrumb" style={{ marginBottom: "1rem" }}>
      <ol
        style={{
          display: "flex",
          flexWrap: "wrap",
          listStyle: "none",
          margin: 0,
          padding: 0,
          gap: "0.25rem",
          fontSize: "0.9rem",
        }}
      >
        {items.map((item, idx) => (
          <li
            key={item.path + idx}
            style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
          >
            {!item.isLast ? (
              <>
                <Link
                  to={item.path}
                  style={{ color: "#0d6efd", textDecoration: "none" }}
                >
                  {item.label}
                </Link>
                <span
                  aria-hidden
                  style={{ color: "#adb5bd", userSelect: "none" }}
                >
                  {separator}
                </span>
              </>
            ) : (
              <span
                aria-current="page"
                style={{ color: "#6c757d", fontWeight: 600 }}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
