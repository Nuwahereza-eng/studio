export interface Farmer {
  id: string;
  name: string;
  phone: string;
  location: string;
  joinDate: string; // ISO date string
  avatarUrl?: string;
}

export interface MilkDelivery {
  id: string;
  farmerId: string;
  farmerName?: string; // For easier display
  date: string; // ISO date string
  time: string; // HH:MM
  quantityLiters: number;
  quality: 'Good' | 'Fair' | 'Poor';
  recordedBy?: string; // Operator ID or name
}

export interface Payment {
  id: string;
  farmerId: string;
  farmerName?: string; // For easier display
  period: string; // e.g., "Week 1 Jan 2024" or "Jan 2024"
  amount: number;
  datePaid: string; // ISO date string
  deliveryIds?: string[]; // IDs of deliveries covered by this payment
}

// For AI Tips
export interface MilkTestResult {
  [testName: string]: string | number;
}

export interface LocalAgriculturalData {
  weatherPatterns?: string;
  commonFeedTypes?: string[];
  regionalBestPractices?: string;
  soilQuality?: string;
  waterAvailability?: string;
}
