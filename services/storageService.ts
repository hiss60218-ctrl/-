import { Customer, AppSettings, MessageLog } from '../types';
import { DEFAULT_SETTINGS, MOCK_CUSTOMERS } from '../constants';

const CUSTOMERS_KEY = 'rentpay_customers';
const SETTINGS_KEY = 'rentpay_settings';
const LOGS_KEY = 'rentpay_logs';

const initData = () => {
  if (!localStorage.getItem(CUSTOMERS_KEY)) {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(MOCK_CUSTOMERS));
  }
};

initData();

export const StorageService = {
  getCustomers: (): Customer[] => {
    const data = localStorage.getItem(CUSTOMERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveCustomer: (customer: Customer): void => {
    const customers = StorageService.getCustomers();
    const existingIndex = customers.findIndex(c => c.id === customer.id);
    
    if (existingIndex >= 0) {
      customers[existingIndex] = customer;
    } else {
      customers.push(customer);
    }
    
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  },

  deleteCustomer: (id: string): void => {
    const customers = StorageService.getCustomers().filter(c => c.id !== id);
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  },

  getSettings: (): AppSettings => {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  },

  saveSettings: (settings: AppSettings): void => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  // Message Logs & Automation
  getLogs: (): MessageLog[] => {
    const data = localStorage.getItem(LOGS_KEY);
    return data ? JSON.parse(data) : [];
  },

  addLog: (log: MessageLog): void => {
    const logs = StorageService.getLogs();
    logs.unshift(log); // Add to top
    // Keep only last 100 logs
    if (logs.length > 100) logs.pop();
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  },

  // This function simulates the backend "Cron Job"
  runAutomationCheck: (): { alertsSent: number; rentUpdated: boolean } => {
    const settings = StorageService.getSettings();
    const customers = StorageService.getCustomers();
    
    let sentCount = 0;
    let rentUpdated = false;
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    const updatedCustomers = customers.map(c => {
      let modified = false;
      let customer = { ...c };

      // 1. Rent Update Logic (Daily Rate)
      if (customer.dailyRate && customer.dailyRate > 0 && !customer.endDate) {
        const lastUpdate = customer.lastRentUpdate || customer.createdAt;
        // Check if 24 hours passed since last update
        if (now - lastUpdate >= oneDay) {
           const daysPassed = Math.floor((now - lastUpdate) / oneDay);
           if (daysPassed > 0) {
             customer.totalAmount += (customer.dailyRate * daysPassed);
             customer.lastRentUpdate = now;
             modified = true;
             rentUpdated = true;
           }
        }
      }

      // 2. Alert Logic
      if (settings.autoAlertsEnabled) {
        const remaining = customer.totalAmount - customer.paidAmount;
        // Condition: Over threshold AND (never alerted OR alerted more than 24h ago)
        if (remaining >= settings.alertThreshold) {
          if (!customer.lastAlertDate || (now - customer.lastAlertDate > oneDay)) {
            // Send Alert
            const message = settings.alertMessageTemplate
              .replace('{name}', customer.name)
              .replace('{amount}', remaining.toString())
              .replace('{car}', customer.carModel)
              .replace('{currency}', settings.currency);

            const newLog: MessageLog = {
              id: Date.now().toString() + Math.random(),
              customerId: customer.id,
              customerName: customer.name,
              phone: customer.phone,
              message: message,
              status: 'sent', // Assume success for simulation
              type: 'whatsapp',
              timestamp: now,
              auto: true
            };
            
            StorageService.addLog(newLog);
            sentCount++;
            customer.lastAlertDate = now;
            modified = true;
          }
        }
      }
      return modified ? customer : c;
    });

    const hasChanges = updatedCustomers.some((c, i) => c !== customers[i]);

    if (hasChanges) {
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(updatedCustomers));
    }

    return { alertsSent: sentCount, rentUpdated };
  }
};