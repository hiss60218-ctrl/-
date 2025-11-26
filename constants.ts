import { AppSettings } from './types';

export const DEFAULT_SETTINGS: AppSettings = {
  alertThreshold: 500,
  alertMessageTemplate: "عزيزي العميل {name}، نود إعلامكم بأن المبلغ المستحق عليكم لسيارة ({car}) تجاوز {amount} {currency}. يرجى السداد في أقرب وقت لتجنب تراكم الرسوم. شكراً لكم.",
  currency: "درهم",
  autoAlertsEnabled: true,
  autoAlertTime: "10:00"
};

export const AVAILABLE_CARS = [
  { model: "Toyota Prado", category: "SUV", defaultRate: 400 },
  { model: "Honda Civic", category: "Sedan", defaultRate: 200 },
  { model: "BMW X5", category: "Luxury", defaultRate: 600 },
  { model: "Nissan Patrol", category: "SUV", defaultRate: 500 },
  { model: "Toyota Camry", category: "Sedan", defaultRate: 180 },
  { model: "Hyundai Elantra", category: "Sedan", defaultRate: 150 }
];

export const MOCK_CUSTOMERS = [
  {
    id: "1",
    name: "أحمد محمد علي",
    phone: "971500000001",
    carModel: "Toyota Camry",
    startDate: "2023-10-01",
    dailyRate: 180,
    totalAmount: 2000,
    paidAmount: 1200,
    createdAt: Date.now()
  },
  {
    id: "2",
    name: "سارة عبدالله",
    phone: "971500000002",
    carModel: "Nissan Patrol",
    startDate: "2023-10-05",
    dailyRate: 500,
    totalAmount: 5000,
    paidAmount: 5000,
    createdAt: Date.now() - 10000
  },
  {
    id: "3",
    name: "خالد يوسف",
    phone: "971500000003",
    carModel: "Hyundai Elantra",
    startDate: "2023-10-10",
    dailyRate: 150,
    totalAmount: 1500,
    paidAmount: 500,
    createdAt: Date.now() - 20000
  },
  {
    id: "4",
    name: "شركة النقل السريع",
    phone: "971500000004",
    carModel: "أسطول (3 سيارات)",
    startDate: "2023-09-15",
    dailyRate: 1000,
    totalAmount: 12000,
    paidAmount: 10500,
    createdAt: Date.now() - 50000
  }
];