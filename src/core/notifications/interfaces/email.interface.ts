// TODO(phase-8): provider selection — see docs/GO_LIVE/DEV.md §8.1
// Candidates: SendGrid (preferred, best ZA deliverability), Postmark, AWS SES.
// Until one is chosen, default binding is NodemailerEmailService (SMTP) or NoopEmailService.

export interface EmailMessage {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  fromName?: string;
}

export interface EmailDeliveryResult {
  delivered: boolean;
  providerId: string;
  providerMessageId?: string;
  error?: string;
}

export interface IEmailService {
  send(message: EmailMessage): Promise<EmailDeliveryResult>;
}
