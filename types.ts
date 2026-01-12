
export type UserRole = 'ADMIN' | 'CREATOR' | 'AFFILIATE';

export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  stripeConnected: boolean;
  role: UserRole;
  pixKey?: string;
  avatar?: string;
}

export interface Product {
  id: string;
  userId: string;
  name: string;
  description: string;
  price: number;
  deliveryType: 'LINK' | 'FILE';
  deliveryContent: string;
  affiliateAllowed: boolean;
  commissionPercent: number;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  buyerName: string;
  buyerEmail: string;
  buyerWhatsApp?: string;
  amount: number;
  method: 'PIX' | 'CARD';
  status: 'PAID' | 'PENDING' | 'FAILED';
  createdAt: string;
}

export interface VirtualCard {
  id: string;
  userId: string;
  label: string;
  number: string;
  expiry: string;
  cvv: string;
  balance: number;
  status: 'ACTIVE' | 'BLOCKED';
  brand: 'VISA' | 'MASTERCARD';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Fixed missing types reported as errors in services and components

/**
 * Represents the status of an external payment integration.
 */
export enum IntegrationStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  INACTIVE = 'INACTIVE'
}

/**
 * Represents a consolidated balance from a specific provider.
 */
export interface Balance {
  amount: number;
  currency: string;
  provider: 'stripe' | 'paypal' | 'asaas';
}

/**
 * Represents a financial transaction within the platform.
 */
export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  provider: 'stripe' | 'paypal' | 'asaas';
  type: string;
  date: string;
  description: string;
}

/**
 * Represents a payment card (virtual or physical) issued via provider APIs.
 */
export interface Card {
  id: string;
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
  status: string;
  type: string;
}
