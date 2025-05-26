
"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search } from "lucide-react";

interface ColumnDef<T> {
  accessorKey: keyof T | string; // Allow string for custom accessors or actions
  header: string;
  cell?: (row: T) => React.ReactNode; // Custom cell rendering
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  searchKey?: keyof T;
  onExport?: () => void; // For PDF export
  actionButtons?: React.ReactNode; // For global actions like "Add New"
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  searchKey,
  onExport,
  actionButtons,
}: DataTableProps<T>) {
  const [filter, setFilter] = React.useState("");
  const [filteredData, setFilteredData] = React.useState(data);

  React.useEffect(() => {
    if (searchKey && filter) {
      const lowercasedFilter = filter.toLowerCase();
      // Ensure searchKey is a string before calling toLowerCase
      const newFilteredData = data.filter((item) => {
        const value = item[searchKey];
        return typeof value === 'string' && value.toLowerCase().includes(lowercasedFilter);
      });
      setFilteredData(newFilteredData);
    } else {
      setFilteredData(data);
    }
  }, [filter, data, searchKey]);


  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        {searchKey && (
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search by ${String(searchKey)}...`}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
        )}
        <div className="flex gap-2 w-full sm:w-auto">
          {actionButtons}
          {onExport && (
            <Button variant="outline" onClick={onExport}>
              <Download className="mr-2 h-4 w-4" /> Export PDF
            </Button>
          )}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.accessorKey)}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length ? (
              filteredData.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell key={String(column.accessorKey)}>
                      {column.cell
                        ? column.cell(row)
                        : String(getNestedValue(row, String(column.accessorKey)) ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* TODO: Add pagination if needed */}
    </div>
  );
}
