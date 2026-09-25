// Tiny app under test: login (token in localStorage) + todo list + remote suggestions.
const app = document.getElementById('app')!;
const TOKEN_KEY = 'token';

type Todo = { id: number; title: string; done: boolean };
let todos: Todo[] = [];

function render() {
  const loggedIn = !!localStorage.getItem(TOKEN_KEY);
  app.innerHTML = loggedIn ? todoView() : loginView();
  loggedIn ? bindTodo() : bindLogin();
}

function loginView() {
  return `
    <h1>Sign in</h1>
    <form id="login">
      <label>Username <input name="username" /></label><br />
      <label>Password <input name="password" type="password" /></label><br />
      <button type="submit">Sign in</button>
      <p class="error" role="alert"></p>
    </form>`;
}

function todoView() {
  return `
    <h1>My todos</h1>
    <button id="logout">Sign out</button>
    <form id="add"><input name="title" aria-label="New todo" /><button>Add</button></form>
    <ul aria-label="Todo list">
      ${todos.map((t) => `<li class="${t.done ? 'done' : ''}" data-id="${t.id}">
        <input type="checkbox" ${t.done ? 'checked' : ''} aria-label="Toggle ${t.title}" />
        <span>${t.title}</span></li>`).join('')}
    </ul>
    <button id="suggest">Load suggestions</button>
    <p id="suggest-status" role="status"></p>`;
}

function bindLogin() {
  const form = document.getElementById('login') as HTMLFormElement;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    if (data.get('username') === 'demo' && data.get('password') === 'demo') {
      localStorage.setItem(TOKEN_KEY, 'fake-jwt');
      render();
    } else {
      form.querySelector('.error')!.textContent = 'Invalid credentials';
    }
  });
}

function bindTodo() {
  document.getElementById('logout')!.onclick = () => {
    localStorage.removeItem(TOKEN_KEY);
    render();
  };
  const add = document.getElementById('add') as HTMLFormElement;
  add.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = String(new FormData(add).get('title') ?? '').trim();
    if (title) todos.push({ id: Date.now() + todos.length, title, done: false });
    render();
  });
  document.querySelectorAll<HTMLInputElement>('li input[type=checkbox]').forEach((box) => {
    box.onchange = () => {
      const id = Number(box.closest('li')!.dataset.id);
      const t = todos.find((x) => x.id === id)!;
      t.done = box.checked;
      render();
    };
  });
  document.getElementById('suggest')!.onclick = async () => {
    const status = document.getElementById('suggest-status')!;
    try {
      const res = await fetch('/api/suggestions');
      if (!res.ok) throw new Error(String(res.status));
      const items: string[] = await res.json();
      todos.push(...items.map((title, i) => ({ id: Date.now() + i, title, done: false })));
      render();
    } catch {
      status.textContent = 'Could not load suggestions';
    }
  };
}

render();
