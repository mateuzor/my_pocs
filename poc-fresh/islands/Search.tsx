import { useState } from "preact/hooks";

// Each instance of an island is HYDRATED INDEPENDENTLY.
// Two <Search /> on the same page = two separate islands with isolated state.
// Their JS bundles are loaded once (shared module) but state is per-instance.

interface Props {
  // Props are serialized to JSON and embedded in the HTML — they must be
  // serializable (no functions, no class instances, no Dates without conversion)
  placeholder?: string;
  suggestions?: string[];
}

export default function Search({ placeholder = "Search...", suggestions = [] }: Props) {
  const [query, setQuery] = useState("");
  const filtered = suggestions.filter(s =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ position: "relative", maxWidth: 280 }}>
      <input
        type="text"
        value={query}
        onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "0.5rem 0.75rem",
          border: "1px solid #cbd5e0",
          borderRadius: "6px",
          boxSizing: "border-box",
        }}
      />
      {query && filtered.length > 0 && (
        <ul style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          margin: "4px 0 0",
          padding: "4px 0",
          background: "#fff",
          border: "1px solid #cbd5e0",
          borderRadius: "6px",
          listStyle: "none",
          fontSize: "0.9rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}>
          {filtered.slice(0, 5).map((s) => (
            <li key={s} style={{ padding: "0.4rem 0.75rem" }}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
