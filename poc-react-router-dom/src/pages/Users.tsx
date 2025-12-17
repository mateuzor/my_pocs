import { Link, useSearchParams, useLocation, useMatch } from "react-router-dom";
import { USERS } from "../data/users";

/**
 * useSearchParams() lê/escreve a query string.
 * Ex: /users?q=an
 *
 * Isso é útil porque:
 * - o estado fica na URL (dá pra compartilhar link)
 * - o browser back/forward funciona naturalmente
 *
 * useMatch():
 * - verifica se a URL atual casa com um padrão de rota, ex: /users/:userId
 */
export default function Users() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";

  // Se a URL for /users/alguma-coisa, o match vem preenchido
  const matchDetails = useMatch("/users/:userId");

  const filtered = USERS.filter((u) =>
    u.name.toLowerCase().includes(q.trim().toLowerCase())
  );

  return (
    <div>
      <h1>Users</h1>

      {matchDetails && (
        <p>
          {/* Só pra fins didáticos: mostra qual ID está em foco */}
          Detalhe aberto para o usuário ID:{" "}
          <strong>{matchDetails.params.userId}</strong>
        </p>
      )}

      <label>
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
        />
      </label>

      <ul>
        {filtered.map((u) => (
          <li key={u.id}>
            <Link
              to={`/users/${u.id}`}
              // guardamos a rota atual como "fundo" para o modal
              state={{ background: location }}
            >
              Open {u.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}