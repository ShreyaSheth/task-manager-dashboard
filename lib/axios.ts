import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let handlingUnauthorized = false;

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
  async (error) => {
    const status = error.response?.status;
    const url: string | undefined = error.config?.url;

    const isAuthMeEndpoint = url?.includes("/auth/me");
    const isAuthEndpoint =
      url?.includes("/auth/login") ||
      url?.includes("/auth/signup") ||
      url?.includes("/auth/logout") ||
      isAuthMeEndpoint;

    // If a protected API returns 401, treat it as "session expired":
    // - clear httpOnly cookie via /api/auth/logout
    // - redirect to /login
    if (
      status === 401 &&
      !isAuthEndpoint &&
      typeof window !== "undefined" &&
      !handlingUnauthorized
    ) {
      handlingUnauthorized = true;
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
      } catch {
        // ignore
      } finally {
        // Force navigation to login; middleware will keep protected routes gated.
        window.location.href = "/login";
      }
    }

    // Don't spam console for expected 401 from /auth/me
    if (!(status === 401 && isAuthMeEndpoint)) {
      // Keep other errors visible for debugging
      // console.error("API error:", status, url, error.response?.data);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
