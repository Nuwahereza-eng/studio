"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockFarmers, mockPayments, mockMilkDeliveries } from "@/lib/mock-data";
import type { Payment, MilkDelivery, Farmer } from "@/types";
import { DollarSign, FileText, Users } from "lucide-react";

export default function FarmerPaymentViewPage() {
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | undefined>(mockFarmers[0]?.id);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [deliveries, setDeliveries] = useState<MilkDelivery[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | undefined>(mockFarmers[0]);

  useEffect(() => {
    if (selectedFarmerId) {
      setSelectedFarmer(mockFarmers.find(f => f.id === selectedFarmerId));
      setPayments(mockPayments.filter(p => p.farmerId === selectedFarmerId));
      setDeliveries(mockMilkDeliveries.filter(d => d.farmerId === selectedFarmerId));
    } else {
      setSelectedFarmer(undefined);
      setPayments([]);
      setDeliveries([]);
    }
  }, [selectedFarmerId]);

  const paymentColumns = [
    { accessorKey: "period", header: "Period" },
    { accessorKey: "amount", header: "Amount (UGX)", cell: (row: Payment) => row.amount.toLocaleString() },
    { accessorKey: "datePaid", header: "Date Paid", cell: (row: Payment) => new Date(row.datePaid).toLocaleDateString() },
  ];

  const deliveryColumns = [
    { accessorKey: 'date', header: 'Date', cell: (row: MilkDelivery) => new Date(row.date).toLocaleDateString() },
    { accessorKey: 'time', header: 'Time' },
    { accessorKey: 'quantityLiters', header: 'Quantity (L)' },
    { accessorKey: 'quality', header: 'Quality' },
  ];

  return (
    <>
      <PageHeader
        title="Farmer Payment Statements"
        icon={DollarSign}
        description="View your payment history and milk delivery records."
      />
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5"/>Select Farmer</CardTitle>
          <CardDescription>Choose a farmer to view their statements. (For demo purposes - farmers would see their own data).</CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedFarmerId} defaultValue={selectedFarmerId}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Select a farmer" />
            </SelectTrigger>
            <SelectContent>
              {mockFarmers.map((farmer) => (
                <SelectItem key={farmer.id} value={farmer.id}>
                  {farmer.name} ({farmer.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedFarmer && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment History for {selectedFarmer.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {payments.length > 0 ? (
                <DataTable<Payment> columns={paymentColumns} data={payments} />
              ) : (
                <p className="text-muted-foreground">No payment records found for this farmer.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5"/>
                Delivery Records for {selectedFarmer.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {deliveries.length > 0 ? (
                <DataTable<MilkDelivery> columns={deliveryColumns} data={deliveries} />
              ) : (
                <p className="text-muted-foreground">No delivery records found for this farmer.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      {!selectedFarmerId && (
        <p className="text-center text-muted-foreground mt-8">Please select a farmer to view their data.</p>
      )}
    </>
  );
}

