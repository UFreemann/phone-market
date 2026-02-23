// 'use server';

// export async function sendAdminAlert(dealerName: string) {
//   const url = 'https://sms.arkesel.com/api/v2/sms/send'; // Example API
//   const apiKey = process.env.ARKESEL_API_KEY;
//   const adminPhonesString = process.env.ADMIN_PHONES || '';

//   if (!apiKey || !adminPhonesString) return; // Fail safely if keys missing

//   // 1. Process Numbers (Split & Clean)
//   // Split by comma -> Trim spaces -> Clean format
//   const recipients = adminPhonesString
//     .split(',')
//     .map((phone) => {
//       // Remove non-digits
//       const clean = phone.replace(/\D/g, '');
//       // Ensure 233 format
//       if (clean.startsWith('0')) return '233' + clean.substring(1);
//       if (clean.startsWith('233')) return clean;
//       // Fallback for weird formats (assuming 9 digits after 0)
//       if (clean.length === 9) return '233' + clean;
//       return clean;
//     })
//     .filter((p) => p.length >= 10); // Filter out invalid/empty

//   if (recipients.length === 0) return;

//   try {
//     await fetch(url, {
//       method: 'POST',
//       headers: {
//         'api-key': apiKey,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         sender: 'PhoneMarket', // Must be < 11 chars
//         message: `New Dealer Alert: ${dealerName} just signed up. Please verify in Admin Dashboard.`,
//         recipients: recipients,
//       }),
//     });

//     // Optional: Check response
//     // const data = await res.json();
//     // console.log('SMS Sent:', data);
//   } catch (error) {
//     console.error('SMS Failed', error);
//   }
// }

'use server';

export async function sendAdminAlert(dealerName: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_ID;

  if (!token || !chatId) {
    console.warn('Telegram Config Missing: Check .env');
    return;
  }

  // Formatting the message (HTML style)
  const message = `
🚨 <b>New Dealer Registration</b>

🏪 <b>Shop Name:</b> ${dealerName}
⏰ <b>Time:</b> ${new Date().toLocaleString()}

<i>Please login to the Admin Dashboard to verify their ID.</i>
  `;

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML', // Allows bolding/italics
      }),
    });

    console.log('🔔 Telegram Alert Sent');
  } catch (error) {
    console.error('Telegram Failed:', error);
  }
}
