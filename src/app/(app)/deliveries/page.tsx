
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
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useToast } from "@/hooks/use-toast";

export default function DeliveriesPage() {
  const { toast } = useToast();

  const deliveryColumns = [
    { accessorKey: 'date', header: 'Date', cell: (row: MilkDelivery) => new Date(row.date).toLocaleDateString() },
    { accessorKey: 'time', header: 'Time' },
    { accessorKey: 'farmerName', header: 'Farmer Name' },
    { accessorKey: 'quantityLiters', header: 'Quantity (L)' },
    { accessorKey: 'quality', header: 'Quality' },
    { accessorKey: 'recordedBy', header: 'Recorded By' },
  ];

  const exportDeliveriesToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Milk Deliveries Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    const tableColumnNames = deliveryColumns.map(col => col.header);
    const tableRows = mockMilkDeliveries.map(delivery => 
      deliveryColumns.map(col => {
        if (col.accessorKey === 'date') {
          return new Date(delivery.date).toLocaleDateString();
        }
        return (delivery as any)[col.accessorKey] ?? '';
      })
    );

    (doc as any).autoTable({
      head: [tableColumnNames],
      body: tableRows,
      startY: 30,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] }, // Primary color (approx)
      alternateRowStyles: { fillColor: [245, 245, 245] }, // Light gray
    });

    doc.save('milk-deliveries-report.pdf');
    toast({ title: "PDF Exported", description: "Milk deliveries report has been downloaded." });
  };


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
                onExport={exportDeliveriesToPDF}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
