import nodemailer from 'nodemailer';
import formidable from 'formidable';
import fs from 'fs';

// Disable Vercel's body parser so formidable can read multipart uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Inbox that receives new-booking notifications. emsonhotel.com has no MX
// records, so default to the (working) sending account rather than info@.
const getHotelEmail = () => process.env.HOTEL_EMAIL || process.env.EMAIL_USER;

const escapeHtml = (value = '') =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

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
      notifyHotel: first(fields.notifyHotel),
      bookingId: first(fields.bookingId),
      guestName: first(fields.guestName),
      guestEmail: first(fields.guestEmail),
      guestPhone: first(fields.guestPhone),
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
    const { to, subject, text, html, notifyHotel, bookingId, guestName, guestEmail, guestPhone } = fields;

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

    const body = html || text;
    const isHtml = Boolean(html) || /<[a-z][\s\S]*>/i.test(text);
    const content = isHtml ? { html: body } : { text: body };

    const attachments = paymentProof
      ? [
          {
            filename: paymentProof.originalFilename || 'payment-proof',
            content: await fs.promises.readFile(paymentProof.filepath),
            contentType: paymentProof.mimetype || undefined,
          },
        ]
      : undefined;

    const from = `"Emson Hotel" <${process.env.EMAIL_USER}>`;
    const hotelEmail = getHotelEmail();

    // Notify the hotel first, so a guest is never told a booking is confirmed
    // when the hotel never heard about it.
    let hotelMessageId;
    if (notifyHotel) {
      const contactBlock = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto 20px; padding: 15px; background: #fff8e1; border-radius: 6px;">
          <h2 style="margin-top: 0; color: #1a237e;">New booking${bookingId ? ` #${escapeHtml(bookingId)}` : ''}</h2>
          <p><strong>Guest:</strong> ${escapeHtml(guestName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(guestEmail || to)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(guestPhone)}</p>
        </div>`;
      const hotelInfo = await transporter.sendMail({
        from,
        to: hotelEmail,
        replyTo: guestEmail || to,
        subject: `New Booking Alert${bookingId ? ` - #${bookingId}` : ''}`,
        html: contactBlock + (isHtml ? body : `<pre>${escapeHtml(body)}</pre>`),
        attachments,
      });
      hotelMessageId = hotelInfo.messageId;
    }

    const info = await transporter.sendMail({
      from,
      to,
      replyTo: hotelEmail,
      subject,
      ...content,
      attachments,
    });

    return res.status(200).json({
      message: 'Email sent successfully',
      messageId: info.messageId,
      hotelMessageId,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
}
