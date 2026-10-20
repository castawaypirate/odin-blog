import { validationResult, matchedData } from "express-validator";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { validateLogin, validateRegister } from "../middleware/validate.js";
import {
  generateAccessToken,
  generateTokens,
  hashToken,
} from "../utils/tokens.js";
import requireRole from "../middleware/requireRole.js";

export const register = [
  validateRegister,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const user = matchedData(req);
    const hashedPassword = await bcrypt.hash(user.password, 10);

    let createdUser;

    if (user.secret) {
      if (user.secret === process.env.AUTHOR_SECRET) {
        createdUser = await prisma.user.create({
          data: {
            username: user.username,
            password: hashedPassword,
            role: "Author",
          },
        });
      } else {
        return res.status(400).json({ message: "Failed to sign up as author" });
      }
    } else {
      createdUser = await prisma.user.create({
        data: {
          username: user.username,
          password: hashedPassword,
          role: "User",
        },
      });
    }

    const { accessToken, refreshToken } = generateTokens(createdUser);

    const expiresAt = new Date();
    expiresAt.setDate(
      new Date().getDate() +
        Number(process.env.REFRESH_TOKEN_EXPIRY.slice(0, -1)),
    );

    const createdRefreshToken = await prisma.refreshToken.create({
      data: {
        hash: hashToken(refreshToken),
        userId: createdUser.id,
        expiresAt: expiresAt,
      },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 10 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    return res.json({ accessToken: accessToken });
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

    const { accessToken, refreshToken } = generateTokens(user);

    const expiresAt = new Date();
    expiresAt.setDate(
      new Date().getDate() +
        Number(process.env.REFRESH_TOKEN_EXPIRY.slice(0, -1)),
    );

    const createdRefreshToken = await prisma.refreshToken.create({
      data: {
        hash: hashToken(refreshToken),
        userId: user.id,
        expiresAt: expiresAt,
      },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 10 * 24 * 60 * 60 * 1000, //should sync it with the refresh token expiry
      sameSite: "lax",
    });

    return res.json({ accessToken: accessToken });
  },
];

export const logout = [
  async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.json({ message: "Already logged out" });
      }

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      await prisma.refreshToken.deleteMany({
        where: {
          hash: hashToken(refreshToken),
        },
      });
      return res.json({ message: "Logged out" });
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
];

export const refresh = [
  async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const userRefreshToken = await prisma.refreshToken.findFirst({
        where: {
          hash: hashToken(refreshToken),
          expiresAt: {
            gte: new Date(),
          },
        },
        include: {
          user: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!userRefreshToken) {
        res.clearCookie("refreshToken", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        return res.status(401).json({ message: "Unauthorized" });
      }

      const newAccessToken = generateAccessToken(userRefreshToken.user);

      return res.json({ accessToken: newAccessToken });
    } catch {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
];

export const whoAmI = [
  async (req, res) => {
    return res.json({ username: req.user.username, role: req.user.role });
  },
];

export const whoAuthorAmI = [
  requireRole("Author"),
  async (req, res) => {
    return res.json({ username: req.user.username, role: req.user.role });
  },
];
