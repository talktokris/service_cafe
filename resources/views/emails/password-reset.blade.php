<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - Serve Cafe</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #8B4513;
            margin-bottom: 10px;
        }
        .title {
            color: #2c3e50;
            font-size: 24px;
            margin-bottom: 20px;
        }
        .content {
            margin-bottom: 30px;
        }
        .button {
            display: inline-block;
            background-color: #dc3545;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .button:hover {
            background-color: #c82333;
        }
        .warning {
            background-color: #fff3cd;
            padding: 15px;
            border-left: 4px solid #ffc107;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
        }
        .security-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">☕ Serve Cafe</div>
        </div>

        <h1 class="title">Password Reset Request</h1>

        <div class="content">
            <p>Hello,</p>
            
            <p>We received a request to reset the password for your Serve Cafe account. If you made this request, click the button below to reset your password:</p>

            <div style="text-align: center;">
                <a href="{{ $actionUrl }}" class="button">Reset My Password</a>
            </div>

            <div class="warning">
                <h4>⚠️ Important Security Information:</h4>
                <ul>
                    <li>This password reset link will expire in <strong>60 minutes</strong></li>
                    <li>The link can only be used <strong>once</strong></li>
                    <li>If you didn't request this reset, please ignore this email</li>
                </ul>
            </div>

            <div class="security-info">
                <h4>🔒 Security Tips:</h4>
                <ul>
                    <li>Choose a strong password with at least 8 characters</li>
                    <li>Use a combination of letters, numbers, and symbols</li>
                    <li>Don't reuse passwords from other accounts</li>
                    <li>Never share your password with anyone</li>
                </ul>
            </div>

            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 3px; font-family: monospace;">
                {{ $actionUrl }}
            </p>

            <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>

            <p>For security reasons, we recommend contacting our support team if you have any concerns about your account security.</p>

            <p>Best regards,<br>
            The Serve Cafe Security Team</p>
        </div>

        <div class="footer">
            <p>This email was sent to {{ $user->email ?? 'your email address' }} because a password reset was requested for your Serve Cafe account.</p>
            <p>© {{ date('Y') }} Serve Cafe. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
