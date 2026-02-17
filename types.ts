export enum Professional {
  DAVID = 'David (Tattoo)',
  JEY = 'Jey (Piercing)',
  ADMIN = 'Admin'
}

export enum AppointmentStatus {
  SCHEDULED = 'Agendado',
  CONFIRMED = 'Confirmado',
  COMPLETED = 'Realizado',
  CANCELLED = 'Cancelado'
}

export enum ServiceType {
  TATTOO = 'Tatuagem',
  PIERCING = 'Body Piercing',
  BAR = 'Bar'
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  instagram?: string;
  birthDate?: string;
  notes?: string;
  signedTerms: string[]; // IDs of signed terms
}

export interface ServiceItem {
  id: string;
  name: string;
  basePrice: number;
  durationMin: number;
  professional: Professional;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string; // Denormalized for easier display
  serviceId: string;
  serviceName: string;
  date: string; // ISO Date YYYY-MM-DD
  time: string; // HH:mm
  price: number;
  professional: Professional;
  status: AppointmentStatus;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  isAlcoholic: boolean;
  category: 'Bebida' | 'Outro';
}

export interface Sale {
  id: string;
  date: string;
  items: { productId: string; name: string; quantity: number; price: number }[];
  total: number;
  paymentMethod: 'Pix' | 'Dinheiro' | 'Cartão';
}

export interface AppState {
  view: 'dashboard' | 'agenda' | 'clients' | 'bar' | 'financial' | 'services' | 'ai';
  currentUser: Professional;
}