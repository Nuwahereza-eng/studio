"use client";

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { mockFarmers, mockMilkDeliveries, mockPayments } from '@/lib/mock-data';
import type { Farmer, MilkDelivery, Payment } from '@/types';
import { PageHeader } from '@/components/shared/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/shared/data-table';
import { MilkProductionTipsGenerator } from '@/components/features/milk-production-tips-generator';
import { User, Edit, Droplets, CreditCard, Sparkles, MapPin, Phone, CalendarDays } from 'lucide-react';
import Link from 'next/link';

export default function FarmerDetailPage() {
  const params = useParams();
  const farmerId = params.id as string;

  // In a real app, fetch farmer data based on ID
  const farmer = mockFarmers.find(f => f.id === farmerId);
  const deliveries = mockMilkDeliveries.filter(d => d.farmerId === farmerId);
  const payments = mockPayments.filter(p => p.farmerId === farmerId);

  if (!farmer) {
    return (
      <>
        <PageHeader title="Farmer Not Found" icon={User} />
        <p>The farmer with ID {farmerId} could not be found.</p>
        <Button asChild className="mt-4">
          <Link href="/farmers">Back to Farmers List</Link>
        </Button>
      </>
    );
  }

  const deliveryColumns = [
    { accessorKey: 'date', header: 'Date', cell: (row: MilkDelivery) => new Date(row.date).toLocaleDateString() },
    { accessorKey: 'time', header: 'Time' },
    { accessorKey: 'quantityLiters', header: 'Quantity (L)' },
    { accessorKey: 'quality', header: 'Quality' },
  ];

  const paymentColumns = [
    { accessorKey: 'period', header: 'Period' },
    { accessorKey: 'amount', header: 'Amount (UGX)', cell: (row: Payment) => row.amount.toLocaleString() },
    { accessorKey: 'datePaid', header: 'Date Paid', cell: (row: Payment) => new Date(row.datePaid).toLocaleDateString() },
  ];

  return (
    <>
      <PageHeader
        title={farmer.name}
        icon={User}
        description={`Details for farmer ID: ${farmer.id}`}
        actions={
          <Button variant="outline" disabled>
            <Edit className="mr-2 h-4 w-4" /> Edit Farmer (Coming Soon)
          </Button>
        }
      />

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="details"><User className="mr-2 h-4 w-4 md:hidden"/>Details</TabsTrigger>
          <TabsTrigger value="deliveries"><Droplets className="mr-2 h-4 w-4 md:hidden"/>Deliveries</TabsTrigger>
          <TabsTrigger value="payments"><CreditCard className="mr-2 h-4 w-4 md:hidden"/>Payments</TabsTrigger>
          <TabsTrigger value="ai-tips"><Sparkles className="mr-2 h-4 w-4 md:hidden"/>AI Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Farmer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={farmer.avatarUrl} alt={farmer.name} data-ai-hint="person portrait" />
                  <AvatarFallback>{farmer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{farmer.name}</h2>
                  <p className="text-sm text-muted-foreground">ID: {farmer.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{farmer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{farmer.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>Joined: {new Date(farmer.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
               <Image
                  src="https://placehold.co/600x400.png"
                  alt="Placeholder farm image"
                  width={600}
                  height={400}
                  className="rounded-md object-cover aspect-video mt-4"
                  data-ai-hint="farm landscape"
                />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deliveries">
          <Card>
            <CardHeader>
              <CardTitle>Milk Deliveries</CardTitle>
              <CardDescription>History of milk deliveries made by {farmer.name}.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable<MilkDelivery> columns={deliveryColumns} data={deliveries} searchKey="date" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Statements</CardTitle>
              <CardDescription>Payment history for {farmer.name}.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable<Payment> columns={paymentColumns} data={payments} searchKey="period" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-tips">
          <MilkProductionTipsGenerator farmerId={farmer.id} />
        </TabsContent>
      </Tabs>
    </>
  );
}
