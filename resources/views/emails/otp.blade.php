<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Code - Serve Cafe</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .email-container {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            background: #8B5CF6;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            font-weight: bold;
        }
        .title {
            color: #8B5CF6;
            font-size: 24px;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #666;
            font-size: 16px;
        }
        .otp-container {
            background: #f8f9fa;
            border: 2px dashed #8B5CF6;
            border-radius: 10px;
            padding: 25px;
            text-align: center;
            margin: 30px 0;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #8B5CF6;
            letter-spacing: 8px;
            margin: 10px 0;
            font-family: 'Courier New', monospace;
        }
        .otp-label {
            color: #666;
            font-size: 14px;
            margin-bottom: 10px;
        }
        .order-details {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        .detail-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        .detail-label {
            font-weight: 600;
            color: #555;
        }
        .detail-value {
            color: #333;
        }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
        }
        .warning-icon {
            color: #f39c12;
            margin-right: 8px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
        }
        .footer a {
            color: #8B5CF6;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">SC</div>
            <h1 class="title">Transaction OTP</h1>
            <p class="subtitle">Your one-time password for payment verification</p>
        </div>

        <p>Hello <strong>{{ $member_name }}</strong>,</p>
        
        <p>You have requested an OTP for a transaction at Serve Cafe. Please use the following code to complete your payment:</p>

        <div class="otp-container">
            <div class="otp-label">Your 6-digit OTP Code</div>
            <div class="otp-code">{{ $otp }}</div>
        </div>

        <div class="order-details">
            <div class="detail-row">
                <span class="detail-label">Order ID:</span>
                <span class="detail-value">#{{ $order_id }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Date & Time:</span>
                <span class="detail-value">{{ $date }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">{{ $member_email }}</span>
            </div>
        </div>

        <div class="warning">
            <span class="warning-icon">⚠️</span>
            <strong>Important:</strong> This OTP is valid for 10 minutes only. Do not share this code with anyone. Serve Cafe will never ask for your OTP via phone or email.
        </div>

        <p>If you did not request this OTP, please ignore this email or contact our support team immediately.</p>

        <p>Thank you for choosing Serve Cafe!</p>

        <div class="footer">
            <p>Serve Cafe - Your Digital Dining Experience</p>
            <p>
                <a href="mailto:support@servecafe.com">support@servecafe.com</a> | 
                <a href="tel:+977-9766389515">+977-9766389515</a>
            </p>
            <p>Lalitpur 14 Khumaltar, Nepal</p>
        </div>
    </div>
</body>
</html>
