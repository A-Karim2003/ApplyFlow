"use client";

import { useTable } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { type ApplicationWithCompany } from "@/lib/data/applications";
import { columns, features } from "./columns";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { type UpdateApplicationProp } from "@/actions/applications";

type ListViewProps = {
  applications: ApplicationWithCompany[];
  onMove: ({ id, newStatus }: UpdateApplicationProp) => void;
};

export default function ListView({ applications, onMove }: ListViewProps) {
  const table = useTable({
    features,
    columns,
    data: applications,
    getRowId: (row) => String(row.application.id),
    state: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    meta: {
      onStatusChange: onMove,
    },
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    key={header.id}
                    className={index === 0 ? "pl-4" : undefined}
                  >
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/50">
                  {row.getAllCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      className={index === 0 ? "pl-4" : undefined}
                    >
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination — only worth showing once there's more than one page */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-end gap-3">
          <span className="text-sm text-muted-foreground">
            Page {table.state.pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft />
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
