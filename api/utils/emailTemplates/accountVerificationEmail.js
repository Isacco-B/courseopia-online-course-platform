import { sendEmail } from "../helpers.js";

export const accountVerificationEmail = async (to, verificationCode) => {
  const text = `You are receiving this because you (or someone else) has requested to verify your account with Courseopia.\n\n
  Please use the following verification code to complete the process:\n\n
  Verification Code: ${verificationCode}\n\n
  If you did not request this, please ignore this email and your account will remain unverified.\n`;

  const html = `<p>You are receiving this because you (or someone else) has requested to verify your account with Courseopia.</p>
    <p>Please use the following verification code to complete the process:</p>
    <p><strong>Verification Code:</strong> ${verificationCode}</p>
    <p>If you did not request this, please ignore this email and your account will remain unverified.</p>`;

  await sendEmail({
    to,
    subject: "Account Verification for Courseopia",
    text,
    html,
  });
};
