import { useEffect, useState } from "react";
import postsService from "../services/postsService";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  // const [data, loading, error] = useFetch("/author/posts");

  const { accessTokenRef } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchData() {
      console.log(accessTokenRef.current);
      try {
        // const response = await postsService.getAuthorPosts({});
        const response = await postsService.getAuthorPosts({
          headers: {
            Authorization: `Bearer ${accessTokenRef.current}`,
          },
        });
        console.log(response);
        const json = await response.json();
        console.log(json);
        setData(json);
      } catch (err) {
        // console.error(err);
        setError(err.msg);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    return () => controller.abort();
  }, []);

  return <>{data && data.map((post) => <div>{post.title}</div>)}</>;
}

// function useFetch(url) {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//
//   useEffect(() => {
//     const controller = new AbortController();
//     async function fetchData() {
//       try {
//         const response = await fetch(url);
//         const json = await response.json();
//         console.log(json);
//         setData(json);
//       } catch (err) {
//         // console.error(err);
//         setError(err.msg);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchData();
//     return () => controller.abort();
//   }, [url]);
//
//   return [data, loading, error];
// }
