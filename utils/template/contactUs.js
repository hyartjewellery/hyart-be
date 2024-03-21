const contactUsTemplate = (email, user_name,subject, message) => {
	return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Contact Us Email</title>
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
                text-align: left;
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
    
            .subject {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #333;
            }
    
            .message {
                font-size: 18px;
                margin-bottom: 20px;
                color: #666;
            }
    
            .sender-info {
                font-size: 16px;
                color: #888;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
    <div class="container">
        <div class="subject">${subject}</div>
        <div class="message">
            <p>${message}</p>
        </div>
        <div class="sender-info">
            <p>From: ${user_name}</p>
            <p>Email: ${email}</p>
        </div>
    </div>
    </body>
    </html>
    `;
};

module.exports = contactUsTemplate;
