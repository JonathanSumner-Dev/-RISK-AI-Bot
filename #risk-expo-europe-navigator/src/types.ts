export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type Sector = 'GRC Platform' | 'Cybersecurity' | 'ESG Data' | 'Audit Services' | 'Other';
