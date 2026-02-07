import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import sanitizeHtml from 'sanitize-html';

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 5000;
const MIN_MESSAGE_LENGTH = 10;

// Stricter email validation (RFC 5322 compliant)
const validateEmail = (email: string): boolean => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

// Strip all HTML tags using sanitize-html (allows no tags)
const sanitizeText = (str: string) => sanitizeHtml(str, { allowedTags: [], allowedAttributes: {} });

// Handle non-POST requests
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method Not Allowed' },
    { status: 405 }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, website } = body;

    // Honeypot check - silently accept but don't send email
    if (website) {
      console.warn('Honeypot field filled. Potential spam submission detected.');
      return NextResponse.json(
        { success: true, message: 'Message sent successfully' },
        { status: 200 }
      );
    }

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate name length
    const trimmedName = name.trim();
    if (trimmedName.length < MIN_NAME_LENGTH || trimmedName.length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { success: false, error: 'Name must be between 2 and 100 characters' },
        { status: 400 }
      );
    }

    // Validate message length
    const trimmedMessage = message.trim();
    if (trimmedMessage.length < MIN_MESSAGE_LENGTH || trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { success: false, error: 'Message must be between 10 and 5000 characters' },
        { status: 400 }
      );
    }

    // Sanitize inputs using sanitize-html (strips all HTML tags)
    const sanitizedName = sanitizeText(trimmedName);
    const sanitizedEmail = email.trim();
    const sanitizedMessage = sanitizeText(trimmedMessage);

    // Send email via Resend (initialized inside handler - env var may not be
    // available at module load time, which causes 500 on all requests)
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Jon Kumar Web Solutions <onboarding@resend.dev>',
      to: process.env.RESEND_TO_EMAIL || 'jon@example.com',
      subject: `New Contact: ${sanitizedName} via jonkumar.dev`,
      replyTo: sanitizedEmail,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${sanitizedName}</p>
        <p><strong>Email:</strong> ${sanitizedEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>Sent from the contact form at jonkumar.dev</em></p>
      `,
    });

    if (error) {
      console.error('Resend email sending failed:', error);
      return NextResponse.json(
        { success: false, error: 'Something went wrong. Please try again.' },
        { status: 500 }
      );
    }

            // Send confirmation email to the form submitter
            const fromAddressConfirmation = 'Jon Kumar Web Solutions <jonkumar1989@gmail.com>'; // Using your verified personal email for client confirmation
            try {
              await resend.emails.send({
                from: fromAddressConfirmation, // Use the new fromAddressConfirmation
                to: sanitizedEmail,        subject: `Thanks for reaching out, ${sanitizedName}!`,
        html: `
          <h2>Message Received</h2>
          <p>Hi ${sanitizedName},</p>
          <p>Thanks for getting in touch! I've received your message and will get back to you within 24 hours.</p>
          <p><strong>Here's a copy of what you sent:</strong></p>
          <blockquote style="border-left: 3px solid #f97316; padding-left: 12px; color: #555;">
            ${sanitizedMessage.replace(/\n/g, '<br>')}
          </blockquote>
          <p>Best regards,<br>Jon Kumar</p>
          <hr>
          <p><em>Jon Kumar Web Solutions — jonkumar.dev</em></p>
        `,
      });
    } catch (confirmationError) {
      // Log but don't fail the request — the main notification was sent successfully
      console.error('Confirmation email sending failed:', confirmationError);
    }

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact API POST handler error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
