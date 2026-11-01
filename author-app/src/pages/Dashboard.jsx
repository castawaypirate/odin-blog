import { useEffect, useState } from "react";
import { usePosts } from "../hooks/usePosts";
import { useRef } from "react";

export default function Dashboard() {
  const { getAuthorPosts } = usePosts();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const controller = useRef(null);

  useEffect(() => {
    controller.current = new AbortController();
    const signal = controller.current.signal;

    async function getPosts() {
      const res = await getAuthorPosts(signal);
      if (res.aborted) return;
      if (res.ok) {
        setPosts([...res.posts]);
      } else {
        setError(new Error("Failed to load posts"));
      }
    }
    getPosts();

    return () => {
      controller.current.abort();
    };
  }, [getAuthorPosts]);

  console.log(posts);

  if (error) throw error;

  return (
    <>
      <h1>Author posts</h1>
      <div>
        {posts?.length > 0 ? (
          posts.map((post) => (
            <div key={post.id}>
              <div>{post.title}</div>
              <div>{post.body}</div>
              <div>{post.state}</div>
              <div>{post.createdAt}</div>
              <div>{post.updatedAt}</div>
            </div>
          ))
        ) : (
          <div>No posts yet</div>
        )}
      </div>
    </>
  );
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
