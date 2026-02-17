import { Appointment, Client, Product, Sale, Professional, AppointmentStatus, ServiceItem, ServiceType } from '../types';

// Mock Data Initialization
const INITIAL_CLIENTS: Client[] = [
  { id: '1', name: 'Alice Silva', phone: '11999998888', instagram: '@alice.art', notes: 'Alergia a látex' , signedTerms: []},
  { id: '2', name: 'Bruno Souza', phone: '11988887777', instagram: '@bruno_s', notes: '', signedTerms: [] },
];

const INITIAL_SERVICES: ServiceItem[] = [
  { id: 's1', name: 'Flash Tattoo Caveira', basePrice: 300, durationMin: 120, professional: Professional.DAVID },
  { id: 's2', name: 'Tatuagem Fechamento Braço', basePrice: 1500, durationMin: 240, professional: Professional.DAVID },
  { id: 's3', name: 'Piercing Nariz (Nostril)', basePrice: 80, durationMin: 30, professional: Professional.JEY },
  { id: 's4', name: 'Piercing Umbigo', basePrice: 100, durationMin: 40, professional: Professional.JEY },
];

const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Cerveja Heineken', price: 12, stock: 24, isAlcoholic: true, category: 'Bebida' },
  { id: 'p2', name: 'Água s/ Gás', price: 5, stock: 50, isAlcoholic: false, category: 'Bebida' },
  { id: 'p3', name: 'Refrigerante Lata', price: 6, stock: 30, isAlcoholic: false, category: 'Bebida' },
  { id: 'p4', name: 'Hidromel Viking', price: 25, stock: 10, isAlcoholic: true, category: 'Bebida' },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  { 
    id: 'a1', clientId: '1', clientName: 'Alice Silva', serviceId: 's1', serviceName: 'Flash Tattoo Caveira', 
    date: new Date().toISOString().split('T')[0], time: '14:00', price: 300, professional: Professional.DAVID, status: AppointmentStatus.SCHEDULED 
  },
  { 
    id: 'a2', clientId: '2', clientName: 'Bruno Souza', serviceId: 's3', serviceName: 'Piercing Nariz', 
    date: new Date().toISOString().split('T')[0], time: '16:00', price: 80, professional: Professional.JEY, status: AppointmentStatus.CONFIRMED 
  }
];

// Helper to simulate DB
const get = <T>(key: string, initial: T): T => {
  const stored = localStorage.getItem(key);
  if (!stored) return initial;
  try {
    return JSON.parse(stored);
  } catch {
    return initial;
  }
};

const set = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Store Interface
export const store = {
  getClients: () => get<Client[]>('viking_clients', INITIAL_CLIENTS),
  addClient: (client: Client) => {
    const data = get<Client[]>('viking_clients', INITIAL_CLIENTS);
    set('viking_clients', [...data, client]);
  },
  
  getServices: () => get<ServiceItem[]>('viking_services', INITIAL_SERVICES),
  
  getAppointments: () => get<Appointment[]>('viking_appointments', INITIAL_APPOINTMENTS),
  addAppointment: (apt: Appointment) => {
    const data = get<Appointment[]>('viking_appointments', INITIAL_APPOINTMENTS);
    set('viking_appointments', [...data, apt]);
  },
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => {
    const data = get<Appointment[]>('viking_appointments', INITIAL_APPOINTMENTS);
    const updated = data.map(a => a.id === id ? { ...a, status } : a);
    set('viking_appointments', updated);
  },

  getProducts: () => get<Product[]>('viking_products', INITIAL_PRODUCTS),
  updateProductStock: (id: string, newStock: number) => {
    const data = get<Product[]>('viking_products', INITIAL_PRODUCTS);
    const updated = data.map(p => p.id === id ? { ...p, stock: newStock } : p);
    set('viking_products', updated);
  },

  getSales: () => get<Sale[]>('viking_sales', []),
  addSale: (sale: Sale) => {
    const data = get<Sale[]>('viking_sales', []);
    set('viking_sales', [...data, sale]);
  }
};