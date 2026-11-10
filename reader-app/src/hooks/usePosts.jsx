import { useCallback } from "react";
import postsService from "../services/postsService";
import { useAuth } from "../contexts/AuthContext";
import { toErrors } from "../utils/errors";

export default function usePosts() {
  const { withRetry } = useAuth();

  const getPosts = useCallback(async (signal) => {
    try {
      const response = await postsService.getPosts(signal);

      if (response.ok) {
        const result = await response.json();
        return { ok: true, posts: result };
      }

      const status = response.status;
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
  }, []);

  const getPost = useCallback(async (id, signal) => {
    try {
      const response = await postsService.getPost(id, signal);

      if (response.ok) {
        const result = await response.json();

        return { ok: true, post: result };
      }

      const status = response.status;
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
  }, []);

  const getReviewPosts = useCallback(
    async (signal) => {
      try {
        const response = await withRetry((options) =>
          postsService.getReviewPosts({ ...options, signal }),
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

  const getReviewPost = useCallback(
    async (id, signal) => {
      try {
        const response = await withRetry((options) =>
          postsService.getReviewPost(id, { ...options, signal }),
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

  return { getPosts, getPost, getReviewPosts, getReviewPost };
}
