import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
if (!baseURL && process.env.NODE_ENV === "production") {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}
const api = axios.create({
  baseURL: baseURL || "http://localhost:8000/ncmx_app/api",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default api;
