import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";

const auth = Router();

auth.post("/register", register);

auth.post("/login", login);

export default auth;
