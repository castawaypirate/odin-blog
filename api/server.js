import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";

const server = express();
const port = process.env.PORT || 8000;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

server.use(cookieParser());

server.use(authRouter);

server.use((req, res, next) => {
  return res.status(404).json([{ msg: "Where are you going, bruh?" }]);
});

server.use((err, req, res, next) => {
  return res.status(500).json([{ msg: "Something went very wrung, bruh!" }]);
});

server.listen(port, (error) => {
  if (error) {
    throw error;
  }

  console.log(`Server listening at port: ${port}`);
});
