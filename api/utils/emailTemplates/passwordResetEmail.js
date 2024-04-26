import { sendEmail } from "../helpers.js";

export const sendResetPasswordEmail = async (to, resetLink) => {
  const text = `You are receiving this because you (or someone else) has requested the reset of the password for your account.\n\n
  Please click on the following link, or paste this into your browser to complete the process:\n\n
  ${resetLink}\n\n
  If you did not request this, please ignore this email and your password will remain unchanged.\n`;
  const html = `<p>You are receiving this because you (or someone else) has requested the reset of the password for your account.</p>
    <p>Please click on the following link, or paste this into your browser to complete the process:</p>
    <p><a href="${resetLink}">${resetLink}</a></p>
    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`;

  await sendEmail({
    to,
    subject: "Password Reset Request for Courseopia",
    text,
    html,
  });

};
