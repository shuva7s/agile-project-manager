import nodemailer, { Transporter } from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter: Transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: Number(process.env.BREVO_SMTP_PORT),
  secure: Number(process.env.BREVO_SMTP_PORT) === 465, // true for SSL (465), false otherwise
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASSWORD,
  },
});

export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  try {
    if (!transporter) {
      throw new Error("Email transporter is not configured.");
    }

    const info = await transporter.sendMail({
      from: `"Your Name" <your-email@domain.com>`, // sender address
      to,
      subject,
      html,
    });
    
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
