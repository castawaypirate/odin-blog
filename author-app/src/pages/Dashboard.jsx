import { useEffect, useState } from "react";
import { usePosts } from "../hooks/usePosts";
import { useRef } from "react";
import { useNavigate } from "react-router";

import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { getAuthorPosts, deletePost } = usePosts();
  const [search, setSearch] = useState("");
  const [stateChecked, setStateChecked] = useState(
    new Set(["Draft", "Review", "Publish"]),
  );
  const [posts, setPosts] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingError, setDeletingError] = useState(null);
  const navigate = useNavigate();
  const controller = useRef(null);

  useEffect(() => {
    controller.current = new AbortController();
    const signal = controller.current.signal;

    async function getPosts() {
      setLoading(true);
      const res = await getAuthorPosts(signal);
      if (res.aborted) return;
      if (res.ok) {
        setPosts([...res.posts]);
        setLoading(false);
      } else {
        setError(new Error("Failed to load posts"));
      }
    }
    getPosts();

    return () => {
      controller.current.abort();
    };
  }, [getAuthorPosts]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const searchedPosts = (title, body) => {
    if (search === "") {
      return true;
    }
    if (
      title
        .toLowerCase()
        .includes(
          search.toLowerCase() ||
            body.toLowerCase().includes(search.toLowerCase()),
        )
    ) {
      return true;
    }
    return false;
  };

  const handleStateChecked = async (e) => {
    if (stateChecked.has(e.target.value)) {
      stateChecked.delete(e.target.value);
    } else {
      stateChecked.add(e.target.value);
    }
    setStateChecked(new Set(stateChecked));
  };

  const navigateToPost = (id) => {
    navigate(`/post/${id}`);
  };

  const navigateToEditPost = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleDeletePost = async (id) => {
    setDeletingId(id);
    setDeletingError(null);
    const response = await deletePost(id);
    setDeletingId(null);
    if (response.ok || response.status === 404) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      return;
    }

    setDeletingError({ postId: id, errors: response.errors });
  };

  if (error) throw error;

  if (loading) return <></>;

  return (
    <>
      <h1>Author posts</h1>
      <div>
        <input
          type="search"
          value={search}
          onChange={handleSearch}
          placeholder="Search posts..."
        />
      </div>
      <div className={styles.checkboxGroup}>
        <input
          type="checkbox"
          id="draft"
          value="Draft"
          checked={stateChecked.has("Draft")}
          onChange={handleStateChecked}
        />
        <label htmlFor="draft">Draft</label>
        <input
          type="checkbox"
          id="review"
          value="Review"
          checked={stateChecked.has("Review")}
          onChange={handleStateChecked}
        />
        <label htmlFor="review">Review</label>
        <input
          type="checkbox"
          id="publish"
          value="Publish"
          checked={stateChecked.has("Publish")}
          onChange={handleStateChecked}
        />
        <label htmlFor="publish">Publish</label>
      </div>
      <div>
        {posts?.length > 0 ? (
          posts.map(
            (post) =>
              stateChecked.has(post.state) &&
              searchedPosts(post.title, post.body) && (
                <div key={post.id}>
                  <div
                    className={styles.postTitle}
                    onClick={() => navigateToPost(post.id)}
                  >
                    {post.title}
                  </div>
                  <div>{post.body}</div>
                  <div>{post.state}</div>
                  <div>{post.createdAt}</div>
                  <div>{post.updatedAt}</div>
                  <button onClick={() => navigateToEditPost(post.id)}>
                    Edit
                  </button>

                  {deletingError?.postId === post.id
                    ? deletingError.errors.map((error, index) => (
                        <p key={index}>{error.msg}</p>
                      ))
                    : ""}
                  <button
                    disabled={deletingId === post.id}
                    onClick={() => handleDeletePost(post.id)}
                  >
                    Delete
                  </button>
                </div>
              ),
          )
        ) : (
          <div>No posts yet</div>
        )}
      </div>
    </>
  );
}
