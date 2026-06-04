// TODO(phase-8): provider selection — see docs/GO_LIVE/DEV.md §8.2
// Candidates: Twilio (international + WhatsApp Business API), Clickatell (SA-focused), Infobip.
// Default binding until chosen: NoopSmsService.

export interface SmsMessage {
  to: string;
  body: string;
}

export interface SmsDeliveryResult {
  delivered: boolean;
  providerId: string;
  providerMessageId?: string;
  error?: string;
}

export interface ISmsService {
  send(message: SmsMessage): Promise<SmsDeliveryResult>;
}
