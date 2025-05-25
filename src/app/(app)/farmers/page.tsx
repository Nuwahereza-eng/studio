"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { mockFarmers } from "@/lib/mock-data";
import type { Farmer } from "@/types";
import { Users, PlusCircle, Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Placeholder export function
const exportFarmersToCSV = () => {
  console.log("Exporting farmers to CSV...");
  alert("CSV export functionality is not yet implemented.");
};


export default function FarmersPage() {
  const columns = [
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
      accessorKey: "status", // Example of a status column
      header: "Status",
      cell: (row: Farmer) => (
        <Badge variant={ Math.random() > 0.5 ? "default" : "secondary"}>
          { Math.random() > 0.5 ? "Active" : "Inactive"}
        </Badge>
      )
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
        columns={columns}
        data={mockFarmers}
        searchKey="name"
        onExport={exportFarmersToCSV}
      />
    </>
  );
}
