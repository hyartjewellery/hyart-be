const passwordUpdated = (email, name) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Password Update Confirmation</title>
        <style>
            body {
                background-color: #f4f4f4;
                font-family: 'Helvetica Neue', Arial, sans-serif;
                font-size: 16px;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 40px auto;
                padding: 20px;
                text-align: center;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                border: 1px solid #ddd;
            }
    
            .logo {
                max-width: 150px;
                margin-bottom: 20px;
            }
    
            .header {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #b38b6d;
            }
    
            .body {
                font-size: 16px;
                color: #555;
                line-height: 1.8;
                margin-bottom: 20px;
            }
    
            .highlight {
                font-weight: bold;
                color: #d9534f;
            }
    
            .support {
                font-size: 14px;
                color: #999;
                margin-top: 30px;
            }
    
            .footer {
                font-size: 12px;
                color: #aaa;
                text-align: center;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">Password Update Confirmation</div>
            <div class="body">
                <p>Dear ${name},</p>
                <p>Your password has been successfully updated for the email <span class="highlight">${email}</span>.</p>
                <p>If you did not request this password change, please contact us immediately to secure your account.</p>
            </div>
            <div class="support">
                <p>If you have any questions or need further assistance, please feel free to reach out to us at <a href="mailto:hyart267@gmail.com">hyart267@gmail.com</a>. We are here to help!</p>
            </div>
            <div class="footer">
                <p>This email was generated automatically. Please do not reply.</p>
            </div>
        </div>
    </body>
    </html>`;
};

module.exports = passwordUpdated;