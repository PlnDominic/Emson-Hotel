import nodemailer from 'nodemailer';
import formidable from 'formidable';
import fs from 'fs';

// Disable Vercel's body parser so formidable can read multipart uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

const HOTEL_EMAIL = process.env.HOTEL_EMAIL || 'info@emsonhotel.com';

const allowedOrigins = [
  'https://www.emsonhotel.com',
  'https://emsonhotel.com',
  'http://localhost:3000',
  'http://localhost:5173',
];

const first = (value) => (Array.isArray(value) ? value[0] : value);

// Accepts multipart/form-data (with optional paymentProof) or a JSON body
async function parseRequest(req) {
  const contentType = req.headers['content-type'] || '';

  if (contentType.includes('application/json')) {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString() || '{}');
    return { fields: body, paymentProof: null };
  }

  const form = formidable({ multiples: false });
  const [fields, files] = await form.parse(req);
  return {
    fields: {
      to: first(fields.to),
      subject: first(fields.subject),
      text: first(fields.text),
      html: first(fields.html),
    },
    paymentProof: first(files.paymentProof) || null,
  };
}

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fields, paymentProof } = await parseRequest(req);
    const { to, subject, text, html } = fields;

    if (!to || !subject || !(text || html)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('EMAIL_USER / EMAIL_PASS environment variables are not set');
      return res.status(500).json({ error: 'Email service is not configured' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Emson Hotel" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      replyTo: HOTEL_EMAIL,
    };
    // The booking template is HTML, so send it as HTML when it looks like markup
    if (html) {
      mailOptions.html = html;
    } else if (/<[a-z][\s\S]*>/i.test(text)) {
      mailOptions.html = text;
    } else {
      mailOptions.text = text;
    }

    if (paymentProof) {
      mailOptions.attachments = [
        {
          filename: paymentProof.originalFilename || 'payment-proof',
          content: await fs.promises.readFile(paymentProof.filepath),
          contentType: paymentProof.mimetype || undefined,
        },
      ];
    }

    const info = await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email sent successfully', messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
}
