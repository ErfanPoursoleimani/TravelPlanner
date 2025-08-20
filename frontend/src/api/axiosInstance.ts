// src/api/client.js
import axios from 'axios';

// Helper function to get CSRF token from Django cookie
function getCookie(name: string) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Create axios instance
const apiInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000',  
    withCredentials: true,          
    headers: {
        'Content-Type': 'application/json',
    }
});

/* apiInstance.interceptors.request.use(
    (config) => {
        const csrfToken = getCookie('csrftoken');
        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 403) {
            console.error('CSRF token issue or permission denied');
        }
        return Promise.reject(error);
    }
); */

export default apiInstance;