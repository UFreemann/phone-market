import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// The base URL of your website
// In development, it's localhost. In production, it will be your .com domain.
const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/verify?token=${token}`;

  await resend.emails.send({
    from: 'PhoneMarket <noreply@allphones.shop>',
    to: email,
    subject: 'Verify your Dealer Account',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to the Phone Market!</h2>
        <p>Please click the button below to verify your email address and activate your dealer account.</p>
        <a href="${confirmLink}" style="background-color: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
          Verify Email
        </a>
        <p style="margin-top: 20px; color: #666; font-size: 14px;">
          Or copy this link: <br/> ${confirmLink}
        </p>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  // Point to the new page we will create in Step 5
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: 'PhoneMarket <noreply@allphones.shop>',
    to: email,
    subject: 'Reset your password',
    html: `
      <div style="font-family: sans-serif;">
        <h2>Reset Password Request</h2>
        <p>Click the link below to set a new password for your account:</p>
        <a href="${resetLink}" style="background-color: #2563EB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          <strong>Security Note:</strong> This link is valid for <strong>15 minutes</strong>.
          If you did not request this, please ignore this email.
        </p>
      </div>
    `,
  });
};

export const sendNewStockAlert = async (
  userEmail: string,
  userName: string,
  dealerName: string,
  productTitle: string,
  productPrice: number,
  productId: string,
) => {
  const link = `${domain}/phone/${productId}`;

  await resend.emails.send({
    from: 'PhoneMarket <noreply@allphones.shop>', // Change to your domain later
    to: userEmail,
    subject: `New from ${dealerName}: ${productTitle}`,
    html: `
      <div style="font-family: sans-serif; color: #333;">
        <p>Hi ${userName},</p>
        <p><strong>${dealerName}</strong> just posted a new item you might like:</p>
        
        <div style="border: 1px solid #eee; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 5px 0;">${productTitle}</h3>
            <p style="margin: 0; font-size: 18px; color: #2563EB; font-weight: bold;">GH₵ ${productPrice.toLocaleString()}</p>
        </div>

        <a href="${link}" style="background-color: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          View Deal
        </a>
      </div>
    `,
  });
};
