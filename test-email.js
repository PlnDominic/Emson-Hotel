import nodemailer from 'nodemailer';

const EMAIL_USER = 'info@emsonhotel.com';
const EMAIL_PASS = 'eubw fotu eusa xyez';

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

const testEmail = {
  from: EMAIL_USER,
  to: EMAIL_USER,
  subject: 'Test Email from Emson Hotel',
  html: `
    <h1>Test Email</h1>
    <p>This is a test email from the Emson Hotel booking system.</p>
    <p>If you receive this email, it means the email service is working correctly!</p>
    <p>Sent at: ${new Date().toLocaleString()}</p>
    <br>
    <p>Best regards,</p>
    <p>Emson Hotel Team</p>
  `
};

async function sendTestEmail() {
  try {
    console.log('Attempting to send test email...');
    console.log('Using email:', EMAIL_USER);
    
    const info = await transporter.sendMail(testEmail);
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.code === 'EAUTH') {
      console.error('Authentication failed. Please check your email and app password.');
    }
  }
}

sendTestEmail();
