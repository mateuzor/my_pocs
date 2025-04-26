import React from "react";

export default async function Home() {
  const request = await fetch("https://api.github.com/users/google/repos");
  const data = await request.json();

  return (
    <main>
      <h1>Google Repositories</h1>
      <ul>
        {data.map((repo: any) => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noreferrer">
              {repo.name}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
