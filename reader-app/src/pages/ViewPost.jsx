import { useState, useEffect } from "react";
import { useParams } from "react-router";
import usePosts from "../hooks/usePosts";

export default function ViewPost() {
  const { id } = useParams();
  const { getPost } = usePosts();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    async function getPublishedPost() {
      setLoading(true);
      const res = await getPost(id, signal);
      if (res.aborted) return;
      if (res.ok) {
        setPost(res.post);
        setLoading(false);
      } else {
        setError(new Error("Failed to load post"));
      }
    }
    getPublishedPost();

    return () => controller.abort();
  }, [getPost, id]);

  if (error) throw error;

  if (loading) return <></>;

  return (
    <div>
      <h1>{post?.title}</h1>
      <p>{post?.body}</p>
      <div>{post?.user.username}</div>
      <div>{post?.publishedAt}</div>
    </div>
  );
}
