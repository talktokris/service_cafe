/**
 * CSRF Token Handler for Serve Cafe
 * Automatically handles 419 errors and retries requests
 */

class CSRFHandler {
    constructor() {
        this.maxRetries = 3;
        this.retryDelay = 1000; // 1 second
        this.setupInterceptors();
    }

    setupInterceptors() {
        // Override fetch to handle 419 errors
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            return this.handleRequest(originalFetch, ...args);
        };

        // Override XMLHttpRequest to handle 419 errors
        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            this._method = method;
            this._url = url;
            return originalXHROpen.apply(this, [method, url, ...args]);
        };

        XMLHttpRequest.prototype.send = function(data) {
            this.addEventListener('readystatechange', function() {
                if (this.readyState === 4 && this.status === 419) {
                    // Skip handling for auth routes
                    const skipRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
                    if (!skipRoutes.some(route => this._url.includes(route))) {
                        CSRFHandler.handle419Error(this._method, this._url, data);
                    }
                }
            });
            return originalXHRSend.apply(this, [data]);
        };
    }

    async handleRequest(originalFetch, url, options = {}) {
        // Skip auto-retry for auth routes
        const skipRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
        if (skipRoutes.some(route => url.includes(route))) {
            return originalFetch(url, options);
        }

        let retryCount = 0;

        while (retryCount < this.maxRetries) {
            try {
                const response = await originalFetch(url, options);
                
                if (response.status === 419) {
                    retryCount++;
                    if (retryCount < this.maxRetries) {
                        console.log(`CSRF error detected, retrying... (${retryCount}/${this.maxRetries})`);
                        await this.refreshCSRFToken();
                        await this.delay(this.retryDelay * retryCount);
                        continue;
                    } else {
                        this.show419Error();
                        return response;
                    }
                }
                
                return response;
            } catch (error) {
                console.error('Request failed:', error);
                throw error;
            }
        }
    }

    async refreshCSRFToken() {
        try {
            const response = await fetch('/refresh-csrf', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const data = await response.json();
                
                // Update CSRF token in meta tag
                const metaToken = document.querySelector('meta[name="csrf-token"]');
                if (metaToken) {
                    metaToken.setAttribute('content', data.csrf_token);
                }

                // Update CSRF token in all forms
                const csrfInputs = document.querySelectorAll('input[name="_token"]');
                csrfInputs.forEach(input => {
                    input.value = data.csrf_token;
                });

                // Update CSRF token in Axios (if used)
                if (window.axios) {
                    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = data.csrf_token;
                }

                console.log('CSRF token refreshed successfully');
                return data.csrf_token;
            }
        } catch (error) {
            console.error('Failed to refresh CSRF token:', error);
        }
    }

    show419Error() {
        // Show a user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: #dc3545; color: white; padding: 15px; border-radius: 5px; z-index: 9999; max-width: 300px;">
                <strong>Session Expired</strong><br>
                Your session has expired. <button onclick="location.reload()" style="background: white; color: #dc3545; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Refresh Page</button>
            </div>
        `;
        document.body.appendChild(errorDiv);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 10000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static handle419Error(method, url, data) {
        console.log(`419 error for ${method} ${url}`);
        // This will be handled by the global error handler
        if (confirm('Your session has expired. Would you like to refresh the page?')) {
            location.reload();
        }
    }
}

// Initialize CSRF handler when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new CSRFHandler();
    
    // Also refresh CSRF token on page load
    fetch('/refresh-csrf')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('CSRF token refreshed on page load');
            }
        })
        .catch(error => {
            console.log('Could not refresh CSRF token on page load');
        });
});

// Export for use in other modules
window.CSRFHandler = CSRFHandler;
