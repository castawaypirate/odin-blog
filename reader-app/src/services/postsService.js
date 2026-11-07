import apiService from "./apiService.js";

class PostsService {
  getPosts(options) {
    const response = apiService.get("/posts", options);
    return response;
  }
}

export default new PostsService();
