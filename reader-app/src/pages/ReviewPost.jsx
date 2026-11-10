import { useState, useEffect } from "react";
import usePosts from "../hooks/usePosts";
import { useParams } from "react-router";

export default function ReviewPost() {
  const { getReviewPost } = usePosts();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchReviewPost() {
      setLoading(true);
      const res = await getReviewPost(id, signal);
      if (res.aborted) return;
      if (res.ok) {
        setPost(res.post);
        setLoading(false);
      } else {
        setError(new Error("Failed to load post"));
      }
    }
    fetchReviewPost();

    return () => controller.abort;
  }, [getReviewPost, id]);

  if (error) throw error;

  if (loading) return <></>;

  return (
    <div>
      <h1>{post?.title}</h1>
      <p>{post?.body}</p>
      <div>{post?.user.username}</div>
      <div>{post?.createdAt}</div>
      <div>{post?.updatedAt}</div>
    </div>
  );
}
