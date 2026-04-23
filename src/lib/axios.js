import axios from "axios";

function getDefaultBaseURL() {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    // In browser use same origin + /api so deployed frontend can call proxied API if configured
    if (typeof window !== "undefined") return `${window.location.origin}/api`;
    // Fallback for server-side or local dev
    return "http://localhost:4000/api";
}

const api = axios.create({
    baseURL: getDefaultBaseURL(),
    withCredentials: true,
});

export default api;