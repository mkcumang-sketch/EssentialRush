import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send a reward email to the referrer when someone uses their code
 */
export async function sendReferralRewardEmail(
  to: string,
  referrerName: string,
  referredName: string,
  rewardAmount: number
): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8" /><title>You earned a referral reward!</title></head>
    <body style="font-family: Arial, sans-serif; background: #f9f9f9; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
        
        <div style="background: #111; padding: 30px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">EssentialRush</h1>
          <p style="color: #aaa; margin: 8px 0 0;">Referral Reward</p>
        </div>

        <div style="padding: 36px 30px;">
          <p style="font-size: 16px; margin: 0 0 12px;">Hi <strong>${referrerName}</strong>,</p>
          <p style="color: #444; line-height: 1.6; margin: 0 0 20px;">
            Great news! <strong>${referredName}</strong> just signed up using your referral code.
          </p>
          <p style="color: #444; line-height: 1.6; margin: 0 0 30px;">
            You've earned a reward of <strong style="font-size: 20px;">₹${rewardAmount}</strong> 
            which has been added to your wallet.
          </p>
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${process.env.NEXTAUTH_URL || 'https://essential-ivory.vercel.app'}/dashboard"
              style="display: inline-block; background: #111; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: bold;">
              View My Wallet
            </a>
          </div>
        </div>

        <div style="padding: 20px 30px; background: #f4f4f4; text-align: center; color: #888; font-size: 13px;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} EssentialRush. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"EssentialRush" <${process.env.SMTP_USER}>`,
    to,
    subject: `🎉 You earned ₹${rewardAmount} for referring ${referredName}!`,
    html,
  });
}