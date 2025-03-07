import nodemailer from 'nodemailer';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';

// Configure formidable for file parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'info.lavimacroyalhotel@gmail.com',
    pass: process.env.EMAIL_PASS
  }
});

// List of allowed origins
const allowedOrigins = [
  'https://lavimac-royal-hotel-master.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173'
];

export default async function handler(req, res) {
  // Get the origin from the request headers
  const origin = req.headers.origin;

  // Check if the origin is allowed
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  // Set other CORS headers
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse form data including files
    const form = formidable({ multiples: false });
    
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Parse booking data from fields
    const bookingData = JSON.parse(fields.bookingData);
    console.log('Received booking data:', bookingData);
    
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      roomType, 
      checkIn, 
      checkOut, 
      nights, 
      adults,
      children,
      paymentMethod,
      totalAmount,
    } = bookingData;

    const bookingId = Math.floor(Math.random() * 1000000);

    // Format dates
    const checkInDate = new Date(checkIn).toLocaleDateString('en-GB');
    const checkOutDate = new Date(checkOut).toLocaleDateString('en-GB');
    const nightsText = nights === 1 ? '1 night' : `${nights} nights`;

    const emailTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #1a365d; text-align: center;">Lavimac Royal Hotel - Booking Confirmation</h2>
      
      <p style="color: #2d3748; line-height: 1.6;">Dear ${firstName} ${lastName},</p>
      
      <p style="color: #2d3748; line-height: 1.6;">Thank you for booking with Lavimac Royal Hotel, we are happy to confirm that your booking has been successfully placed and we look forward to seeing you on ${checkInDate} for your ${nightsText} stay with us. For full details of your reservation please see below:</p>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #2d3748; margin-top: 0;">Booking Details</h3>
        <p><strong>Booking ID:</strong> #${bookingId}</p>
        <p><strong>Room Type:</strong> ${roomType}</p>
        <p><strong>Check-in:</strong> ${checkInDate}</p>
        <p><strong>Check-out:</strong> ${checkOutDate}</p>
        <p><strong>Number of Nights:</strong> ${nights}</p>
        <p><strong>Guests:</strong> ${adults} Adults, ${children} Children</p>
        <p><strong>Total Amount:</strong> GH₵${totalAmount.toFixed(2)}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod === 'momo' ? 'Mobile Money' : 'Pay on Arrival'}</p>
      </div>
      
      <div style="background-color: #e2e8f0; padding: 15px; border-radius: 4px;">
        <p style="margin: 0;"><strong>Need assistance?</strong></p>
        <p style="margin: 5px 0;">Contact us at:</p>
        <p style="margin: 5px 0;">Email: info.lavimacroyalhotel@gmail.com</p>
        <p style="margin: 5px 0;">Phone: +233 248676262</p>
      </div>
    </div>
    `;

    // Prepare email options
    const mailOptions = {
      from: '"Lavimac Royal Hotel" <info.lavimacroyalhotel@gmail.com>',
      to: 'info.lavimacroyalhotel@gmail.com',
      subject: `New Booking Confirmation - #${bookingId}`,
      html: emailTemplate,
      attachments: []
    };

    // Add payment proof as attachment if it exists
    if (files.paymentProof) {
      mailOptions.attachments.push({
        filename: `payment_proof_${bookingId}${path.extname(files.paymentProof.originalFilename)}`,
        content: await fs.promises.readFile(files.paymentProof.filepath),
        contentType: files.paymentProof.mimetype
      });
    }

    // Send confirmation email to hotel
    await transporter.sendMail(mailOptions);

    // Send confirmation email to customer
    if (email) {
      await transporter.sendMail({
        ...mailOptions,
        to: email
      });
    }

    res.status(200).json({ success: true, bookingId });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}
