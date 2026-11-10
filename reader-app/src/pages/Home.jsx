import { useEffect, useState } from "react";
import usePosts from "../hooks/usePosts";
import { useNavigate } from "react-router";

import styles from "./Home.module.css";

export default function Home() {
  const { getPosts } = usePosts();
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    async function getPublishedPosts() {
      setLoading(true);
      const res = await getPosts(signal);
      if (res.aborted) return;
      if (res.ok) {
        setPosts([...res.posts]);

        setLoading(false);
      } else {
        setError(new Error("Failed to load posts"));
      }
    }
    getPublishedPosts();

    return () => controller.abort();
  }, [getPosts]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const searchedPosts = (title, body, username) => {
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

  const navigatePost = (id) => {
    navigate(`/post/${id}`);
  };

  if (error) {
    throw error;
  }

  if (loading) {
    return <></>;
  }

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
            searchedPosts(p.title, p.body, p.user.username) && (
              <div key={p.id}>
                <div
                  className={styles.postTitle}
                  onClick={() => navigatePost(p.id)}
                >
                  {p.title}
                </div>
                <div>{p.user.username}</div>
                <div>{p.publishedAt}</div>
              </div>
            ),
        )}
      </div>
    </div>
  );
}
