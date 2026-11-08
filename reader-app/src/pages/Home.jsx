import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <h1>where are re bru?</h1>
      {user && (
        <div>
          <p>{user.username}</p>
        </div>
      )}
    </>
  );
}
