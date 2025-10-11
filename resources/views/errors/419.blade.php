<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Session Expired - Serve Cafe</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #2d3748;
            line-height: 1.6;
        }
        
        .error-container {
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
            max-width: 480px;
            width: 90%;
            padding: 48px 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .error-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        }
        
        .logo-section {
            margin-bottom: 32px;
        }
        
        .logo {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            font-size: 24px;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 8px;
        }
        
        .logo-icon {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 16px;
        }
        
        .error-code {
            font-size: 64px;
            font-weight: 800;
            color: #e53e3e;
            margin: 24px 0 16px;
            letter-spacing: -2px;
        }
        
        .error-title {
            font-size: 28px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 16px;
        }
        
        .error-description {
            font-size: 16px;
            color: #718096;
            margin-bottom: 32px;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .info-box {
            background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin: 24px 0;
            position: relative;
        }
        
        .info-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            background: #667eea;
            color: white;
            border-radius: 50%;
            font-size: 14px;
            margin-right: 8px;
        }
        
        .info-title {
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 8px;
        }
        
        .info-text {
            color: #4a5568;
            font-size: 14px;
        }
        
        .button-group {
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 32px;
        }
        
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.2s ease;
            font-size: 14px;
            min-width: 140px;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
        }
        
        .btn-primary:hover {
            transform: translateY(-1px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
            color: white;
            text-decoration: none;
        }
        
        .btn-secondary {
            background: #ffffff;
            color: #4a5568;
            border: 1px solid #e2e8f0;
        }
        
        .btn-secondary:hover {
            background: #f7fafc;
            border-color: #cbd5e0;
            color: #2d3748;
            text-decoration: none;
            transform: translateY(-1px);
        }
        
        .security-note {
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #a0aec0;
        }
        
        @media (max-width: 640px) {
            .error-container {
                padding: 32px 24px;
                margin: 16px;
            }
            
            .error-code {
                font-size: 48px;
            }
            
            .error-title {
                font-size: 24px;
            }
            
            .button-group {
                flex-direction: column;
                align-items: center;
            }
            
            .btn {
                width: 100%;
                max-width: 200px;
            }
        }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="logo-section">
            <div class="logo">
                <div class="logo-icon">☕</div>
                Serve Cafe
            </div>
        </div>
        
        <div class="error-code">419</div>
        <div class="error-title">Session Expired</div>
        
        <div class="error-description">
            Your session has expired for security reasons. This typically occurs when you've been inactive for an extended period or have multiple browser tabs open.
        </div>

        <div class="info-box">
            <div class="info-title">
                <span class="info-icon">⚡</span>
                Quick Resolution
            </div>
            <div class="info-text">
                Simply refresh the page to restore your session and continue where you left off.
            </div>
        </div>

        <div class="button-group">
            <a href="{{ url()->current() }}" class="btn btn-primary">Refresh Page</a>
            <a href="/" class="btn btn-secondary">Return Home</a>
        </div>
        
        <div class="security-note">
            This security measure helps protect your account and data integrity.
        </div>
    </div>
</body>
</html>
