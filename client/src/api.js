import axios from "axios";
// import store from "./store"; // Import your Redux store
// import { clearUser } from "./store/UserSlice"; // Import the action to clear user state

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:8000", // Replace with your API URL
  timeout: 10000, // Optional: Add a timeout for requests
});

// Function to get the access token from localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

// Function to save the new access token
const saveToken = (token) => {
  localStorage.setItem("token", token);
};

// Request Interceptor: Attach the JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle token expiration and refreshing
api.interceptors.response.use(
  (response) => {
    // Return the response directly if successful
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to a 401 Unauthorized response (token expired)
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Prevent infinite retry loop

      try {
        // Send a request to refresh the token using the refresh token
        const refreshTokenResponse = await axios.post(
          "http://localhost:8000/refresh-token",
          null,
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );

        // Save the new token
        const newToken = refreshTokenResponse.data.access_token;
        saveToken(newToken);

        // Retry the original request with the new token
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, remove tokens and clear Redux state
        localStorage.removeItem("token");
        // store.dispatch(clearUser()); // Clear Redux state using the store's dispatch method
        window.location.href = "/login"; // Redirect to login page
        return Promise.reject(refreshError);
      }
    }

    // Reject the error if it's not a 401 or the refresh failed
    return Promise.reject(error);
  }
);

export default api;
