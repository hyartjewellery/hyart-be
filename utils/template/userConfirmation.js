const userConfirmationTemplate = (name) => {
	return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Message Received</title>
        <style>
            body {
                background-color: #f4f4f4;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
    
            .message {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #333;
            }
    
            .body {
                font-size: 18px;
                margin-bottom: 20px;
                color: #666;
            }
        </style>
    </head>
    <body>
    <div class="container">
        <div class="message">Message Received</div>
        <div class="body">
            <p>Dear ${name},</p>
            <p>We have received your message and will reach out to you shortly.</p>
            <p>Thank you for contacting us!</p>
        </div>
    </div>
    </body>
    </html>
    `;
};

module.exports = userConfirmationTemplate;
