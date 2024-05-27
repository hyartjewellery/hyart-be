const welcomeTemplate = (name) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Welcome to HYART JEWELLERY</title>
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

            .cta {
                display: inline-block;
                padding: 10px 20px;
                background-color: #b38b6d;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 30px;
            }
    
            .highlight {
                font-weight: bold;
                color: #b38b6d;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">Welcome to HYART JEWELLERY!</div>
            <div class="body">
                <p>Dear ${name},</p>
                <p>We're thrilled to welcome you to our community. At HYART JEWELLERY, we are dedicated to bringing you the finest jewellery pieces to add a touch of elegance and sparkle to your life.</p>
                <p>Start exploring our exquisite collections and enjoy exclusive member benefits, special offers, and much more.</p>
                <p>Happy shopping!</p>
                <a href="https://hyartjewellery.com/shop" class="cta">Start Shopping</a>
            </div>
            <div class="support">
                <p>If you have any questions or need assistance, please feel free to reach out to us at <a href="mailto:hyart267@gmail.com">hyart267@gmail.com</a>. We are here to help!</p>
            </div>
        </div>
    </body>
    </html>`;
};

module.exports = welcomeTemplate;
