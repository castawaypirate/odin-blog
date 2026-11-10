import { body, param } from "express-validator";
import { prisma } from "../lib/prisma.js";

export const validateRegister = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username cannot be empty")
    .custom(async (value) => {
      const existingUser = await prisma.user.findUnique({
        where: {
          username: value,
        },
      });

      if (existingUser) {
        throw new Error("A user already exists with this username");
      }
      return true;
    }),
  body("password").notEmpty().withMessage("Password cannot be empty"),
  body("confirm").custom((value, { req }) => {
    if (!value) {
      throw new Error("Confirm password cannot be empty");
    }
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
  body("secret").optional().trim(),
];

export const validateLogin = [
  body("username").trim().notEmpty().withMessage("Username cannot be empty"),
  body("password").notEmpty().withMessage("Password cannot be empty"),
  body("requireRole").optional().trim(),
];

export const validatePost = [
  body("title").trim().notEmpty().withMessage("Title cannot be empty"),
  body("body").trim().notEmpty().withMessage("Body cannot be empty"),
  body("state")
    .notEmpty()
    .withMessage("State cannot be empty")
    .isIn(["Draft", "Review", "Publish"]),
];

export const validatePostId = [
  param("postId").isUUID().withMessage("Invalid post id"),
];

export const validateComment = [
  body("body").trim().notEmpty().withMessage("Comment cannot be empty"),
  body("review")
    .exists()
    .withMessage("Review is required")
    .bail()
    .isBoolean()
    .withMessage("Review must be true or false")
    .toBoolean(),
];

export const validateCommentId = [
  param("commentId").isUUID().withMessage("Invalid comment id"),
];
