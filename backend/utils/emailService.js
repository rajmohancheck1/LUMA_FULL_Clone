const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN
});

const createTransporter = async () => {
  try {
    const accessToken = await oauth2Client.getAccessToken();

    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_FROM,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token
      }
    });
  } catch (error) {
    console.error('Error creating email transporter:', error);
    throw error;
  }
};

exports.sendEmail = async ({ to, subject, html, metadata = {} }) => {
  try {
    const transporter = await createTransporter();

    // Add tracking pixel and wrap links
    const enhancedHtml = addTracking(html, metadata);

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: enhancedHtml
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const addTracking = (html, metadata) => {
  const { emailBlastId } = metadata;
  
  // Add tracking pixel
  const trackingPixel = `<img src="${process.env.BACKEND_URL}/api/email-blasts/${emailBlastId}/open" width="1" height="1" />`;
  
  // Wrap links with tracking
  const wrappedHtml = html.replace(
    /<a\s+(?:[^>]*?\s+)?href="([^"]*)"([^>]*)>/g,
    (match, url, rest) => {
      const trackingUrl = `${process.env.BACKEND_URL}/api/email-blasts/${emailBlastId}/click?redirect=${encodeURIComponent(url)}`;
      return `<a href="${trackingUrl}"${rest}>`;
    }
  );

  return wrappedHtml + trackingPixel;
}; 