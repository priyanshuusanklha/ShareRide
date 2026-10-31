/**
 * Razorpay Payment Service
 * 
 * To fully configure this service:
 * 1. Install razorpay: npm install razorpay
 * 2. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env file
 * 3. Replace the mock implementation with the actual Razorpay SDK calls
 */

const crypto = require('crypto');

// Uncomment when razorpay is installed
// const Razorpay = require('razorpay');

let razorpay = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  // razorpay = new Razorpay({
  //   key_id: process.env.RAZORPAY_KEY_ID,
  //   key_secret: process.env.RAZORPAY_KEY_SECRET,
  // });
  console.log('Razorpay configured (SDK needs to be installed)');
} else {
  console.log('Razorpay not configured, running in mock mode');
}

exports.createOrder = async (amount, currency = 'INR', receiptId) => {
  if (razorpay) {
    // Actual implementation
    // const options = {
    //   amount: amount * 100, // amount in smallest currency unit
    //   currency,
    //   receipt: receiptId
    // };
    // return await razorpay.orders.create(options);
    return {
        id: `order_mock_${Math.random().toString(36).substring(7)}`,
        amount: amount * 100,
        currency,
        receipt: receiptId,
        status: 'created'
    };
  }

  // Mock response
  return {
    id: `order_mock_${Math.random().toString(36).substring(7)}`,
    amount: amount * 100,
    currency,
    receipt: receiptId,
    status: 'created',
    mock: true
  };
};

exports.verifyPayment = (orderId, paymentId, signature) => {
  if (process.env.RAZORPAY_KEY_SECRET) {
    // Actual verification
    // const text = orderId + '|' + paymentId;
    // const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    //                                 .update(text.toString())
    //                                 .digest('hex');
    // return expectedSignature === signature;
    return true; // mocking truth for now
  }
  
  // Mock verification always succeeds
  return true;
};
