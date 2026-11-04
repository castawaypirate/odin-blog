import { useAuth } from "../contexts/AuthContext";
import postsService from "../services/postsService";
import { useCallback } from "react";

export function usePosts() {
  const { withRetry } = useAuth();

  const getAuthorPosts = useCallback(
    async (signal) => {
      try {
        const response = await withRetry((options) =>
          postsService.getAuthorPosts({ ...options, signal }),
        );

        if (response.ok) {
          const result = await response.json();
          return { ok: true, posts: result };
        }

        const status = response.status ?? response.refreshResponse.status;
        return { ok: false, status };
      } catch (err) {
        if (err.name === "AbortError") return { ok: false, aborted: true };
        console.error(err);
        return { ok: false, status: 500 };
      }
    },
    [withRetry],
  );

  const getAuthorPost = useCallback(
    async (param, signal) => {
      try {
        const response = await withRetry((options) =>
          postsService.getAuthorPost(param, { ...options, signal }),
        );

        if (response.ok) {
          const result = await response.json();
          return { ok: true, post: result };
        }

        const status = response.status ?? response.refreshResponse.status;
        return { ok: false, status };
      } catch (err) {
        if (err.name === "AbortError") return { ok: false, aborted: true };
        console.error(err);
        return { ok: false, status: 500 };
      }
    },
    [withRetry],
  );

  const createPost = useCallback(
    async (data) => {
      try {
        const response = await withRetry((options) =>
          postsService.createPost(data, options),
        );

        if (response.ok) {
          const result = await response.json();
          return { ok: true, post: result };
        }

        const status = response.status ?? response.refreshResponse.status;
        let createResponse;
        if (response.refreshResponse) {
          createResponse = response.refreshResponse;
        } else {
          createResponse = await response.json();
        }
        return { ok: false, status, response: createResponse };
      } catch (err) {
        console.error(err);
        return {
          ok: false,
          response: [{ msg: "Something went wrong" }],
        };
      }
    },
    [withRetry],
  );

  const editPost = useCallback(
    async (id, data) => {
      try {
        const response = await withRetry((options) =>
          postsService.editPost(id, data, options),
        );

        if (response.ok) {
          const result = await response.json();
          return { ok: true, post: result };
        }

        const status = response.status ?? response.refreshResponse.status;
        let editResponse;
        if (response.refreshResponse) {
          editResponse = response.refreshResponse;
        } else {
          // const text = await response.text();
          editResponse = await response.json();
        }
        return { ok: false, status, response: editResponse };
      } catch (err) {
        console.error(err);
        return {
          ok: false,
          response: [{ msg: "Something went wrong" }],
        };
      }
    },
    [withRetry],
  );

  const deletePost = useCallback(
    async (id) => {
      try {
        const response = await withRetry((options) =>
          postsService.deletePost(id, options),
        );

        if (response.ok) {
          const result = await response.json();
          return { ok: true, post: result };
        }

        const status = response.status ?? response.refreshResponse.status;
        let deleteResponse;
        if (response.refreshResponse) {
          deleteResponse = response.refreshResponse;
        } else {
          deleteResponse = await response.json();
        }
        return { ok: false, status, response: deleteResponse };
      } catch (err) {
        console.error(err);
        return {
          ok: false,
          response: [{ msg: "Something went wrong" }],
        };
      }
    },
    [withRetry],
  );

  return { getAuthorPosts, getAuthorPost, createPost, editPost, deletePost };
}

// useEffect(() => {
//   async function getAuthorPosts() {
//     try {
//       const response = await withRetry((options) =>
//         postsService.getAuthorPosts(options),
//       );
//
//       if (!response.ok) {
//         console.log(response);
//       } else {
//         const result = await response.json();
//         // console.log(result);
//         setPosts(result);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   }
//
//   getAuthorPosts();
// }, []);

// return { posts };

// async function getAuthorPosts() {
//   try {
//     const response = await withRetry((options) =>
//       postsService.getAuthorPosts(options),
//     );
//
//     if (!response.ok) {
//       console.log(response);
//     } else {
//       const result = await response.json();
//       // console.log(result);
//       // setPosts(result);
//       return result;
//     }
//   } catch (err) {
//     console.error(err);
//   }
// }

// const getAuthorPosts = useCallback(async () => {
//     try {
//       const response = await withRetry((options) =>
//         postsService.getAuthorPosts(options),
//       );
//
//       if (!response.ok) {
//         console.log(response);
//       } else {
//         const result = await response.json();
//         // console.log(result);
//         setPosts(result);
//       }
//     } catch (err) {
//       console.error(err);
//     }
// }, [])

// const [data, setData] = useState(null);
// const [loading, setLoading] = useState(true);
// const [error, setError] = useState(null);
//
// useEffect(() => {
//   const controller = new AbortController();
//   async function fetchData() {
//     try {
//       const response = await fetch(url);
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
// }, [url]);
//
// return [data, loading, error];
