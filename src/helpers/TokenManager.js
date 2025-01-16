import axios from "axios";

const TokenManager = {
    getAccessToken: () => localStorage.getItem("accessToken"),
    setAccessToken: (token) => localStorage.setItem("accessToken", token),

    getRefreshToken: () => localStorage.getItem("refreshToken"),
    setRefreshToken: (token) => localStorage.setItem("refreshToken", token),

    setUserRole: (role) => localStorage.setItem("userRole", role),
    getUserRole: () => localStorage.getItem("userRole"),

    setUserId: (id) => localStorage.setItem("userId", id),
    getUserId: () => localStorage.getItem("userId"),

    setUserEmail: (email) => localStorage.setItem("userEmail", email),
    getUserEmail: () => localStorage.getItem("userEmail"),

    setUserName: (name) => localStorage.setItem("userName", name),
    getUserName: () => localStorage.getItem("userName"),

    clearTokens: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId")
        localStorage.removeItem("userInfo")
        localStorage.removeItem("userEmail")
        localStorage.removeItem("userName")
    },

    isTokenExpired: () => {
        const token = TokenManager.getAccessToken();
        if (!token) return true;

        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        return Date.now() >= decodedToken.exp * 1000;
    },

    getValidAccessToken: async () => {
        const token = TokenManager.getAccessToken();
        if (token && !TokenManager.isTokenExpired()) {
            return token;
        }

        const refreshToken = TokenManager.getRefreshToken();
        const response = await axios.post("/auth/refresh", { refreshToken });
        TokenManager.setAccessToken(response.data.accessToken);
        TokenManager.setRefreshToken(response.data.refreshToken);

        return response.data.accessToken;
    },
};

export default TokenManager;
