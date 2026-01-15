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
            // مهم: امسحها لو مش موجود علشان متبعتش undefined
            if (config.headers?.Authorization) delete config.headers.Authorization;
      }
      return config;
});

export default api;
