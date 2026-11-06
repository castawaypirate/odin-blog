import { useAuth } from "../contexts/AuthContext";
import postsService from "../services/postsService";
import { useCallback } from "react";
import { toErrors } from "../utils/errors";

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
        const errors = await toErrors(response);
        return { ok: false, status, errors };
      } catch (err) {
        if (err.name === "AbortError") return { ok: false, aborted: true };
        console.error(err);
        return {
          ok: false,
          status: 500,
          errors: [{ msg: "Something went wrong" }],
        };
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
        const errors = await toErrors(response);
        return { ok: false, status, errors };
      } catch (err) {
        if (err.name === "AbortError") return { ok: false, aborted: true };
        console.error(err);
        return {
          ok: false,
          status: 500,
          errors: [{ msg: "Something went wrong" }],
        };
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

        if (response.refreshResponse) {
          return {
            ok: false,
            status: response.refreshResponse.status,
            errors: [{ msg: response.refreshResponse.msg }],
          };
        }

        const errors = await toErrors(response);
        return { ok: false, status: response.status, errors };
      } catch (err) {
        console.error(err);
        return {
          ok: false,
          status: 500,
          errors: [{ msg: "Something went wrong" }],
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

        if (response.refreshResponse) {
          return {
            ok: false,
            status: response.refreshResponse.status,
            errors: [{ msg: response.refreshResponse.msg }],
          };
        }

        const errors = await toErrors(response);
        return { ok: false, status: response.status, errors };
      } catch (err) {
        console.error(err);
        return {
          ok: false,
          status: 500,
          errors: [{ msg: "Something went wrong" }],
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

        if (response.refreshResponse) {
          return {
            ok: false,
            status: response.refreshResponse.status,
            errors: [{ msg: response.refreshResponse.msg }],
          };
        }

        const errors = await toErrors(response);
        return { ok: false, status: response.status, errors };
      } catch (err) {
        console.error(err);
        return {
          ok: false,
          status: 500,
          errors: [{ msg: "Something went wrong" }],
        };
      }
    },
    [withRetry],
  );

  return { getAuthorPosts, getAuthorPost, createPost, editPost, deletePost };
}
