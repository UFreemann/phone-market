'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactMessage(formData: FormData) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  if (!email || !message) {
    return { error: 'Email and message are required.' };
  }

  try {
    // Send email to YOU (The Admin)
    await resend.emails.send({
      from: 'PhoneMarket Contact <noreply@allphones.shop>', // Use your verified domain
      to: 'senyoebenezer8@gmail.com', // Replace with your real email
      replyTo: email, // So you can reply directly to the user
      subject: `New Contact Form: ${firstName} ${lastName}`,
      html: `
        <h3>New Message from ${firstName} ${lastName}</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f9f9f9; padding: 10px; border-left: 3px solid #2563EB;">
          ${message}
        </blockquote>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Contact Form Error:', error);
    return { error: 'Failed to send message. Please try again.' };
  }
}
