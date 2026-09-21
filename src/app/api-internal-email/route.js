import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const secret = req.headers.get('x-internal-secret');
    const expectedSecret = process.env.INTERNAL_EMAIL_SECRET || 'unity_drop_internal_email_secret_2026';
    if (secret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { to, subject, html } = await req.json();

    if (!to) {
      return NextResponse.json({ error: 'Recipient is required' }, { status: 400 });
    }

    const port = parseInt(process.env.SMTP_PORT, 10) || 465;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail({
      from: `"Unity Drop" <${process.env.SMTP_USER || process.env.EMAIL_FROM || process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        Importance: 'High',
      },
    });

    console.log(`[Vercel Email Bridge] Email sent to ${to}: ${info.messageId}`);
    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error(' [Vercel Email Bridge] Error sending email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
