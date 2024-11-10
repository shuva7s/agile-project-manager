import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/nodemailer';

interface RequestBody {
  to: string;
  subject: string;
  html: string;
}

export async function POST(request: NextRequest) {
  // Check for the Authorization header
  const authHeader = request.headers.get("authorization");
  
  if (authHeader !== `Bearer ${process.env.MAIL_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Process the request after authorization
  const { to, subject, html }: RequestBody = await request.json();
  if (!to || !subject || !html) {
    return new Response("Missing required fields", { status: 400 });
  }

  try {
    const result = await sendEmail({ to, subject, html });
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Failed to send email:', error);
    return new Response("Failed to send email", { status: 500 });
  }
}
