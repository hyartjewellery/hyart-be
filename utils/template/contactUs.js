const contactUsTemplate = (email, subject, message) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Contact Us Email</title>
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
                text-align: left;
                background-color: #fff;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                border: 1px solid #ddd;
            }
    
            .header {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #0046ad;
                text-align: center;
            }
    
            .section-heading {
                font-size: 18px;
                font-weight: bold;
                margin-top: 20px;
                margin-bottom: 10px;
                color: #0046ad;
            }
    
            .subject {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 10px;
                color: #333;
            }
    
            .message {
                font-size: 16px;
                margin-bottom: 20px;
                color: #555;
            }
    
            .sender-info {
                font-size: 14px;
                color: #888;
                margin-top: 20px;
                border-top: 1px solid #ddd;
                padding-top: 10px;
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
        <div class="header">Contact Us Form Submission</div>
        <div class="section-heading">Subject</div>
        <div class="subject">${subject}</div>
        <div class="section-heading">Message</div>
        <div class="message">
            <p>${message}</p>
        </div>
        <div class="sender-info">
            <p><strong>Email:</strong> ${email}</p>
        </div>
        <div class="footer">
            <p>This email was generated automatically. Please do not reply.</p>
        </div>
    </div>
    </body>
    </html>
    `;
};

module.exports = contactUsTemplate;
