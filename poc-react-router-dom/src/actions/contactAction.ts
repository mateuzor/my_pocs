import { ActionFunctionArgs } from "react-router-dom";

/**
 * Action function para processar o formulário de contato.
 *
 * Actions são executados quando um formulário é submetido usando o componente Form do React Router.
 * Diferente de loaders (que rodam no GET), actions rodam em métodos POST, PUT, PATCH, DELETE.
 *
 * Vantagens:
 * - Não precisa de preventDefault() no formulário
 * - React Router gerencia o estado de loading automaticamente
 * - Progressive enhancement (funciona sem JS)
 * - Integração com revalidação de loaders
 */
export async function contactAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    message: formData.get("message") as string,
  };

  // Validação simples
  if (!data.name || !data.email || !data.message) {
    return {
      success: false,
      error: "All fields are required",
    };
  }

  // Simula envio para API (delay de 1s)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simula chance de erro (10%)
  if (Math.random() < 0.1) {
    return {
      success: false,
      error: "Failed to send message. Please try again.",
    };
  }

  return {
    success: true,
    message: `Thank you, ${data.name}! Your message has been sent.`,
  };
}
