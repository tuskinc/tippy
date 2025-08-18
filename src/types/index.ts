export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'data';
  content: string;
  image_urls?: string[];
}
