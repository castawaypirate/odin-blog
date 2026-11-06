import { useEffect, useState } from "react";
import { usePosts } from "../hooks/usePosts";
import { useNavigate, useParams } from "react-router";

export default function ViewPost() {
  const { getAuthorPost } = usePosts();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate(); // maybe a back to dashboard button

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function getPost() {
      setLoading(true);
      const res = await getAuthorPost(id, signal);
      if (res.aborted) return;
      if (res.ok) {
        setPost(res.post);
        setLoading(false);
      } else {
        if (res.status === 404) {
          setError(new Error("Post not found"));
        } else {
          setError(new Error("Failed to load post"));
        }
      }
    }
    getPost();

    return () => {
      controller.abort();
    };
  }, [getAuthorPost, id]);

  if (error) throw error;

  if (loading) {
    return <></>;
  }

  return (
    <div>
      <h1>{post?.title}</h1>
      <p>{post?.body}</p>
      <div>{post?.state}</div>
      <div>{post?.createdAt}</div>
      <div>{post?.updatedAt}</div>
    </div>
  );
}
