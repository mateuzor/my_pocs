import { Link } from "react-router-dom";
import { USERS } from "../data/users";

export default function Users() {
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {USERS.map((u) => (
          <li key={u.id}>
            <Link to={`/users/${u.id}`}>Open {u.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
