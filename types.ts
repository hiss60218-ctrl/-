export type CollectionStatus = 'active' | 'promise_to_pay' | 'unreachable' | 'legal' | 'paid';

export interface PaymentRecord {
  id: string;
  date: number;
  amount: number;
  method: 'cash' | 'card' | 'transfer';
  note?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  carModel: string;
  startDate: string;
  endDate?: string;
  dailyRate?: number;
  totalAmount: number;
  paidAmount: number;
  lastAlertDate?: number; // Timestamp of last alert
  createdAt: number;
  lastRentUpdate?: number;
  
  // Collections Fields
  collectionStatus?: CollectionStatus;
  lastContactDate?: number;
  nextFollowUpDate?: string; // YYYY-MM-DD
  collectionNotes?: { date: number; note: string; type: 'call' | 'whatsapp' | 'note' }[];
  paymentHistory?: PaymentRecord[];
}

export interface MessageLog {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  message: string;
  status: 'sent' | 'failed' | 'pending';
  type: 'whatsapp' | 'sms';
  timestamp: number;
  auto: boolean; // True if sent by automation system
}

export interface AppSettings {
  alertThreshold: number;
  alertMessageTemplate: string;
  currency: string;
  autoAlertsEnabled: boolean;
  autoAlertTime: string; // e.g., "10:00"
}

export interface DashboardStats {
  totalCustomers: number;
  totalDebt: number;
  overThresholdCount: number;
  collectionRate: number;
  todayCollected: number;
}