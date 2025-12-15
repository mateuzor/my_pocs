import { Link, useSearchParams } from "react-router-dom";
import { USERS } from "../data/users";

/**
 * useSearchParams() lê/escreve a query string.
 * Ex: /users?q=an
 *
 * Isso é útil porque:
 * - o estado fica na URL (dá pra compartilhar link)
 * - o browser back/forward funciona naturalmente
 */

export default function Users() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const filtered = USERS.filter((u) =>
    u.name.toLowerCase().includes(q.trim().toLowerCase())
  );

  return (
    <div>
      <h1>Users</h1>

      <label style={{ display: "block", marginBottom: 12 }}>
        Search by name (query string):
        <input
          value={q}
          onChange={(e) => {
            const value = e.target.value;

            // usar replace evita "poluir" o histórico a cada tecla digitada
            // se não usar replace, o back precisaria de vários cliques

            if (value) setSearchParams({ q: value }, { replace: true });
            else setSearchParams({}, { replace: true });
          }}
          placeholder="ex: ana"
          style={{ marginLeft: 8 }}
        />
      </label>

      <ul>
        {filtered.map((u) => (
          <li key={u.id}>
            <Link to={`/users/${u.id}`}>Open {u.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
