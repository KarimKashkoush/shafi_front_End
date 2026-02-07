import axios from "axios";

const api = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      withCredentials: true,
});

api.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
      } else {
            if (config.headers?.Authorization) delete config.headers.Authorization;
      }
      return config;
});

api.interceptors.response.use(
      (response) => response,
      async (error) => {
            const originalRequest = error.config;

            if (
                  error.response?.status === 403 &&
                  error.response?.data?.message === "TOKEN_EXPIRED_OR_INVALID" &&
                  !originalRequest._retry
            ) {
                  originalRequest._retry = true;

                  const refreshToken = localStorage.getItem("refreshToken");
                  if (!refreshToken) {
                        logout();
                        return Promise.reject(error);
                  }

                  try {
                        const res = await axios.post(
                              `${import.meta.env.VITE_API_URL}/refresh`,
                              { refreshToken }
                        );

                        const newAccessToken = res.data.accessToken;
                        localStorage.setItem("token", newAccessToken);

                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return api(originalRequest);
                  } catch (e) {
                        logout();
                        return Promise.reject(e);
                  }
            }

            return Promise.reject(error);
      }
);

function logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
}

export default api;
