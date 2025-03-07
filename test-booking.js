import fetch from 'node-fetch';

const testBooking = async () => {
  try {
    const response = await fetch('https://lavimac-royal-hotel-master-iclc2gf10-dominic-kudoms-projects.vercel.app/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        email: 'pendeewhannabe@gmail.com', // Test customer email
        phone: '+233542855399',
        roomType: 'Superior Room',
        checkIn: '2025-02-25',
        checkOut: '2025-02-26',
        nights: 1,
        adults: 1,
        children: 0,
        paymentMethod: 'Pay on Arrival',
        totalAmount: 700.00
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};

testBooking();
