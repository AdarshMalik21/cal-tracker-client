import axios from "axios";

const browserBaseURL =
  typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:5000/api`
    : "http://localhost:5000/api";

const serverBaseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: typeof window !== "undefined" ? browserBaseURL : serverBaseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err.response?.data?.message || err.message);
    return Promise.reject(err);
  },
);

export default api;
