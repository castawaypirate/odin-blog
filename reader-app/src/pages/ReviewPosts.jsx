import { useState, useEffect } from "react";
import usePosts from "../hooks/usePosts";
import { useNavigate } from "react-router";

import styles from "./ReviewPosts.module.css";

export default function PostsReview() {
  const { getReviewPosts } = usePosts();
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchReviewPost() {
      setLoading(true);
      const res = await getReviewPosts(signal);
      if (res.aborted) return;
      if (res.ok) {
        setPosts([...res.posts]);
        setLoading(false);
      } else {
        setError(new Error("Failed to fetch posts for review"));
      }
    }

    fetchReviewPost();

    return () => controller.abort();
  }, [getReviewPosts]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const searchedReviewPosts = (title, body, username) => {
    if (!search) {
      return true;
    }

    if (
      title.toLowerCase().includes(search.toLowerCase()) ||
      body.toLowerCase().includes(search.toLowerCase()) ||
      username.toLowerCase().includes(search.toLowerCase())
    ) {
      return true;
    }
    return false;
  };

  const navigateToReviewPost = (id) => {
    navigate(`/review/${id}`);
  };

  if (error) throw error;

  if (loading) return <></>;

  return (
    <div>
      <div>
        <input
          type="search"
          name="search"
          value={search}
          onChange={handleSearch}
        />
      </div>
      <div>
        {posts.map(
          (p) =>
            searchedReviewPosts(p.title, p.body, p.user.username) && (
              <div key={p.id}>
                <div
                  className={styles.postTitle}
                  onClick={() => navigateToReviewPost(p.id)}
                >
                  {p.title}
                </div>
                <div>{p.user.username}</div>
                <div>{p.createdAt}</div>
                <div>{p.updatedAt}</div>
              </div>
            ),
        )}
      </div>
    </div>
  );
}
