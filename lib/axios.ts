import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Don't log 401 for auth/me endpoint (expected when not logged in)
    const isAuthMeEndpoint = error.config?.url?.includes("/auth/me");

    if (error.response?.status === 401 && !isAuthMeEndpoint) {
      console.error("Unauthorized access - session may have expired");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
