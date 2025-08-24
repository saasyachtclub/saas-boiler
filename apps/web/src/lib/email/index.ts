import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is required')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

// Email templates
export const EmailTemplates = {
  welcome: (name: string) => ({
    subject: 'Welcome to SaaS Better! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; text-align: center;">Welcome to SaaS Better!</h1>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Hi ${name}, welcome to your new SaaS platform!
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          We're excited to have you on board. You can now start building amazing SaaS applications with our comprehensive boilerplate.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
             style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Get Started
          </a>
        </div>
      </div>
    `,
  }),

  organizationInvitation: (orgName: string, inviterName: string, inviteUrl: string) => ({
    subject: `You've been invited to join ${orgName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; text-align: center;">Organization Invitation</h1>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Hi there! ${inviterName} has invited you to join the ${orgName} organization.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Click the button below to accept the invitation and start collaborating.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteUrl}"
             style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Accept Invitation
          </a>
        </div>
        <p style="font-size: 14px; color: #888; text-align: center;">
          This invitation will expire in 7 days.
        </p>
      </div>
    `,
  }),

  passwordReset: (resetUrl: string) => ({
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; text-align: center;">Password Reset Request</h1>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          You requested a password reset for your SaaS Better account.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Click the button below to reset your password. This link will expire in 1 hour.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}"
             style="background-color: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 14px; color: #888; text-align: center;">
          If you didn't request this reset, please ignore this email.
        </p>
      </div>
    `,
  }),

  emailVerification: (verificationUrl: string) => ({
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; text-align: center;">Verify Your Email</h1>
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Welcome! Please verify your email address to complete your registration.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}"
             style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p style="font-size: 14px; color: #888; text-align: center;">
          This verification link will expire in 24 hours.
        </p>
      </div>
    `,
  }),
}

// Email service functions
export async function sendEmail({
  to,
  template,
  data = {},
}: {
  to: string
  template: keyof typeof EmailTemplates
  data?: Record<string, any>
}) {
  try {
    const templateFn = EmailTemplates[template]
    if (typeof templateFn !== 'function') {
      throw new Error(`Email template '${template}' not found`)
    }

    let emailContent: { subject: string; html: string }

    // Handle different template types with their specific arguments
    switch (template) {
      case 'welcome':
        emailContent = (templateFn as (name: string) => { subject: string; html: string })(data.name || 'User')
        break
      case 'organizationInvitation':
        emailContent = (templateFn as (orgName: string, inviterName: string, inviteUrl: string) => { subject: string; html: string })(data.orgName || '', data.inviterName || '', data.inviteUrl || '')
        break
      case 'passwordReset':
        emailContent = (templateFn as (resetUrl: string) => { subject: string; html: string })(data.resetUrl || '')
        break
      case 'emailVerification':
        emailContent = (templateFn as (verificationUrl: string) => { subject: string; html: string })(data.verificationUrl || '')
        break
      default:
        emailContent = (templateFn as (name: string) => { subject: string; html: string })(data.name || 'User')
    }

    const { data: result, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@saasbetter.com',
      to: [to],
      subject: emailContent.subject,
      html: emailContent.html,
    })

    if (error) {
      throw error
    }

    return result
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

export async function sendWelcomeEmail(to: string, name: string) {
  return sendEmail({
    to,
    template: 'welcome',
    data: { name },
  })
}

export async function sendOrganizationInvitationEmail(
  to: string,
  orgName: string,
  inviterName: string,
  inviteUrl: string
) {
  return sendEmail({
    to,
    template: 'organizationInvitation',
    data: { orgName, inviterName, inviteUrl },
  })
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  return sendEmail({
    to,
    template: 'passwordReset',
    data: { resetUrl },
  })
}

export async function sendEmailVerificationEmail(to: string, verificationUrl: string) {
  return sendEmail({
    to,
    template: 'emailVerification',
    data: { verificationUrl },
  })
}
