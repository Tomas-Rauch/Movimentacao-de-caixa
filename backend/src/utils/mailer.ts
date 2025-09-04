import sgMail from '@sendgrid/mail';

export async function sendEmail(to: string, subject: string, html: string) {
  // Valida se a API Key do SendGrid está configurada
  if (!process.env.SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY não está configurada nas variáveis de ambiente.');
    throw new Error('Configuração de envio de e-mail incompleta.');
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: to,
    from: {
      name: 'Movimentação de Caixa',
      email: process.env.EMAIL_FROM || '', // Usa a variável EMAIL_FROM para o e-mail
    },
    subject: subject,
    html: html,
  };

  try {
    await sgMail.send(msg);
    console.log(`E-mail enviado com sucesso para ${to}`);
  } catch (error: unknown) {
    console.error('Erro ao enviar e-mail via SendGrid:', error);

    // Type guard para verificar se o erro tem a estrutura que esperamos da API do SendGrid
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const sgError = error as { response?: { body?: any } };
      console.error('Detalhes do corpo do erro (SendGrid):', sgError.response?.body);
    }
    
    throw new Error('Falha ao enviar o e-mail.');
  }
}
