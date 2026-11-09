import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { usePosts } from "../hooks/usePosts";

export default function EditPost() {
  const { getAuthorPost, editPost } = usePosts();
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [fetchingError, setFetchingError] = useState();
  const { id } = useParams();
  const navigate = useNavigate(); // maybe a back to dashboard button

  const [formData, setFormData] = useState({
    title: "",
    body: "",
    state: "",
  });

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function getPost() {
      setLoading(true);
      const res = await getAuthorPost(id, signal);
      if (res.aborted) return;
      if (res.ok) {
        setFormData({ ...res.post });
        setLoading(false);
      } else {
        if (res.status === 404) {
          setFetchingError(new Error("Post not found"));
        } else {
          setFetchingError(new Error("Failed to load post"));
        }
      }
    }
    getPost();

    return () => {
      controller.abort();
    };
  }, [getAuthorPost, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const response = await editPost(id, formData);
    if (response.ok) {
      navigate("/", { replace: true });
      return;
    }
    setErrors([...response.errors]);
    setUpdating(false);
  };

  if (fetchingError) {
    throw fetchingError;
  }

  if (loading) {
    return <></>;
  }

  return (
    <>
      <form onSubmit={handleUpdate}>
        <h1>Edit post</h1>
        {errors.length
          ? errors.map((error, index) => <p key={index}>{error.msg}</p>)
          : ""}
        <div>
          <input
            onChange={handleChange}
            type="text"
            name="title"
            id="title"
            placeholder="Title"
            value={formData.title}
          />
        </div>
        <div>
          <textarea
            onChange={handleChange}
            name="body"
            id="body"
            placeholder="Body"
            value={formData.body}
          />
        </div>

        <div>
          <select
            name="state"
            id="state"
            value={formData.state}
            onChange={handleChange}
          >
            <option value="Draft">Draft</option>
            <option value="Review">Review</option>
            <option value="Publish">Publish</option>
          </select>
        </div>
        <button disabled={updating} type="submit">
          Update
        </button>
      </form>
    </>
  );
}
