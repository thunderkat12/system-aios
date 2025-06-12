
export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  event: string;
  description: string;
  isActive: boolean;
  lastTest?: string;
  lastTestStatus?: 'success' | 'error';
}

export interface EditForm {
  name: string;
  url: string;
  description: string;
}
