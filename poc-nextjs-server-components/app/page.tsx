export default async function Home() {
  const data = await fetchData();

  return (
    <main>
      <h1>Next.js App Using Server Components Only</h1>
      <p>This content is fully rendered on the server.</p>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </main>
  );
}

async function fetchData() {
  return [
    { id: 1, title: 'Server-rendered item 1' },
    { id: 2, title: 'Server-rendered item 2' },
    { id: 3, title: 'Server-rendered item 3' },
  ];
}