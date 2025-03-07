const nodemailer = require('nodemailer');
const formidable = require('formidable');
const fs = require('fs').promises;
require('dotenv').config();

// Export config for Vercel
exports.config = {
  api: {
    bodyParser: false,
  },
  runtime: 'nodejs18.x'
};

// Create reusable transporter object using SMTP
const createTransporter = async () => {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email credentials not found, falling back to test account');
    let testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  // Create Gmail transporter
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Verify the connection
    await transporter.verify();
    console.log('SMTP connection verified successfully');
    return transporter;
  } catch (error) {
    console.error('Failed to create Gmail transporter:', error);
    throw new Error('Email service configuration error: ' + error.message);
  }
};

// List of allowed origins
const allowedOrigins = [
  'https://lavimacroyalhotel.com',
  'https://lavimac-royal-hotel-master.vercel.app',
  'https://lavimac-royal-hotel-master-glt53biy2-dominic-kudoms-projects.vercel.app',
  'https://lavimac-royal-hotel-master-c2c3wjwv8-dominic-kudoms-projects.vercel.app',
  'https://lavimac-royal-hotel-master-aq1fzbec7-dominic-kudoms-projects.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173'
];

// Export the handler function
module.exports = async function handler(req, res) {
  try {
    console.log('API route started');
    
    // Get the origin from the request headers
    const origin = req.headers.origin;
    console.log('Request origin:', origin);

    // Check if the origin is allowed
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    // Set other CORS headers
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
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

    // Parse form data
    const form = formidable();
    const [fields, files] = await form.parse(req);

    console.log('Parsed fields:', fields);
    console.log('Parsed files:', files);

    const to = fields.to?.[0];
    const subject = fields.subject?.[0];
    const text = fields.text?.[0];
    const paymentProof = files.paymentProof?.[0];

    if (!to || !subject || !text) {
      console.log('Missing fields:', { to, subject, text });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create transporter
    console.log('Creating email transporter...');
    const transporter = await createTransporter();

    // Verify connection
    console.log('Verifying email connection...');
    await new Promise((resolve, reject) => {
      transporter.verify(function (error, success) {
        if (error) {
          console.error('Connection verification failed:', error);
          reject(error);
        } else {
          console.log('Server is ready to take our messages');
          resolve(success);
        }
      });
    });

    // Prepare email options
    const mailOptions = {
      from: process.env.EMAIL_USER || 'test@example.com',
      to,
      subject,
      text
    };

    // If payment proof is attached, add it to email
    if (paymentProof) {
      mailOptions.attachments = [{
        filename: paymentProof.originalFilename,
        content: await fs.readFile(paymentProof.filepath)
      }];
    }

    // Send email
    console.log('Sending email with options:', {
      ...mailOptions,
      attachments: paymentProof ? ['<payment proof attachment>'] : undefined
    });
    
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info);
      
      // If using test account, provide preview URL
      if (info.messageId && info.previewURL) {
        console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
      }

      res.status(200).json({ 
        message: 'Email sent successfully',
        messageId: info.messageId,
        previewUrl: info.previewURL ? nodemailer.getTestMessageUrl(info) : undefined
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      res.status(500).json({ 
        error: 'Failed to send email',
        details: emailError.message,
        code: emailError.code,
        response: emailError.response,
        stack: process.env.NODE_ENV === 'development' ? emailError.stack : undefined
      });
    }
  } catch (error) {
    console.error('Error in email API route:', error);
    res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
