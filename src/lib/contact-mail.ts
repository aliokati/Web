import type SMTPTransport from 'nodemailer/lib/smtp-transport';

export function getMailConfig(): {sender: string; transport: SMTPTransport.Options} | null {
  const password = process.env.KRISM_SMTP_PASSWORD;
  const port = Number(process.env.KRISM_SMTP_PORT || '465');
  if (!password || password.startsWith('replace_with_') || ![465, 587].includes(port)) return null;
  const sender = process.env.KRISM_SMTP_USER || 'info@krism-society.com';
  return {
    sender,
    transport: {
      host: process.env.KRISM_SMTP_HOST || 'mail.krism-society.com',
      port,
      secure: port === 465,
      requireTLS: true,
      tls: {minVersion: 'TLSv1.2'},
      auth: {user: sender, pass: password},
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
      dnsTimeout: 10000,
      disableFileAccess: true,
      disableUrlAccess: true,
      logger: false,
      debug: false,
    },
  };
}
