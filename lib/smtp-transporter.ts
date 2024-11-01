import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.TRANSPORT_HOST,
  port: process.env.TRANSPORT_PORT,
  secure: process.env.TRANSPORT_PORT === 465 ? true : false,
  ...(process.env.TRANSPORT_AUTH_ENABLE && {
    auth: {
      user: process.env.TRANSPORT_AUTH_USER,
      pass: process.env.TRANSPORT_AUTH_PASSWORD
    }
  })
});
