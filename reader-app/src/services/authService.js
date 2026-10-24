import apiService from "./apiService.js";

class AuthService {
  login(credentials) {
    const response = apiService.post("/login", credentials);
    return response;
  }

  register(credentials) {
    const response = apiService.post("/register", credentials);
    return response;
  }

  logout(options) {
    const response = apiService.post("/logout", null, options);
    return response;
  }

  refresh() {
    const response = apiService.post("/refresh");
    return response;
  }

  getUser(options) {
    const response = apiService.get("/me", options);
    return response;
  }
}

export default new AuthService();
