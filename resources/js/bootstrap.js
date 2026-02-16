import axios from "axios";
import './csrf-handler.js';

window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// Set up CSRF token
const token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    window.axios.defaults.headers.common["X-CSRF-TOKEN"] = token.content;
} else {
    console.error(
        "CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token"
    );
}

window.axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 419) {
            // Skip auto-retry for login and authentication routes
            const url = error.config?.url || '';
            const skipRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

            if (skipRoutes.some(route => url.includes(route))) {
                console.log('CSRF error on auth route, not auto-retrying');
                return Promise.reject(error);
            }

            console.log('CSRF token mismatch detected, refreshing token...');

            // Try to refresh CSRF token (one retry)
            return fetch('/refresh-csrf', { credentials: 'same-origin' })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Update axios default header
                        window.axios.defaults.headers.common["X-CSRF-TOKEN"] = data.csrf_token;

                        // Update meta tag
                        const metaToken = document.querySelector('meta[name="csrf-token"]');
                        if (metaToken) {
                            metaToken.setAttribute('content', data.csrf_token);
                        }

                        // Retry the original request
                        return window.axios(error.config);
                    } else {
                        throw error;
                    }
                })
                .catch(refreshError => {
                    console.error('Failed to refresh CSRF token:', refreshError);
                    if (!skipRoutes.some(route => url.includes(route))) {
                        if (confirm('Your session has expired. Would you like to refresh the page?')) {
                            window.location.reload();
                        }
                    }
                    throw error;
                });
        }

        return Promise.reject(error);
    }
);
