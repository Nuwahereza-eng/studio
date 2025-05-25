import type { Farmer, MilkDelivery, Payment } from '@/types';

export const mockFarmers: Farmer[] = [
  { id: 'FARM001', name: 'John Doe', phone: '0700123456', location: 'Mbarara', joinDate: '2023-01-15', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'FARM002', name: 'Jane Smith', phone: '0701234567', location: 'Bushenyi', joinDate: '2022-11-20', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'FARM003', name: 'Peter Jones', phone: '0702345678', location: 'Isingiro', joinDate: '2023-05-10', avatarUrl: 'https://placehold.co/100x100.png' },
];

export const mockMilkDeliveries: MilkDelivery[] = [
  { id: 'DEL001', farmerId: 'FARM001', farmerName: 'John Doe', date: '2024-07-15', time: '08:30', quantityLiters: 25, quality: 'Good', recordedBy: 'Operator A' },
  { id: 'DEL002', farmerId: 'FARM002', farmerName: 'Jane Smith', date: '2024-07-15', time: '09:15', quantityLiters: 18, quality: 'Fair', recordedBy: 'Operator A' },
  { id: 'DEL003', farmerId: 'FARM001', farmerName: 'John Doe', date: '2024-07-16', time: '08:20', quantityLiters: 22, quality: 'Good', recordedBy: 'Operator B' },
  { id: 'DEL004', farmerId: 'FARM003', farmerName: 'Peter Jones', date: '2024-07-16', time: '10:00', quantityLiters: 30, quality: 'Good', recordedBy: 'Operator B' },
];

export const mockPayments: Payment[] = [
  { id: 'PAY001', farmerId: 'FARM001', farmerName: 'John Doe', period: 'July Week 2 2024', amount: 50000, datePaid: '2024-07-14', deliveryIds: ['DEL001_prev', 'DEL002_prev'] },
  { id: 'PAY002', farmerId: 'FARM002', farmerName: 'Jane Smith', period: 'July Week 2 2024', amount: 38000, datePaid: '2024-07-14', deliveryIds: ['DEL003_prev'] },
];

export const milkPricePerLiter = 1200; // Default price
