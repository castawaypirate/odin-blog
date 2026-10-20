import { Router } from "express";
import passport from "passport";
import {
  register,
  login,
  whoAmI,
  whoAuthorAmI,
  refresh,
  logout,
} from "../controllers/auth.controller.js";
import "../config/passport.js";

const authRouter = Router();

authRouter.post("/register", register);

authRouter.post("/login", login);

authRouter.post("/logout", logout);

authRouter.post("/refresh", refresh);

authRouter.get("/me", passport.authenticate("jwt", { session: false }), whoAmI);

authRouter.get(
  "/author/me",
  passport.authenticate("jwt", { session: false }),
  whoAuthorAmI,
);

export default authRouter;
