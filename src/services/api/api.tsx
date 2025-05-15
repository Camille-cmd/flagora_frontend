import axios from "axios";
import AuthService from "../auth/AuthService.tsx";
import i18n from "../../i18n/i18n.tsx";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Accept-Language": i18n.language
    }
});


// Add the sessionId in each request
api.interceptors.request.use(async (request) => {
    const sessionId = localStorage.getItem(AuthService.tokenKey);
    if (sessionId) {
        request.headers["Authorization"] = `Bearer ${sessionId}`;
    }
    return request;

});

api.interceptors.response.use(
    // No error, proceed as normal
    response => response,
    async error => {
        // Check if the error status is 401 (Unauthorized)

        if (error.response && error.response.status === 401) {
            const currentPath = window.location.pathname;

            // The 401 error is normal on the login page, when the user enters invalid credentials
            // In this case; we don't want to redirect
            const isLoginPage = currentPath.includes("/login");
            if (!isLoginPage) {
                // Session probably expired — force redirect
                window.location.href = "/login";
            }
        }

        // Reject the promise so the error propagates
        return Promise.reject(error);
    }
);
export default api;
