export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  pharmacyIds?: string[]; // IDs of pharmacies owned by this company
}

export interface Pharmacy {
  id: string;
  name: string;
  companyId?: string; // Optional - pharmacy can be independent or part of a company
  companyName?: string;
  email: string;
  phone: string;
  postcode: string;
  address: string;
  notes?: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'ongoing' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  pharmacyId?: string; // Changed from companyId
  pharmacyName?: string; // Changed from companyName
  companyId?: string;
  companyName?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}
