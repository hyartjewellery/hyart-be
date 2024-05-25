const orderStatusTemplate = (customerName,trackingID, orderId, statusMessage, productDetails) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Order Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f8f8f8;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .message {
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #333333;
                text-align: center;
            }
            .body {
                font-size: 18px;
                margin-bottom: 20px;
                color: #333333;
            }
            .body p {
                margin: 10px 0;
            }
            .product-details {
                font-size: 16px;
                margin-bottom: 20px;
                color: #333333;
            }
            .product-details p {
                margin: 5px 0;
            }
            .support {
                font-size: 14px;
                color: #666666;
                margin-top: 20px;
                text-align: center;
            }
            .support a {
                color: #007bff;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="message">Order Status Update</div>
            <div class="body">
                <p>Dear ${customerName},</p>
                <p>${statusMessage}</p>
                <p>Your order ID is: ${orderId}</p>
                <div class="product-details">
                    <p><strong>Product Details:</strong></p>
                    ${productDetails}
                </div>
                ${
                    statusMessage === 'Your order has been shipped!' ? 
                    `<p>You can track your order using this Tracking ID: ${trackingID}</p>` : ''
                }
                <p>Thank you for choosing us!</p>
            </div>
            <div class="support">If you have any questions or need assistance, please feel free to contact us at <a href="mailto:hyart267@gmail.com">hyart267@gmail.com</a>. We're here to help!</div>
        </div>
    </body>
    </html>
    `;
};

module.exports = orderStatusTemplate;