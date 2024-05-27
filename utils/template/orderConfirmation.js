const orderConfirmationTemplate = (customerName, orderId, orderDate, totalAmount, deliveryAddress, deliveryCity, deliveryPinCode, deliveryState, deliveryCountry) => {
	return `<!DOCTYPE html>
	<html>
	<head>
		<meta charset="UTF-8">
		<title>Order Confirmation</title>
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
				text-align: left;
			}
	
			.details {
				margin: 20px 0;
				text-align: left;
			}
	
			.highlight {
				font-weight: bold;
				color: #b38b6d;
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
			<img src="[YOUR LOGO URL]" alt="Your Store Logo" class="logo">
			<div class="header">Order Confirmation</div>
			<div class="body">
				<p>Dear ${customerName},</p>
				<p>We're excited to inform you that your order has been successfully placed!</p>
				<div class="details">
					<h2 class="highlight">Order Details:</h2>
					<p><span class="highlight">Order ID:</span> ${orderId}</p>
					<p><span class="highlight">Order Date:</span> ${orderDate}</p>
					<p><span class="highlight">Total Amount:</span> ${totalAmount}</p>
					<p><span class="highlight">Delivery Address:</span></p>
					<p>${deliveryAddress}, ${deliveryCity}, ${deliveryState}, ${deliveryPinCode}, ${deliveryCountry}</p>
				</div>
				<p>You will receive a confirmation email once your order has been shipped. Thank you for shopping with us!</p>
				<p>To check your order status, please visit <a href="https://hyartjewellery.com/myorders">your orders page</a>.</p>
			</div>
			<div class="support">If you have any questions or need assistance, please feel free to contact us at <a href="mailto:hyart267@gmail.com">hyart267@gmail.com</a>. We're here to help!</div>
			<div class="footer">
				<p>This email was generated automatically. Please do not reply.</p>
			</div>
		</div>
	</body>
	</html>`;
};

module.exports = orderConfirmationTemplate;