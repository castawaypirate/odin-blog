import { validationResult, matchedData } from "express-validator";
import { prisma } from "../lib/prisma.js";
import requireRole from "../middleware/requireRole.js";
import {
  validatePostId,
  validateCommentId,
  validateComment,
} from "../middleware/validate.js";

export const getReviewPostComments = [
  requireRole("Author"),
  validatePostId,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const commentData = matchedData(req);

    const post = await prisma.post.findUnique({
      where: {
        id: commentData.postId,
        state: "Review",
      },
    });

    if (!post) {
      return res.status(404).json([{ msg: "Post not found" }]);
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId: commentData.postId,
      },
      include: {
        user: {
          select: { username: true },
        },
      },
    });

    return res.json(comments);
  },
];

export const createReviewPostComment = [
  requireRole("Author"),
  validatePostId,
  validateComment,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const commentData = matchedData(req);

    if (!commentData.review) {
      return res.status(403).json([{ msg: "Forbidden comment creation" }]);
    }

    const post = await prisma.post.findUnique({
      where: {
        id: commentData.postId,
      },
    });

    if (!post) {
      return res.status(404).json([{ msg: "Post not found" }]);
    }

    if (post.state !== "Review") {
      return res.status(403).json([{ msg: "Forbidden comment creation" }]);
    }

    const comment = await prisma.comment.create({
      data: {
        body: commentData.body,
        review: commentData.review,
        post: {
          connect: {
            id: commentData.postId,
          },
        },
        user: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });

    return res.json(comment);
  },
];

export const editReviewPostComment = [
  requireRole("Author"),
  validatePostId,
  validateCommentId,
  validateComment,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const commentData = matchedData(req);

    if (!commentData.review) {
      return res.status(403).json([{ msg: "Forbidden comment update" }]);
    }

    const post = await prisma.post.findUnique({
      where: {
        id: commentData.postId,
      },
    });

    if (!post) {
      return res.status(404).json([{ msg: "Post not found" }]);
    }

    if (post.state !== "Review") {
      return res.status(403).json([{ msg: "Forbidden comment creation" }]);
    }

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentData.commentId,
        userId: req.user.id,
      },
    });

    if (!comment) {
      return res.status(404).json([{ msg: "Comment not found" }]);
    }

    const updatedComment = await prisma.comment.update({
      where: {
        id: commentData.commentId,
      },
      data: {
        body: commentData.body,
      },
    });

    return res.json(updatedComment);
  },
];

export const removeReviewPostComment = [
  requireRole("Author"),
  validatePostId,
  validateCommentId,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const commentData = matchedData(req);

    const post = await prisma.post.findUnique({
      where: {
        id: commentData.postId,
      },
    });

    if (!post) {
      return res.status(404).json([{ msg: "Post not found" }]);
    }

    if (post.state !== "Review") {
      return res.status(403).json([{ msg: "Forbidden comment deletion" }]);
    }

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentData.commentId,
        userId: req.user.id,
      },
    });

    if (!comment) {
      return res.status(404).json([{ msg: "Comment not found" }]);
    }

    const deletedComment = await prisma.comment.delete({
      where: {
        id: commentData.commentId,
      },
    });

    return res.json(deletedComment);
  },
];

export const getPostComments = [
  validatePostId,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const commentData = matchedData(req);

    const post = await prisma.post.findUnique({
      where: {
        id: commentData.postId,
        state: "Publish",
      },
    });

    if (!post) {
      return res.status(404).json([{ msg: "Post not found" }]);
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId: commentData.postId,
      },
      include: {
        user: {
          select: { username: true },
        },
      },
    });

    return res.json(comments);
  },
];

export const createPostComment = [
  validatePostId,
  validateComment,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const commentData = matchedData(req);

    if (commentData.review) {
      return res.status(403).json([{ msg: "Forbidden comment creation" }]);
    }

    const post = await prisma.post.findUnique({
      where: {
        id: commentData.postId,
      },
    });

    if (!post) {
      return res.status(404).json([{ msg: "Post not found" }]);
    }

    if (post.state !== "Publish") {
      return res.status(403).json([{ msg: "Forbidden comment creation" }]);
    }

    const comment = await prisma.comment.create({
      data: {
        body: commentData.body,
        review: commentData.review,
        post: {
          connect: {
            id: commentData.postId,
          },
        },
        user: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });

    return res.json(comment);
  },
];

export const editPostComment = [
  validatePostId,
  validateCommentId,
  validateComment,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const commentData = matchedData(req);

    if (commentData.review) {
      return res.status(403).json([{ msg: "Forbidden comment update" }]);
    }

    const post = await prisma.post.findUnique({
      where: {
        id: commentData.postId,
      },
    });

    if (!post) {
      return res.status(404).json([{ msg: "Post not found" }]);
    }

    if (post.state !== "Publish") {
      return res.status(403).json([{ msg: "Forbidden comment creation" }]);
    }

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentData.commentId,
        userId: req.user.id,
      },
    });

    if (!comment) {
      return res.status(404).json([{ msg: "Comment not found" }]);
    }

    const updatedComment = await prisma.comment.update({
      where: {
        id: commentData.commentId,
      },
      data: {
        body: commentData.body,
      },
    });

    return res.json(updatedComment);
  },
];

export const removePostComment = [
  validatePostId,
  validateCommentId,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const commentData = matchedData(req);

    const post = await prisma.post.findUnique({
      where: {
        id: commentData.postId,
      },
    });

    if (!post) {
      return res.status(404).json([{ msg: "Post not found" }]);
    }

    if (post.state !== "Publish") {
      return res.status(403).json([{ msg: "Forbidden comment deletion" }]);
    }

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentData.commentId,
        userId: req.user.id,
      },
    });

    if (!comment) {
      return res.status(404).json([{ msg: "Comment not found" }]);
    }

    const deletedComment = await prisma.comment.delete({
      where: {
        id: commentData.commentId,
      },
    });

    return res.json(deletedComment);
  },
];
