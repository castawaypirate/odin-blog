class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    // try {
    const response = await fetch(url, config);

    // if (response.status === 401) {
    //   const refreshSuccess = await this.refreshToken();
    //
    //   if (refreshSuccess) {
    //     return this.request(url, options);
    //   } else {
    //     window.location.href = "/login";
    //     throw new Error("Authentication required");
    //   }
    // }
    //
    // if (!response.ok) {
    //   throw new Error(`HTTP error! Status: ${response.status}`);
    // }

    return response;

    // } catch (error) {
    //   throw error;
    // }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, options);
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : null,
      ...options,
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: "DELETE",
      ...options,
    });
  }
}

export default new ApiService();
