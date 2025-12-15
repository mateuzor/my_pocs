import { useNavigate, useParams } from "react-router-dom";
import { USERS } from "../data/users";

export default function UserDetails() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const user = USERS.find((u) => u.id === userId);

  return (
    <div>
      <h1>User Details</h1>

      {!user ? (
        <p>User not found.</p>
      ) : (
        <>
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
        </>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {/* Volta 1 passo no histórico */}
        <button onClick={() => navigate(-1)}>Back</button>

        {/* Volta para a lista */}
        <button onClick={() => navigate("/users")}>Go to List</button>
      </div>
    </div>
  );
}
