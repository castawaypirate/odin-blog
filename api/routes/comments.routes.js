import { Router } from "express";
import passport from "passport";
import "../config/passport.js";
import {
  getReviewPostComments,
  createReviewPostComment,
  editReviewPostComment,
  removeReviewPostComment,
  getPostComments,
  createPostComment,
  editPostComment,
  removePostComment,
} from "../controllers/comments.controller.js";

const commentsRouter = Router();

commentsRouter.post(
  "/review/:postId/comments",
  passport.authenticate("jwt", { session: false }),
  createReviewPostComment,
);

commentsRouter.put(
  "/review/:postId/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  editReviewPostComment,
);

commentsRouter.delete(
  "/review/:postId/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  removeReviewPostComment,
);

commentsRouter.get(
  "/review/:postId/comments",
  passport.authenticate("jwt", { session: false }),
  getReviewPostComments,
);

commentsRouter.post(
  "/posts/:postId/comments",
  passport.authenticate("jwt", { session: false }),
  createPostComment,
);

commentsRouter.put(
  "/posts/:postId/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  editPostComment,
);

commentsRouter.delete(
  "/posts/:postId/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  removePostComment,
);

commentsRouter.get("/posts/:postId/comments", getPostComments);

export default commentsRouter;
