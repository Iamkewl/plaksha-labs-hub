"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDateShort } from "@/lib/utils";
import { PLACEHOLDER_ASSETS_ADMIN } from "@/lib/placeholder/admin";
import { Zap } from "lucide-react";

type Lab = "All" | "Electronics Lab" | "Robotics Lab" | "Woodworking Shop" | "3D Printing Lab";
type Kind = "All" | "Machine" | "Tool" | "Equipment";
type AssetStatus = "All" | "available" | "in-use" | "maintenance" | "retired";

const LAB_OPTIONS: Lab[] = ["All", "Electronics Lab", "Robotics Lab", "Woodworking Shop", "3D Printing Lab"];
const KIND_OPTIONS: Kind[] = ["All", "Machine", "Tool", "Equipment"];
const STATUS_OPTIONS: AssetStatus[] = ["All", "available", "in-use", "maintenance", "retired"];

export default function AssetsPage() {
  const assets = PLACEHOLDER_ASSETS_ADMIN;
  const [selectedLab, setSelectedLab] = useState<Lab>("All");
  const [selectedKind, setSelectedKind] = useState<Kind>("All");
  const [selectedStatus, setSelectedStatus] = useState<AssetStatus>("All");

  const filteredAssets = assets.filter((asset) => {
    const labMatch = selectedLab === "All" || asset.lab === selectedLab;
    const kindMatch = selectedKind === "All" || asset.kind === selectedKind;
    const statusMatch = selectedStatus === "All" || asset.status === selectedStatus;
    return labMatch && kindMatch && statusMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Assets Management</h1>
        <p className="text-muted-foreground">
          View all machines, tools, and equipment across labs.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            {/* Lab Filter */}
            <div className="flex gap-2 flex-wrap">
              {LAB_OPTIONS.map((lab) => (
                <Button
                  key={lab}
                  size="sm"
                  variant={selectedLab === lab ? "default" : "outline"}
                  onClick={() => setSelectedLab(lab)}
                  className="text-xs"
                >
                  {lab}
                </Button>
              ))}
            </div>
            <div className="h-6 w-px bg-border" />
            {/* Kind Filter */}
            <div className="flex gap-2 flex-wrap">
              {KIND_OPTIONS.map((kind) => (
                <Button
                  key={kind}
                  size="sm"
                  variant={selectedKind === kind ? "default" : "outline"}
                  onClick={() => setSelectedKind(kind)}
                  className="text-xs"
                >
                  {kind}
                </Button>
              ))}
            </div>
            <div className="h-6 w-px bg-border" />
            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              {STATUS_OPTIONS.map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant={selectedStatus === status ? "default" : "outline"}
                  onClick={() => setSelectedStatus(status)}
                  className="text-xs"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assets ({filteredAssets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAssets.length === 0 ? (
            <div className="py-8 text-center">
              <Zap className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                No assets match your filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Lab</TableHead>
                    <TableHead>Division</TableHead>
                    <TableHead>Kind</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium">
                        {asset.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {asset.lab}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {asset.division}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {asset.kind}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={asset.status} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDateShort(asset.lastActivity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
