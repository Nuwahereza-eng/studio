
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { Settings, Users, DollarSign, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { milkPricePerLiter as initialMilkPrice } from "@/lib/mock-data";

interface Operator {
  id: string;
  name: string;
  role: string;
  status: "Active" | "Inactive";
}

const mockOperators: Operator[] = [
  { id: "OP001", name: "Alice Johnson", role: "MCC Operator", status: "Active" },
  { id: "OP002", name: "Bob Williams", role: "Admin", status: "Active" },
  { id: "OP003", name: "Charlie Brown", role: "MCC Operator", status: "Inactive" },
];

// Define columns outside the component for stable reference
const operatorTableColumns = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "role", header: "Role" },
  { accessorKey: "status", header: "Status" },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: (row: Operator) => (
      <Button variant="outline" size="sm" disabled>Edit</Button>
    ),
  },
];

export default function SettingsPage() {
  const [milkPrice, setMilkPrice] = useState(initialMilkPrice.toString());
  const { toast } = useToast();

  const handleSavePrice = () => {
    const price = parseFloat(milkPrice);
    if (isNaN(price) || price <= 0) {
      toast({ title: "Invalid Price", description: "Milk price must be a positive number.", variant: "destructive" });
      return;
    }
    // In a real app, save this to backend
    console.log("New milk price:", price);
    toast({ title: "Price Updated", description: `Milk buying price set to UGX ${price}/liter.` });
  };

  return (
    <>
      <PageHeader
        title="System Settings"
        icon={Settings}
        description="Manage system configurations and users."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5" />Set Milk Buying Price</CardTitle>
            <CardDescription>Define the current price per liter of milk.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="milkPrice">Price per Liter (UGX)</Label>
              <Input
                id="milkPrice"
                type="number"
                value={milkPrice}
                onChange={(e) => setMilkPrice(e.target.value)}
                placeholder="e.g., 1200"
              />
            </div>
            <Button onClick={handleSavePrice}>
              <Save className="mr-2 h-4 w-4" /> Save Price
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Manage MCC Operators & Users</CardTitle>
            <CardDescription>View and manage system users. (Edit/Add functionality coming soon)</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable<Operator>
              columns={operatorTableColumns}
              data={mockOperators}
              searchKey="name"
              actionButtons={
                <Button variant="outline" disabled>Add New User</Button>
              }
            />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>System Summary Reports</CardTitle>
          <CardDescription>High-level overview of system activity. (More details on Dashboard)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between"><span>Total Liters Collected (All Time):</span> <strong className="mt-1 sm:mt-0">150,750 L</strong></div>
            <div className="flex flex-col sm:flex-row sm:justify-between"><span>Total Payments Made (All Time):</span> <strong className="mt-1 sm:mt-0">UGX 180,900,000</strong></div>
            <div className="flex flex-col sm:flex-row sm:justify-between"><span>Active Farmers:</span> <strong className="mt-1 sm:mt-0">125</strong></div>
            <div className="flex flex-col sm:flex-row sm:justify-between"><span>Active MCC Operators:</span> <strong className="mt-1 sm:mt-0">2</strong></div>
        </CardContent>
      </Card>
    </>
  );
}
