import { Router } from "express";
import passport from "passport";
import "../config/passport.js";
import {
  create,
  edit,
  remove,
  authorView,
  authorViewAll,
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
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  edit,
);

postsRouter.delete(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  remove,
);

postsRouter.get(
  "/author/posts/:id",
  passport.authenticate("jwt", { session: false }),
  authorView,
);

postsRouter.get(
  "/author/posts",
  passport.authenticate("jwt", { session: false }),
  authorViewAll,
);

postsRouter.get("/posts/:id", view);

postsRouter.get("/posts", viewAll);

export default postsRouter;
