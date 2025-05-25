"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { MilkDeliveryForm } from "@/components/forms/milk-delivery-form";
import { DataTable } from "@/components/shared/data-table";
import { mockMilkDeliveries } from "@/lib/mock-data";
import type { MilkDelivery } from "@/types";
import { Droplets, FileText, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Placeholder export function
const exportDeliveriesToCSV = () => {
  console.log("Exporting deliveries to CSV...");
  alert("CSV export functionality is not yet implemented.");
};

export default function DeliveriesPage() {
  const deliveryColumns = [
    { accessorKey: 'date', header: 'Date', cell: (row: MilkDelivery) => new Date(row.date).toLocaleDateString() },
    { accessorKey: 'time', header: 'Time' },
    { accessorKey: 'farmerName', header: 'Farmer Name' },
    { accessorKey: 'quantityLiters', header: 'Quantity (L)' },
    { accessorKey: 'quality', header: 'Quality' },
    { accessorKey: 'recordedBy', header: 'Recorded By' },
  ];

  return (
    <>
      <PageHeader
        title="Milk Deliveries Management"
        icon={Droplets}
        description="Record new milk deliveries and view daily collection logs."
      />
      <Tabs defaultValue="record" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="record"><PlusCircle className="mr-2 h-4 w-4 md:hidden"/>Record Delivery</TabsTrigger>
          <TabsTrigger value="logs"><FileText className="mr-2 h-4 w-4 md:hidden"/>View Collection Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="record">
          <MilkDeliveryForm />
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Daily Collection Logs</CardTitle>
              <CardDescription>A log of all milk deliveries recorded.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable<MilkDelivery>
                columns={deliveryColumns}
                data={mockMilkDeliveries}
                searchKey="farmerName"
                onExport={exportDeliveriesToCSV}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
