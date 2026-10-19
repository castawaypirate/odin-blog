import express from "express";
import auth from "./routes/auth.routes.js";

const server = express();
const port = process.env.PORT || 8000;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(auth);

server.listen(port, (error) => {
  if (error) {
    throw error;
  }

  console.log(`Server listening at port: ${port}`);
});
