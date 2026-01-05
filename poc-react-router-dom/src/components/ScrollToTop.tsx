import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component
 *
 * Sempre que a rota mudar, o scroll volta ao topo da página.
 * Isso é útil porque o comportamento padrão do navegador pode manter
 * a posição de scroll ao navegar entre páginas.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
