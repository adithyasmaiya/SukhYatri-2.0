import Razorpay from 'razorpay';
import { ENV } from '../config/env.js';

console.log('Testing Razorpay config:');
console.log('KEY_ID:', ENV.RAZORPAY_KEY_ID);
console.log('KEY_SECRET length:', ENV.RAZORPAY_KEY_SECRET?.length);

const rzp = new Razorpay({
  key_id: ENV.RAZORPAY_KEY_ID,
  key_secret: ENV.RAZORPAY_KEY_SECRET,
});

async function run() {
  try {
    const order = await rzp.orders.create({
      amount: 10000,
      currency: 'INR',
      receipt: 'test_order_' + Date.now(),
    });
    console.log('Razorpay Order Created Successfully!');
    console.log('Order ID:', order.id);
  } catch (err: any) {
    console.error('Razorpay Error Details:');
    console.error('Status Code:', err.statusCode);
    console.error('Error Object:', JSON.stringify(err.error || err, null, 2));
  }
}

run();
