import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});


// Add the sessionId in each request
api.interceptors.request.use(async (request) => {
  const sessionId = localStorage.getItem("sessionId");
  if (sessionId) {
    request.headers["Authorization"] = `Bearer ${sessionId}`;
  }
  return request;

});

export default api;
