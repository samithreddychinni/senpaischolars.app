import { Resend } from 'resend';

const isLocalDev =
  !process.env.RESEND_API_KEY ||
  process.env.RESEND_API_KEY === 'your-resend-api-key';

const resend = isLocalDev ? null : new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  resetUrl?: string;
}

export async function sendEmail({ to, subject, html, resetUrl }: EmailOptions) {
  if (isLocalDev) {
    console.log('\n========================================');
    console.log('📧 LOCAL DEV EMAIL (not actually sent)');
    console.log('========================================');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    if (resetUrl) {
      console.log(`\n🔗 Reset Password URL:\n${resetUrl}`);
    }
    console.log('========================================\n');
    return { success: true };
  }

  if (!resend) {
    console.error('Resend client not configured');
    return { success: false, error: 'Resend not configured' };
  }

  try {
    const { error } = await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL ||
        'SenpaiScholars <delivered@resend.dev>',
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }

    console.log(`[Email] Sent to ${to}: ${subject}`);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

export function getPasswordResetEmail(resetUrl: string, userName: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f5ff;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(139, 92, 246, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                <span style="color: #e0e7ff;">Senpai</span>Scholars
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 24px; font-weight: 600;">
                Password Reset Request
              </h2>
              
              <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Hi ${userName || 'there'},
              </p>
              
              <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                We received a request to reset your password for your SenpaiScholars account. Click the button below to create a new password:
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 10px 0 30px;">
                    <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 12px; box-shadow: 0 4px 14px rgba(139, 92, 246, 0.4);">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 20px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Or copy and paste this link into your browser:
              </p>
              
              <p style="margin: 0 0 30px; padding: 16px; background-color: #f3f4f6; border-radius: 8px; word-break: break-all;">
                <a href="${resetUrl}" style="color: #8b5cf6; text-decoration: none; font-size: 14px;">
                  ${resetUrl}
                </a>
              </p>
              
              <!-- Security Notice -->
              <div style="padding: 20px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                  <strong>⚠️ Security Notice:</strong> This link expires in 1 hour. If you didn't request this password reset, please ignore this email or contact support if you have concerns.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                Need help? <a href="mailto:support@senpaischolars.com" style="color: #8b5cf6; text-decoration: none;">Contact Support</a>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} SenpaiScholars. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
