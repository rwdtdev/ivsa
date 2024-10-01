import nodemailer from 'nodemailer';

const isAuthEnable = process.env.TRANSPORT_AUTH_ENABLE === 'true';

export const transporter = nodemailer.createTransport({
  host: process.env.TRANSPORT_HOST,
  port: process.env.TRANSPORT_PORT,
  secure: process.env.TRANSPORT_PORT === 465 ? true : false,
  ...(isAuthEnable && {
    auth: {
      user: process.env.TRANSPORT_AUTH_USER,
      pass: process.env.TRANSPORT_AUTH_PASSWORD
    }
  })
});
