// import { useContext } from "react";
// import { AuthContext } from "../contexts/AuthContext";

import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  // const [user, setUser, accessToken, setAccessToken] = useContext(AuthContext);
  // const { user } = useContext(AuthContext);

  const { user } = useAuth();
  // const { fetchUser, user } = useAuth();

  return (
    <>
      <h1>where are re bru?</h1>
      {user && (
        <div>
          <p>{user.username}</p>
          <p>{user.username}</p>
        </div>
      )}
    </>
  );
}
