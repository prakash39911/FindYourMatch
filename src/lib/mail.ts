import { Resend } from "resend";

// const resendAPIKEY = process.env.RESEND_API_KEY;
// console.log(resendAPIKEY);

const resend = new Resend("re_eVqTCY52_7TwPg69dhJ1bjgQKBAqWBfSV");

export async function sendVerificationEmail(email: string, token: string) {
  const link = `http://localhost:3000/verify-email?token=${token}`;

  return resend.emails.send({
    from: "testing@resend.dev",
    to: email,
    subject: "Verify your email address",
    html: `
        <h1>Verify Your email Address</h1>
        <p>Click the link below to verify your email address</p>
        <a href="${link}"> Verify email</a>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const link = `http://localhost:3000/reset-password?token=${token}`;

  return resend.emails.send({
    from: "testing@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `
        <h1>Password Reset mail</h1>
        <p>Click the link below to reset password</p>
        <a href="${link}"> Reset Password</a>
    `,
  });
}
