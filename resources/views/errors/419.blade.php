<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Session Expired - Serve Cafe</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            color: #333;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            text-align: center;
            max-width: 500px;
            width: 90%;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #8B4513;
            margin-bottom: 20px;
        }
        .error-code {
            font-size: 72px;
            font-weight: bold;
            color: #dc3545;
            margin: 20px 0;
        }
        .error-message {
            font-size: 24px;
            color: #333;
            margin-bottom: 20px;
        }
        .description {
            font-size: 16px;
            color: #666;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        .auto-refresh {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #17a2b8;
        }
        .countdown {
            font-size: 18px;
            font-weight: bold;
            color: #17a2b8;
        }
        .button {
            display: inline-block;
            background: #8B4513;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px;
            transition: background 0.3s;
        }
        .button:hover {
            background: #A0522D;
            color: white;
        }
        .loading {
            display: none;
            margin: 20px 0;
        }
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #8B4513;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">☕ Serve Cafe</div>
        
        <div class="error-code">419</div>
        <div class="error-message">Session Expired</div>
        
        <div class="description">
            Your session has expired for security reasons. This usually happens when:
            <ul style="text-align: left; display: inline-block;">
                <li>You've been idle for too long</li>
                <li>You opened the page in multiple tabs</li>
                <li>Your browser cache needs clearing</li>
            </ul>
        </div>

        <div class="auto-refresh">
            <p><strong>Auto-refresh in <span id="countdown" class="countdown">10</span> seconds</strong></p>
            <p style="font-size: 14px; color: #666;">The page will automatically refresh to restore your session</p>
        </div>

        <div class="loading" id="loading">
            <div class="spinner"></div>
            <p>Refreshing your session...</p>
        </div>

        <div>
            <button onclick="refreshNow()" class="button">Refresh Now</button>
            <a href="/" class="button">Go to Home</a>
        </div>
    </div>

    <script>
        let countdown = 10;
        const countdownElement = document.getElementById('countdown');
        const loadingElement = document.getElementById('loading');

        function updateCountdown() {
            countdownElement.textContent = countdown;
            if (countdown <= 0) {
                refreshNow();
            } else {
                countdown--;
                setTimeout(updateCountdown, 1000);
            }
        }

        function refreshNow() {
            loadingElement.style.display = 'block';
            
            // Try to refresh CSRF token first
            fetch('/refresh-csrf')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Update CSRF token in meta tag
                        const metaToken = document.querySelector('meta[name="csrf-token"]');
                        if (metaToken) {
                            metaToken.setAttribute('content', data.csrf_token);
                        }
                        
                        // Update CSRF token in forms
                        const csrfInputs = document.querySelectorAll('input[name="_token"]');
                        csrfInputs.forEach(input => {
                            input.value = data.csrf_token;
                        });
                    }
                    
                    // Redirect to login page instead of reloading
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 1000);
                })
                .catch(error => {
                    console.log('Could not refresh CSRF token, redirecting to login');
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 1000);
                });
        }

        // Start countdown
        updateCountdown();

        // Also refresh CSRF token on page load
        document.addEventListener('DOMContentLoaded', function() {
            fetch('/refresh-csrf')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('CSRF token refreshed');
                    }
                })
                .catch(error => {
                    console.log('Could not refresh CSRF token');
                });
        });
    </script>
</body>
</html>
