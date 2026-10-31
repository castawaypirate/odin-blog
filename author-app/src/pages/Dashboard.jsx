import { useEffect, useState } from "react";
import postsService from "../services/postsService";
import { useAuth } from "../contexts/AuthContext";
import { usePosts } from "../hooks/usePosts";

export default function Dashboard() {
  const { getAuthorPosts } = usePosts();
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    async function test() {
      const res = await getAuthorPosts();
      setPosts(res);
    }
    test();
  }, [getAuthorPosts]);

  // const { posts } = usePosts();
  // console.log(posts);
  // const { fetchAuthor } = useAuth();
  // useEffect(() => {
  //   async function test() {
  //     try {
  //       await fetchAuthor();
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  //   test();
  // }, []);

  return <>Dashboard</>;
}

// const [data, loading, error] = useFetch("/author/posts");
// const { accessTokenRef } = useAuth();
// const [data, setData] = useState(null);
// const [loading, setLoading] = useState(true);
// const [error, setError] = useState(null);
//
// useEffect(() => {
//   const controller = new AbortController();
//   async function fetchData() {
//     console.log(accessTokenRef.current);
//     try {
//       // const response = await postsService.getAuthorPosts({});
//       const response = await postsService.getAuthorPosts({
//         headers: {
//           Authorization: `Bearer ${accessTokenRef.current}`,
//         },
//       });
//       console.log(response);
//       const json = await response.json();
//       console.log(json);
//       setData(json);
//     } catch (err) {
//       // console.error(err);
//       setError(err.msg);
//     } finally {
//       setLoading(false);
//     }
//   }
//   fetchData();
//   return () => controller.abort();
// }, []);
//
// return <>{data && data.map((post) => <div>{post.title}</div>)}</>;
