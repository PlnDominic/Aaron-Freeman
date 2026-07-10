import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { z } from "zod"

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(10),
})

const RECIPIENT_EMAIL = "aaronfreeman1957@gmail.com"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Please check your details and try again." }, { status: 400 })
    }

    const { name, email, subject, message } = parsed.data

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return NextResponse.json(
        {
          error:
            "Email is not configured: set GMAIL_USER and GMAIL_APP_PASSWORD in your environment variables.",
        },
        { status: 500 }
      )
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: `"${name} via Portfolio Site" <${process.env.GMAIL_USER}>`,
      to: RECIPIENT_EMAIL,
      replyTo: email,
      subject: `[Portfolio Contact] ${subject}`,
      text: `New message from the portfolio contact form.\n\nName: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #111;">
          <p><strong>New message from the portfolio contact form</strong></p>
          <p><strong>Name:</strong> ${escapeHtml(name)}<br/>
          <strong>Email:</strong> ${escapeHtml(email)}<br/>
          <strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact form error:", error)
    const message = error instanceof Error ? error.message : "Failed to send message."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
