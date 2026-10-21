import { useLoaderData } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Home() {
  // const data = useLoaderData();
  // console.log(data);

  const [accessToken, setAccessToken] = useContext(AuthContext);

  console.log(accessToken);

  return (
    <>
      <h1>where are re bru?</h1>
    </>
  );
}
