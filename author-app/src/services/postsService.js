import apiService from "./apiService.js";

class PostsService {
  getAuthorPosts(options) {
    const response = apiService.get("/author/posts", options);
    return response;
  }

  getAuthorPost(param, options) {
    const response = apiService.get(`/author/posts/${param}`, options);
    return response;
  }

  createPost(data, options) {
    const response = apiService.post("/posts", data, options);
    return response;
  }

  editPost(param, data, options) {
    const response = apiService.put(`/posts/${param}`, data, options);
    return response;
  }
}

export default new PostsService();
