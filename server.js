import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { formidable } from 'formidable';
import { promises as fs } from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://lavimacroyalhotel.com'],
  credentials: true
}));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
try {
  await fs.mkdir(uploadsDir, { recursive: true });
} catch (err) {
  console.error('Error creating uploads directory:', err);
}

// Create transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter
try {
  await transporter.verify();
  console.log('SMTP connection verified successfully');
} catch (error) {
  console.error('SMTP verification failed:', error);
}

// Email endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    console.log('Email API called');
    
    // Configure formidable
    const form = formidable({
      uploadDir: uploadsDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    // Parse form data
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

    // Prepare email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: text, // Use HTML content instead of plain text
      text: text.replace(/<[^>]*>/g, ''), // Provide plain text alternative
      attachments: []
    };

    // If payment proof is attached, add it to email
    if (paymentProof) {
      console.log('Payment proof file:', paymentProof);
      try {
        const content = await fs.readFile(paymentProof.filepath);
        mailOptions.attachments.push({
          filename: paymentProof.originalFilename || 'payment-proof.jpg',
          content
        });
        console.log('Payment proof attached successfully');
      } catch (error) {
        console.error('Error reading payment proof file:', error);
      }
    }

    // Send email
    console.log('Sending email with options:', {
      ...mailOptions,
      attachments: mailOptions.attachments ? 'File attached' : 'No attachments'
    });
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);

    // Clean up uploaded file
    if (paymentProof) {
      try {
        await fs.unlink(paymentProof.filepath);
        console.log('Cleaned up uploaded file');
      } catch (error) {
        console.error('Error cleaning up file:', error);
      }
    }

    res.status(200).json({ 
      message: 'Email sent successfully',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Error in email API route:', error);
    res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Email configuration:', {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS ? '****' : 'not set'
  });
});
