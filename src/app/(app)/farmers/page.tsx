
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { mockFarmers } from "@/lib/mock-data";
import type { Farmer } from "@/types";
import { Users, PlusCircle, Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FarmerStatusBadge } from "@/components/shared/farmer-status-badge";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useToast } from "@/hooks/use-toast";

// Define columns outside the component to ensure stable reference
const farmerTableColumns = [
  {
    accessorKey: "avatar",
    header: "",
    cell: (row: Farmer) => (
      <Avatar className="h-9 w-9">
        <AvatarImage src={row.avatarUrl} alt={row.name} data-ai-hint="person" />
        <AvatarFallback>{row.name.charAt(0)}</AvatarFallback>
      </Avatar>
    ),
  },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "location", header: "Location" },
  { 
    accessorKey: "joinDate", 
    header: "Join Date",
    cell: (row: Farmer) => new Date(row.joinDate).toLocaleDateString(),
  },
  {
    accessorKey: "status", 
    header: "Status",
    cell: (row: Farmer) => <FarmerStatusBadge /> 
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: (row: Farmer) => (
      <Button variant="outline" size="sm" asChild>
        <Link href={`/farmers/${row.id}`}>
          <Eye className="mr-2 h-4 w-4" /> View
        </Link>
      </Button>
    ),
  },
];

// Define PDF columns outside the component
const pdfColumns = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "location", header: "Location" },
  { 
    accessorKey: "joinDate", 
    header: "Join Date",
  },
];


export default function FarmersPage() {
  const { toast } = useToast();

  const exportFarmersToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Farmers List Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    const tableColumnNames = pdfColumns.map(col => col.header);
    const tableRows = mockFarmers.map(farmer => 
      pdfColumns.map(col => {
        if (col.accessorKey === 'joinDate') {
          return new Date(farmer.joinDate).toLocaleDateString();
        }
        return (farmer as any)[col.accessorKey] ?? '';
      })
    );

    (doc as any).autoTable({
      head: [tableColumnNames],
      body: tableRows,
      startY: 30,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [85, 139, 47] }, // Primary color (approx)
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save('farmers-list-report.pdf');
    toast({ title: "PDF Exported", description: "Farmers list report has been downloaded." });
  };


  return (
    <>
      <PageHeader
        title="Farmer Management"
        icon={Users}
        description="View, add, and manage farmer records."
        actions={
          <Button asChild>
            <Link href="/farmers/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Farmer
            </Link>
          </Button>
        }
      />
      <DataTable<Farmer>
        columns={farmerTableColumns}
        data={mockFarmers}
        searchKey="name"
        onExport={exportFarmersToPDF}
      />
    </>
  );
}
