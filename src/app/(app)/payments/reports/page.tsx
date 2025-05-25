
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/shared/date-picker-with-range";
import { mockFarmers, mockPayments, milkPricePerLiter, mockMilkDeliveries } from "@/lib/mock-data";
import type { Payment, Farmer } from "@/types";
import { CreditCard, Download, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type DateRange } from "react-day-picker";
import { format } from "date-fns";


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
    
    let reportData = mockPayments;
    if(selectedFarmer && selectedFarmer !== "all") {
        reportData = reportData.filter(p => p.farmerId === selectedFarmer);
    }
    
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

        const newReportEntries: Payment[] = Object.keys(reportByFarmer).map(farmerIdEntry => {
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
        setGeneratedReport(mockPayments.filter(p => p.farmerId === selectedFarmer));
        toast({ title: "Showing Existing Reports", description: `No new deliveries in selected range for ${mockFarmers.find(f=>f.id === selectedFarmer)?.name}. Displaying past payments.` });
    }
     else {
        setGeneratedReport([]);
        toast({ title: "No Data", description: "No deliveries found for the selected criteria." });
    }
  };

  const paymentColumns = [
    { accessorKey: "farmerName", header: "Farmer Name" },
    { accessorKey: "period", header: "Period" },
    { accessorKey: "amount", header: "Amount (UGX)", cell: (row: Payment) => row.amount.toLocaleString() },
    { accessorKey: "datePaid", header: "Date Paid", cell: (row: Payment) => new Date(row.datePaid).toLocaleDateString() },
    {
      accessorKey: "actions",
      header: "Export",
      cell: (row: Payment) => (
        <Button variant="ghost" size="sm" onClick={() => alert(`Exporting PDF for ${row.farmerName}`)}>
          <Download className="h-4 w-4" />
        </Button>
      ),
    },
  ];

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
            <label htmlFor="farmer-select" className="text-sm font-medium mb-1 block">Farmer (Optional)</label>
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
            <label htmlFor="date-range" className="text-sm font-medium mb-1 block">Date Range (Required for new calculation)</label>
             <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
          </div>
          <Button onClick={handleGenerateReport} className="w-full md:w-auto">
            <BarChart3 className="mr-2 h-4 w-4" /> Generate Report
          </Button>
        </CardContent>
      </Card>

      <DataTable<Payment>
        columns={paymentColumns}
        data={generatedReport.length > 0 ? generatedReport : mockPayments} // Show generated or all mock payments initially
        searchKey="farmerName"
        onExport={() => alert("Overall export CSV not yet implemented.")}
      />
    </>
  );
}

