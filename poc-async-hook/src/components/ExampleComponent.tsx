import { useEffect } from "react";
import { useAsync } from "../hooks/useAsync";

export default function ExampleComponent() {
  const { status, data, error, execute } = useAsync(async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts/1");
    return res.json();
  });

  useEffect(() => {
    execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h2>Async Hook Example</h2>
      <p>Status: {status}</p>
      {status === "pending" && <p>Loading...</p>}
      {status === "error" && <p>Error: {error?.message}</p>}
      {status === "success" && data && (
        <div>
          <h3>{data.title}</h3>
          <p>{data.body}</p>
        </div>
      )}
    </div>
  );
}
