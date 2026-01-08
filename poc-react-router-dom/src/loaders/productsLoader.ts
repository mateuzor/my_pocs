import { LoaderFunctionArgs } from "react-router-dom";
import { fetchProducts } from "../data/products";

/**
 * Loader function para a rota de produtos.
 *
 * Loaders são executados ANTES do componente renderizar, permitindo:
 * - Carregar dados de forma assíncrona
 * - Evitar loading states dentro do componente
 * - Melhor experiência do usuário (mostra dados já carregados)
 * - Aproveitar cache do React Router
 *
 * O retorno do loader fica disponível via useLoaderData() no componente.
 */
export async function productsLoader({ request }: LoaderFunctionArgs) {
  const products = await fetchProducts();
  return { products };
}
