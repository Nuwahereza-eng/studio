
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/shared/date-picker-with-range";
import { Label } from "@/components/ui/label"; // Added Label import
import { mockFarmers, mockPayments, milkPricePerLiter, mockMilkDeliveries } from "@/lib/mock-data";
import type { Payment, Farmer, MilkDelivery } from "@/types"; // Added MilkDelivery
import { CreditCard, Download, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type DateRange } from "react-day-picker";
import { format } from "date-fns";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Define columns outside the component for stable reference
const paymentTableColumns = [
  { accessorKey: "farmerName", header: "Farmer Name" },
  { accessorKey: "period", header: "Period" },
  { accessorKey: "amount", header: "Amount (UGX)", cell: (row: Payment) => row.amount.toLocaleString() },
  { accessorKey: "datePaid", header: "Date Paid", cell: (row: Payment) => new Date(row.datePaid).toLocaleDateString() },
  {
    accessorKey: "actions",
    header: "Export",
    cell: (row: Payment) => (
      <Button variant="ghost" size="sm" onClick={() => alert(`Individual PDF export for ${row.farmerName} statement coming soon.`)}>
        <Download className="h-4 w-4" />
      </Button>
    ),
  },
];

export default function PaymentReportsPage() {
  const [selectedFarmer, setSelectedFarmer] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [generatedReport, setGeneratedReport] = useState<Payment[]>([]);
  const { toast } = useToast();
  
  const handleGenerateReport = () => {
    if (!selectedFarmer && !dateRange?.from && !dateRange?.to) {
       toast({ title: "Please select a farmer or a date range to generate a report.", variant: "destructive" });
       return;
    }
    
    let reportData = mockPayments; // Default to existing mock payments for structure
    let newReportEntries: Payment[] = [];

    const farmerDeliveries = mockMilkDeliveries.filter(d => 
        (!selectedFarmer || selectedFarmer === "all" || d.farmerId === selectedFarmer) &&
        dateRange?.from && new Date(d.date) >= dateRange.from &&
        dateRange?.to && new Date(d.date) <= dateRange.to
    );

    if(farmerDeliveries.length > 0) {
        const reportByFarmer: Record<string, { totalQuantity: number, deliveries: MilkDelivery[] }> = {};

        farmerDeliveries.forEach(delivery => {
            if (!reportByFarmer[delivery.farmerId]) {
                reportByFarmer[delivery.farmerId] = { totalQuantity: 0, deliveries: [] };
            }
            reportByFarmer[delivery.farmerId].totalQuantity += delivery.quantityLiters;
            reportByFarmer[delivery.farmerId].deliveries.push(delivery);
        });

        newReportEntries = Object.keys(reportByFarmer).map(farmerIdEntry => {
            const farmerData = reportByFarmer[farmerIdEntry];
            const totalAmount = farmerData.totalQuantity * milkPricePerLiter;
            const farmerDetails = mockFarmers.find(f => f.id === farmerIdEntry);
            
            return {
                id: `REP-${farmerIdEntry}-${Date.now()}`,
                farmerId: farmerIdEntry,
                farmerName: farmerDetails?.name || 'Unknown Farmer',
                period: `${dateRange?.from ? format(dateRange.from, "dd/MM/yy") : ''} - ${dateRange?.to ? format(dateRange.to, "dd/MM/yy") : 'Overall'}`,
                amount: totalAmount,
                datePaid: format(new Date(), "yyyy-MM-dd"), 
                deliveryIds: farmerData.deliveries.map(d => d.id)
            };
        });
        setGeneratedReport(newReportEntries);
        toast({ title: "Report Generated", description: `Payment report(s) created for the selected criteria.` });

    } else if (selectedFarmer && selectedFarmer !== "all") {
        // If specific farmer selected but no new deliveries, show their existing payments
        newReportEntries = mockPayments.filter(p => p.farmerId === selectedFarmer);
        setGeneratedReport(newReportEntries);
        toast({ title: "Showing Existing Reports", description: `No new deliveries in selected range for ${mockFarmers.find(f=>f.id === selectedFarmer)?.name}. Displaying past payments.` });
    } else {
        // No specific farmer, no new deliveries in range -> empty report
        setGeneratedReport([]);
        toast({ title: "No Data", description: "No deliveries found for the selected criteria to generate a new report." });
    }
  };

  const exportOverallReportToPDF = () => {
    const dataToExport = generatedReport.length > 0 ? generatedReport : mockPayments;
    if (dataToExport.length === 0) {
      toast({ title: "No Data to Export", description: "Please generate a report or ensure there are payments to export.", variant: "destructive" });
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Overall Payment Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    const tableColumnNames = paymentTableColumns.filter(col => col.accessorKey !== "actions").map(col => col.header);
    const tableRows = dataToExport.map(payment => 
      paymentTableColumns.filter(col => col.accessorKey !== "actions").map(col => {
        if (col.accessorKey === 'amount') {
          return payment.amount.toLocaleString();
        }
        if (col.accessorKey === 'datePaid') {
          return new Date(payment.datePaid).toLocaleDateString();
        }
        return (payment as any)[col.accessorKey] ?? '';
      })
    );

    (doc as any).autoTable({
      head: [tableColumnNames],
      body: tableRows,
      startY: 30,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [255, 179, 0] }, // Accent color (approx)
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save('overall-payment-report.pdf');
    toast({ title: "PDF Exported", description: "Overall payment report has been downloaded." });
  };


  return (
    <>
      <PageHeader
        title="Payment Reports"
        icon={CreditCard}
        description="Generate and view payment reports for farmers."
      />
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Generate New Report</CardTitle>
          <CardDescription>Select criteria to generate a payment report.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-0 md:flex md:items-end md:gap-4">
          <div className="flex-1">
            <Label htmlFor="farmer-select" className="text-sm font-medium mb-1 block">Farmer (Optional)</Label>
            <Select onValueChange={setSelectedFarmer} value={selectedFarmer}>
              <SelectTrigger id="farmer-select">
                <SelectValue placeholder="All Farmers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Farmers</SelectItem>
                {mockFarmers.map((farmer) => (
                  <SelectItem key={farmer.id} value={farmer.id}>
                    {farmer.name} ({farmer.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label htmlFor="date-range-picker" className="text-sm font-medium mb-1 block">Date Range (Required for new calculation)</Label>
             <DatePickerWithRange id="date-range-picker" date={dateRange} onDateChange={setDateRange} />
          </div>
          <Button onClick={handleGenerateReport} className="w-full md:w-auto">
            <BarChart3 className="mr-2 h-4 w-4" /> Generate Report
          </Button>
        </CardContent>
      </Card>

      <DataTable<Payment>
        columns={paymentTableColumns}
        data={generatedReport.length > 0 ? generatedReport : mockPayments} 
        searchKey="farmerName"
        onExport={exportOverallReportToPDF}
      />
    </>
  );
}
