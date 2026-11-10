import { validationResult, matchedData } from "express-validator";
import { prisma } from "../lib/prisma.js";
import requireRole from "../middleware/requireRole.js";
import { validatePost, validatePostId } from "../middleware/validate.js";

export const create = [
  requireRole("Author"),
  validatePost,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const postData = matchedData(req);

    const createdPost = await prisma.post.create({
      data: {
        title: postData.title,
        body: postData.body,
        state: postData.state,
        user: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });

    return res.json(createdPost);
  },
];

export const edit = [
  requireRole("Author"),
  validatePost,
  validatePostId,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const postData = matchedData(req);

    const postToUpdate = await prisma.post.findUnique({
      where: {
        id: postData.postId,
        userId: req.user.id,
      },
    });

    if (!postToUpdate) {
      return res.status(404).json([{ msg: "Post not found" }]);
    }

    let publishedAt = null;
    if (postData.state === "Publish") {
      publishedAt = new Date();
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: postData.postId,
      },
      data: {
        title: postData.title,
        body: postData.body,
        state: postData.state,
        publishedAt: publishedAt,
      },
    });

    return res.json(updatedPost);
  },
];

export const remove = [
  requireRole("Author"),
  validatePostId,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const postData = matchedData(req);

    const postToDelete = await prisma.post.findUnique({
      where: {
        id: postData.postId,
        userId: req.user.id,
      },
    });

    if (!postToDelete) {
      return res.status(404).json([{ msg: "Post not found" }]);
    }

    const deletedPost = await prisma.post.delete({
      where: {
        id: postData.postId,
      },
    });

    return res.json(deletedPost);
  },
];

export const authorView = [
  requireRole("Author"),
  validatePostId,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const postData = matchedData(req);

    const post = await prisma.post.findUnique({
      where: {
        id: postData.postId,
        userId: req.user.id,
      },
    });

    if (!post) {
      return res.status(404).json([{ msg: "Post not found" }]);
    }

    return res.json(post);
  },
];

export const authorViewAll = [
  requireRole("Author"),
  async (req, res) => {
    const posts = await prisma.post.findMany({
      where: {
        userId: req.user.id,
      },
    });
    return res.json(posts);
  },
];

export const authorViewReviewPost = [
  requireRole("Author"),
  validatePostId,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const postData = matchedData(req);

    const post = await prisma.post.findFirst({
      where: {
        id: postData.postId,
        userId: {
          not: req.user.id,
        },
        state: "Review",
      },
      include: {
        user: {
          select: { username: true },
        },
      },
    });

    if (!post) {
      return res.status(404).json([{ msg: "Post not found" }]);
    }

    return res.json(post);
  },
];

export const authorViewReviewPosts = [
  requireRole("Author"),
  async (req, res) => {
    const posts = await prisma.post.findMany({
      where: {
        userId: {
          not: req.user.id,
        },
        state: "Review",
      },
      include: {
        user: {
          select: { username: true },
        },
      },
    });
    return res.json(posts);
  },
];

export const view = [
  validatePostId,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const postData = matchedData(req);

    const post = await prisma.post.findUnique({
      where: {
        id: postData.postId,
        state: "Publish",
      },
      include: {
        user: {
          select: { username: true },
        },
      },
    });

    if (!post) {
      return res.status(404).json([{ msg: "Post not found" }]);
    }

    return res.json(post);
  },
];

export const viewAll = [
  async (req, res) => {
    const posts = await prisma.post.findMany({
      where: {
        state: "Publish",
      },
      include: {
        user: {
          select: { username: true },
        },
      },
    });

    return res.json(posts);
  },
];
