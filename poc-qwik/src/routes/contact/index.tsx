import { component$ } from '@builder.io/qwik';
import { Form, routeAction$ } from '@builder.io/qwik-city';

// routeAction$ runs ON THE SERVER when the form POSTs. <Form> submits to it
// without a full page reload and surfaces the returned value (incl. validation
// errors) back to the component — progressively enhanced, works without JS too.
export const useContactAction = routeAction$(async (data) => {
  const email = String(data.email ?? '');
  if (!email.includes('@')) {
    return { success: false, message: 'invalid email' };
  }
  return { success: true, message: `thanks, ${email}` };
});

export default component$(() => {
  const action = useContactAction();
  return (
    <main>
      <h1>Contact</h1>
      <Form action={action}>
        <input name="email" placeholder="email" />
        <button type="submit">send</button>
      </Form>
      {action.value && <p>{action.value.message}</p>}
    </main>
  );
});
