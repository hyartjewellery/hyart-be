const orderConfirmationTemplate = (customerName, orderId, orderDate, totalAmount, deliveryAddress) => {
	return `<!DOCTYPE html>
	<html>
	<head>
		<meta charset="UTF-8">
		<title>Order Confirmation</title>
		<style>
			/* Styles remain the same */
		</style>
	</head>
	<body>
		<div class="container">
			<div class="message">Order Confirmation</div>
			<div class="body">
				<p>Dear ${customerName},</p>
				<p>We're excited to inform you that your order has been successfully placed!</p>
				<div class="details">
					<h2 class="highlight">Order Details:</h2>
					<p><span class="highlight">Order ID:</span> ${orderId}</p>
					<p><span class="highlight">Order Date:</span> ${orderDate}</p>
					<p><span class="highlight">Total Amount:</span> ${totalAmount}</p>
					<p><span class="highlight">Delivery Address:</span> ${deliveryAddress}</p>
				</div>
				<p>You will receive a confirmation email once your order has been shipped. Thank you for shopping with us!</p>
			</div>
			<div class="support">If you have any questions or need assistance, please feel free to contact us at <a
					href="mailto:hyart267@gmail.com">hyart267@gmail.com</a>. We're here to help!</div>
		</div>
	</body>
	</html>`;
};

module.exports = orderConfirmationTemplate;
