import nodemailer from 'nodemailer'

export async function sendEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587, // Porta padrão para TLS. Altere se necessário.
    secure: false, // true para 465, false para outras portas
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Movimentação de Caixa" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}