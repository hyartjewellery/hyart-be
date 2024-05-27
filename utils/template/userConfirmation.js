const userConfirmationTemplate = (name) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Message Received</title>
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
                background-color: #fff;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                border: 1px solid #ddd;
            }
    
            .header {
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #0046ad;
            }
    
            .body {
                font-size: 18px;
                margin-bottom: 20px;
                color: #555;
                line-height: 1.8;
            }

            .footer {
                font-size: 14px;
                color: #aaa;
                margin-top: 30px;
            }
        </style>
    </head>
    <body>
    <div class="container">
        <div class="header">Message Received</div>
        <div class="body">
            <p>Dear ${name},</p>
            <p>We have received your message and will reach out to you shortly.</p>
            <p>Thank you for contacting us!</p>
        </div>
        <div class="footer">
            <p>Best regards,<br>HYART JEWELLERY</p>
            <p>This email was generated automatically. Please do not reply.</p>
        </div>
    </div>
    </body>
    </html>
    `;
};

module.exports = userConfirmationTemplate;
