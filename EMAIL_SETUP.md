# Email Setup Guide

This document explains how to configure the email functionality for the contact form.

## Overview

The contact form uses `nuxt-mail` module with nodemailer to send emails via SMTP. When a user submits the contact form at `/contact`, an email is sent to the configured recipient address.

**Note:** Email sending is disabled by default via a feature flag. You must enable it by setting `ENABLE_EMAIL=true` in your environment variables.

## Prerequisites

- SMTP server credentials (host, port, username, password)
- Access to set environment variables in your deployment environment

## Setup Steps

### 1. Enable Email Feature Flag

**Important:** Email sending is disabled by default. To enable it, add this to your `.env` file:

```bash
# Enable email functionality (set to 'true' to enable)
ENABLE_EMAIL=true
```

When `ENABLE_EMAIL` is not set or set to `false`, the contact form will still work but emails will not be sent. Submissions will only be logged to the console.

### 2. Configure Environment Variables

Create a `.env` file in the project root (or configure these in your deployment platform):

```bash
# Enable email functionality
ENABLE_EMAIL=true

# Recipient email address (where contact form submissions will be sent)
MAIL_TO=hello@ccmdesign.ca

# SMTP server configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password-or-app-specific-password
```

**Important:** Never commit `.env` files to version control. The `.env` file should already be in `.gitignore`.

### 3. SMTP Provider Configuration

#### Gmail

For Gmail, you need to:
1. Enable 2-factor authentication on your Google account
2. Generate an [App-Specific Password](https://support.google.com/accounts/answer/185833)
3. Use the following configuration:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
```

Alternatively, you can use the service name:

```bash
# In nuxt.config.ts, you can also use:
smtp: {
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
}
```

#### Other Providers

Common SMTP settings for popular providers:

**SendGrid:**
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

**Mailgun:**
```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
```

**Outlook/Office 365:**
```bash
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

Refer to your email provider's documentation for specific SMTP settings.

### 4. Update Configuration (if needed)

The email configuration is in `nuxt.config.ts` under `runtimeConfig.mail`. The default recipient is set to `hello@ccmdesign.ca` but can be overridden with the `MAIL_TO` environment variable.

### 5. Test the Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/contact`

3. Fill out and submit the contact form

4. Check that:
   - The form shows a success message
   - An email is received at the configured `MAIL_TO` address
   - The email contains the correct sender information and message content

### 6. Troubleshooting

#### Email not sending

- **Check browser console**: Open browser DevTools → Network tab → look for the `/api/contact` request → check the Response tab for error messages
- **Check server logs**: Look for error messages in the terminal where `npm run dev` is running
- **Verify SMTP credentials**: Double-check that all environment variables are set correctly
- **Test SMTP connection**: Use a tool like [Mailtrap](https://mailtrap.io/) or [Ethereal Email](https://ethereal.email/) for testing without sending real emails

#### Common Errors

**"Self signed certificate in certificate chain"**
- Some SMTP servers have certificate issues. You may need to add `secure: false` or `tls: { rejectUnauthorized: false }` to the SMTP config (not recommended for production)

**"Authentication failed"**
- Verify your username and password are correct
- For Gmail, ensure you're using an App-Specific Password, not your regular password
- Check if your email provider requires special authentication settings

**"Connection timeout"**
- Verify the SMTP host and port are correct
- Check if your firewall or network is blocking the connection
- Some providers require specific ports (587 for TLS, 465 for SSL)

### 7. Deployment

When deploying to production:

1. **Set environment variables** in your deployment platform (Netlify, Vercel, etc.)
   - Go to your project settings → Environment Variables
   - Add `ENABLE_EMAIL=true` to enable email sending
   - Add all required `SMTP_*` and `MAIL_TO` variables

2. **Important Note**: This module requires server-side rendering. It will **not work** with static site generation (`nuxt generate`). Ensure your deployment platform supports SSR or serverless functions.

3. **Security**: Never expose SMTP credentials in client-side code. The configuration uses `runtimeConfig` which keeps these values server-side only.

## Email Format

When a contact form is submitted, an email is sent with:

- **From**: `[Sender Name] <sender@email.com>`
- **Reply-To**: `sender@email.com`
- **To**: Value from `MAIL_TO` environment variable (default: `hello@ccmdesign.ca`)
- **Subject**: `Contact Form: [Sender Name]`
- **Body**: Includes sender name, email, and message in both HTML and plain text formats

## Files Modified

- `nuxt.config.ts` - Added `nuxt-mail` module and SMTP configuration
- `server/api/contact.post.ts` - Updated to send emails using `useMail()` composable
- `package.json` - Added `nuxt-mail` dependency

## Additional Resources

- [nuxt-mail Documentation](https://nuxt.com/modules/nuxt-mail)
- [Nodemailer Documentation](https://nodemailer.com/about/)
- [Gmail App-Specific Passwords](https://support.google.com/accounts/answer/185833)

