'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/components/ui/table';

export const DuelShimmer = () => {
  return (
    <div className="w-full rounded-lg border border-gray-800 bg-black">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-gray-800">
            <TableHead className="text-gray-400 font-medium">Duel</TableHead>
            <TableHead className="text-gray-400 font-medium">Type</TableHead>
            <TableHead className="text-gray-400 font-medium">Status</TableHead>
            <TableHead className="text-gray-400 font-medium">Time Left</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index} className="border-gray-800">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-800 animate-pulse" />
                  <div className="h-4 w-48 bg-gray-800 rounded animate-pulse" />
                </div>
              </TableCell>
              <TableCell>
                <div className="h-4 w-24 bg-gray-800 rounded animate-pulse" />
              </TableCell>
              <TableCell>
                <div className="h-6 w-20 bg-gray-800 rounded-full animate-pulse" />
              </TableCell>
              <TableCell>
                <div className="h-4 w-20 bg-gray-800 rounded animate-pulse" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
