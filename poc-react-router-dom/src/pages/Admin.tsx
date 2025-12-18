import { useSearchParams, Navigate } from "react-router-dom";

/**
 * Admin.tsx
 *
 * Exemplo didático de "protected route":
 * - só permite acesso se existir ?token=secret na query string.
 * - se não tiver, redireciona para a Home.
 */
export default function Admin() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const isAuthorized = token === "secret";

  if (!isAuthorized) {
    // Navigate faz uma navegação declarativa
    // replace: true para não manter a rota bloqueada no histórico
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <h1>Admin</h1>
      <p>Acesso autorizado (token correto na query string).</p>
    </div>
  );
}