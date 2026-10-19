import { validationResult, matchedData } from "express-validator";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { validateLogin, validateRegister } from "../middleware/validate.js";

export const register = [
  validateRegister,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const user = matchedData(req);
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const createdUser = await prisma.user.create({
      data: {
        username: user.username,
        password: hashedPassword,
        role: "User",
      },
    });

    return res.json(createdUser);
  },
];

export const login = [
  validateLogin,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const loginData = matchedData(req);
    const user = await prisma.user.findUnique({
      where: { username: loginData.username },
    });

    if (!user) {
      return res.status(401).json("Invalid username or password");
    }

    const match = await bcrypt.compare(loginData.password, user.password);

    if (!match) {
      return res.status(401).json("Invalid username or password");
    }

    return res.json(user);
  },
];
