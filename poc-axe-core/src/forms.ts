// Two versions of the same signup form. Keeping them as plain functions lets
// the SAME markup be tested in jsdom (unit) and in a real browser (e2e).

export function renderBad(): string {
  return `
    <div class="title">Sign up</div>
    <img src="/logo.png" />
    <input type="text" placeholder="Email" />
    <input type="password" placeholder="Password" />
    <div onclick="alert('submitted')" style="color:#aaa;background:#fff">Create account</div>
    <a href="#"></a>`;
}

export function renderGood(): string {
  return `
    <main>
      <h1>Sign up</h1>
      <img src="/logo.png" alt="Acme logo" />
      <form>
        <label for="email">Email</label>
        <input id="email" type="email" autocomplete="email" />
        <label for="password">Password</label>
        <input id="password" type="password" autocomplete="new-password" />
        <button type="submit" style="color:#1a1a1a;background:#fff">Create account</button>
      </form>
      <a href="/help">Need help signing up?</a>
    </main>`;
}
