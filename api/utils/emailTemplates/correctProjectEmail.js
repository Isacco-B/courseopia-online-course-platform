import { sendEmail } from "../helpers.js";

export const sendCorrectProjectEmail = async (to, userName) => {
  const text = `Hello ${userName}.\n\n
  Your project has been reviewed!\n\n
  You can find the feedback ready on the platform.\n
  Happy studying.\n`;

  const html = `<p>Hello ${userName}.</p>
    <p>Your project has been reviewed!</p>
    <p>You can find the feedback ready on the platform.</p>
    <p>Happy studying.</p>`;

  await sendEmail({
    to,
    subject: "Your project has been corrected",
    text,
    html,
  });
};
