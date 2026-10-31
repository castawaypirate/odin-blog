import apiService from "./apiService.js";

class PostsService {
  getAuthorPosts(options) {
    const response = apiService.get("/author/posts", options);
    return response;
  }
}

export default new PostsService();
