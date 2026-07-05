import nodemailer from 'nodemailer';

// ==========================================
// 1. MAIN CORE FUNCTION (Do Not Touch)
// ==========================================
export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Essential Rush" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email successfully sent to ${to} | Subject: ${subject}`);
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};


// ==========================================
// 2. WELCOME EMAIL (Jab naya user register kare)
// ==========================================
export const sendWelcomeEmail = async (email: string, ...args: any[]) => {
    const name = args[0] || "VIP Member";
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 40px 20px; background-color: #0A0A0A; color: #ffffff; text-align: center;">
            <h2 style="color: #D4AF37; font-style: italic;">Welcome to Essential Rush</h2>
            <p style="color: #cccccc;">Dear ${name},</p>
            <p style="color: #cccccc;">Your private vault has been successfully created. You now have exclusive access to our luxury timepiece collection.</p>
            <div style="margin: 30px auto; padding: 15px; border: 1px solid #D4AF37; display: inline-block; border-radius: 10px;">
                <p style="color: #D4AF37; font-size: 14px; margin: 0; font-weight: bold; letter-spacing: 2px;">ENJOY 10% OFF YOUR FIRST ACQUISITION</p>
            </div>
            <p style="color: #888888; font-size: 12px; margin-top: 30px;">Thank you for joining the Essential Network.</p>
        </div>
    `;
    await sendEmail(email, "Welcome to the Vault - Essential Rush", html);
};


// ==========================================
// 3. FORGOT PASSWORD (OTP Email)
// ==========================================
export const sendOTPPasswordResetEmail = async (email: string, otp: string, ...args: any[]) => {
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 40px 20px; background-color: #0A0A0A; color: #ffffff; text-align: center;">
            <h2 style="color: #D4AF37; font-style: italic;">Essential Rush</h2>
            <p style="color: #cccccc;">We received a request to reset your Vault access.</p>
            <div style="margin: 30px auto; padding: 20px; border: 1px solid #D4AF37; display: inline-block; border-radius: 10px; background-color: #111;">
                <p style="margin: 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Your 6-Digit OTP</p>
                <h1 style="color: #D4AF37; font-size: 40px; margin: 10px 0; letter-spacing: 10px;">${otp}</h1>
            </div>
            <p style="color: #888888; font-size: 12px;">This code is valid for exactly 10 minutes. Do not share this with anyone.</p>
        </div>
    `;
    await sendEmail(email, "Password Reset Code - Essential Rush", html);
};


// ==========================================
// 4. ORDER CONFIRMED (Payment Success)
// ==========================================
export const sendOrderConfirmationEmail = async (email: string, ...args: any[]) => {
    const orderId = args[0] || "YOUR ORDER";
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 40px 20px; background-color: #0A0A0A; color: #ffffff; text-align: center;">
            <h2 style="color: #D4AF37; font-style: italic;">Essential Rush</h2>
            <h3 style="color: #4CAF50;">Acquisition Confirmed</h3>
            <p style="color: #cccccc;">Thank you for your purchase. Your luxury order <strong>#${orderId}</strong> is confirmed and is being prepared with utmost care.</p>
            <p style="color: #888888; font-size: 12px; margin-top: 30px;">We will notify you the moment it leaves our facility.</p>
        </div>
    `;
    await sendEmail(email, `Order Confirmed #${orderId} - Essential Rush`, html);
};


// ==========================================
// 5. ORDER SHIPPED (Dispatch Update)
// ==========================================
export const sendOrderShippedEmail = async (email: string, ...args: any[]) => {
    const orderId = args[0] || "";
    const trackingLink = args[1] || "#";
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 40px 20px; background-color: #0A0A0A; color: #ffffff; text-align: center;">
            <h2 style="color: #D4AF37; font-style: italic;">Essential Rush</h2>
            <h3 style="color: #D4AF37;">Your Order is on the way!</h3>
            <p style="color: #cccccc;">Order <strong>#${orderId}</strong> has been securely dispatched.</p>
            <div style="margin: 30px auto;">
                <a href="${trackingLink}" style="background-color: #D4AF37; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Track Your Package</a>
            </div>
            <p style="color: #888888; font-size: 12px; margin-top: 30px;">Our premium logistics partner will contact you shortly.</p>
        </div>
    `;
    await sendEmail(email, `Order Shipped #${orderId} - Essential Rush`, html);
};


// ==========================================
// 6. ORDER CANCELLED 
// ==========================================
export const sendOrderCancelledEmail = async (email: string, ...args: any[]) => {
    const orderId = args[0] || "";
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 40px 20px; background-color: #0A0A0A; color: #ffffff; text-align: center;">
            <h2 style="color: #D4AF37; font-style: italic;">Essential Rush</h2>
            <h3 style="color: #ff4444;">Order Cancelled</h3>
            <p style="color: #cccccc;">As requested, your order <strong>#${orderId}</strong> has been successfully cancelled.</p>
            <p style="color: #888888; font-size: 12px; margin-top: 30px;">If applicable, your refund will be processed to the original payment method within 5-7 business days.</p>
        </div>
    `;
    await sendEmail(email, `Order Cancelled #${orderId} - Essential Rush`, html);
};


// ==========================================
// 7. REFERRAL REWARD (Network Bonus)
// ==========================================
export const sendReferralRewardEmail = async (email: string, ...args: any[]) => {
    const amount = args[2] || "100"; // Based on your previous code logic
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 40px 20px; background-color: #0A0A0A; color: #ffffff; text-align: center;">
            <h2 style="color: #D4AF37; font-style: italic;">Essential Rush</h2>
            <h3 style="color: #D4AF37;">Vault Reward Received!</h3>
            <p style="color: #cccccc;">Congratulations! A network reward of <strong>₹${amount}</strong> has been successfully added to your Vault balance.</p>
            <p style="color: #888888; font-size: 12px; margin-top: 30px;">You can use this exclusive balance on your next acquisition.</p>
        </div>
    `;
    await sendEmail(email, "Vault Reward Added - Essential Rush", html);
};