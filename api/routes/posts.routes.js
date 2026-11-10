import { Router } from "express";
import passport from "passport";
import "../config/passport.js";
import {
  create,
  edit,
  remove,
  authorView,
  authorViewAll,
  authorViewReviewPost,
  authorViewReviewPosts,
  view,
  viewAll,
} from "../controllers/posts.controller.js";

const postsRouter = Router();

postsRouter.post(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  create,
);

postsRouter.put(
  "/posts/:postId",
  passport.authenticate("jwt", { session: false }),
  edit,
);

postsRouter.delete(
  "/posts/:postId",
  passport.authenticate("jwt", { session: false }),
  remove,
);

postsRouter.get(
  "/author/posts/:postId",
  passport.authenticate("jwt", { session: false }),
  authorView,
);

postsRouter.get(
  "/author/posts",
  passport.authenticate("jwt", { session: false }),
  authorViewAll,
);

postsRouter.get(
  "/review/posts/:postId",
  passport.authenticate("jwt", { session: false }),
  authorViewReviewPost,
);

postsRouter.get(
  "/review/posts",
  passport.authenticate("jwt", { session: false }),
  authorViewReviewPosts,
);

postsRouter.get("/posts/:postId", view);

postsRouter.get("/posts", viewAll);

export default postsRouter;
