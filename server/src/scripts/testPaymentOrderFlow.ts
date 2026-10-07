import axios from 'axios';

async function testPaymentFlow() {
  const baseURL = 'http://localhost:5000/api';
  
  // 1. Login as ananya@example.com
  console.log('1. Logging in...');
  const loginRes = await fetch(`${baseURL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ananya@example.com', password: 'Password123!' }),
  });
  const loginData = await loginRes.json();
  if (!loginData.success) {
    console.error('Login failed:', loginData);
    return;
  }
  const token = loginData.data.token;
  console.log('Logged in successfully. User:', loginData.data.user.email);

  // 2. Fetch packages
  console.log('2. Fetching trips...');
  const tripsRes = await fetch(`${baseURL}/trips`);
  const tripsData = await tripsRes.json();
  const trip = tripsData.data[0];
  console.log('Selected trip:', trip.title, 'ID:', trip.id);

  // 3. Create Draft Booking
  console.log('3. Creating booking...');
  const bookingRes = await fetch(`${baseURL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      tripId: trip.id,
      travelDate: '2026-11-15',
      adults: 2,
      children: 0,
      primaryTraveller: {
        name: 'Ananya Sharma',
        email: 'ananya@example.com',
        phone: '9876543210',
      },
    }),
  });
  const bookingData = await bookingRes.json();
  if (!bookingData.success) {
    console.error('Booking failed:', bookingData);
    return;
  }
  console.log('bookingData received:', JSON.stringify(bookingData, null, 2));
  const bookingId = bookingData.data?.bookingId || bookingData.data?.booking?.bookingId;
  console.log('Booking created:', bookingId);

  // 4. Create Razorpay Payment Order
  console.log('4. Calling /payments/create-order for', bookingId, '...');
  const orderRes = await fetch(`${baseURL}/payments/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ bookingId }),
  });
  const orderData = await orderRes.json();
  console.log('Razorpay Order API Response:');
  console.log(JSON.stringify(orderData, null, 2));
}

testPaymentFlow().catch(console.error);
