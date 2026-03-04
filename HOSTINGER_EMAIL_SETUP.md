# Hostinger Email Setup (SMTP for Vercera 5.0)

The app sends emails from your domain address (e.g. **chairperson@amuroboclub.com**) for:

- **Registration confirmation** — after signup or when a Vercera ID is generated (includes Vercera ID + QR code).
- **Payment receipt** — after every successful payment (event or bundle).

To send these emails, configure SMTP using your Hostinger domain email.

---

## 1. Get your Hostinger email credentials

1. Log in to **Hostinger** (hPanel).
2. Go to **Emails** (or **Manage** next to your domain → **Email**).
3. Create or select the mailbox you want to use (e.g. **chairperson@amuroboclub.com**). Note the password you set.
4. Open **Configuration** / **Connect Apps & Devices** (or **Manual Configuration**).
5. Note:
   - **SMTP server:** `smtp.hostinger.com`
   - **Port (SSL):** `465` (recommended) or **Port (TLS):** `587`
   - **Username:** your full email (e.g. `chairperson@amuroboclub.com`)
   - **Password:** the mailbox password

---

## 2. Add to your `.env` / `.env.local`

Add these variables (replace with your real values):

```env
# Mail (Hostinger SMTP – domain email)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=chairperson@amuroboclub.com
SMTP_PASS=your_mailbox_password_here
MAIL_FROM=chairperson@amuroboclub.com
```

- **SMTP_HOST** — `smtp.hostinger.com` for Hostinger.
- **SMTP_PORT** — `465` for SSL (recommended) or `587` for TLS.
- **SMTP_USER** — full email address (e.g. `chairperson@amuroboclub.com`).
- **SMTP_PASS** — password of that mailbox (not your hPanel password).
- **MAIL_FROM** — “From” address shown in emails; usually the same as `SMTP_USER`.

---

## 3. Port and encryption

- **465** — SSL. The app uses `secure: true` when `SMTP_PORT=465`.
- **587** — TLS/STARTTLS. Use `SMTP_PORT=587`; the app will use STARTTLS.

Both work with Hostinger; 465 is often simpler.

---

## 4. Security

- Do **not** commit `.env` or `.env.local` (they should be in `.gitignore`).
- Keep **SMTP_PASS** secret. On Hostinger, use a strong mailbox password.
- If you use 2FA on the mailbox, use an **app password** if Hostinger provides one; otherwise use the normal mailbox password.

---

## 5. When SMTP is not set

If `SMTP_HOST`, `SMTP_USER`, or `SMTP_PASS` are missing:

- Registration and payment logic still run; only the email is skipped.
- In development, a short log may say that mail was skipped (no error thrown).

---

## 6. Testing

1. Set the env vars and restart the app.
2. **Registration email:** Sign up a new account (or trigger “Generate Vercera ID” for a user without one). Check the inbox (and spam) of the registered email.
3. **Payment receipt:** Complete a test payment (e.g. Razorpay test mode). Check the payer’s email for the receipt.

If nothing arrives, check:

- Spam/junk folder.
- Hostinger → Emails → Logs (if available) for bounces or blocks.
- App logs for `[mail] Send failed` errors.

---

## Quick reference (chairperson@amuroboclub.com)

| Setting   | Value                          |
|----------|---------------------------------|
| SMTP host| `smtp.hostinger.com`           |
| Port     | `465` (SSL) or `587` (TLS)     |
| Username | `chairperson@amuroboclub.com`   |
| Password | Your mailbox password          |
| From     | `chairperson@amuroboclub.com`  |
