import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Home() {
  const [user, setUser, accessToken, setAccessToken] = useContext(AuthContext);
  console.log(user);

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
