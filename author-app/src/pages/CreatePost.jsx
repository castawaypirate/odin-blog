import { useState } from "react";
import { useNavigate } from "react-router";
import { usePosts } from "../hooks/usePosts";

export default function CreatePost() {
  const { createPost } = usePosts();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    body: "",
    state: "Draft",
  });
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const response = await createPost(formData);
    if (response.ok) {
      navigate("/", { replace: true });
      return;
    }
    setErrors([...response.response]);
    setSubmitting(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1>Create post</h1>
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
            type="text"
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
            defaultValue="Draft"
            onChange={handleChange}
          >
            <option value="Draft">Draft</option>
            <option value="Review">Review</option>
            <option value="Publish">Publish</option>
          </select>
        </div>
        <button disabled={submitting} type="submit">
          Create
        </button>
      </form>
    </>
  );
}
