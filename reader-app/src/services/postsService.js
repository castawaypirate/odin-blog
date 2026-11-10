import apiService from "./apiService.js";

class PostsService {
  getPosts(options) {
    const response = apiService.get("/posts", options);
    return response;
  }

  getPost(param, options) {
    const response = apiService.get(`/posts/${param}`, options);
    return response;
  }

  getReviewPosts(options) {
    const response = apiService.get("/review/posts", options);
    return response;
  }

  getReviewPost(id, options) {
    const response = apiService.get(`/review/posts/${id}`, options);
    return response;
  }
}

export default new PostsService();
