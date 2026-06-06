import * as React from "react";import { cn } from "@/lib/utils";
export const Table=({className,...p}:React.HTMLAttributes<HTMLTableElement>)=><div className="w-full overflow-auto"><table className={cn("w-full caption-bottom text-sm",className)} {...p}/></div>;
export const TableHeader=({className,...p}:React.HTMLAttributes<HTMLTableSectionElement>)=><thead className={cn("[&_tr]:border-b",className)} {...p}/>;
export const TableBody=({className,...p}:React.HTMLAttributes<HTMLTableSectionElement>)=><tbody className={cn("[&_tr:last-child]:border-0",className)} {...p}/>;
export const TableRow=({className,...p}:React.HTMLAttributes<HTMLTableRowElement>)=><tr className={cn("border-b transition-colors hover:bg-muted/50",className)} {...p}/>;
export const TableHead=({className,...p}:React.ThHTMLAttributes<HTMLTableCellElement>)=><th className={cn("h-12 px-4 text-left align-middle font-medium text-muted-foreground",className)} {...p}/>;
export const TableCell=({className,...p}:React.TdHTMLAttributes<HTMLTableCellElement>)=><td className={cn("p-4 align-middle",className)} {...p}/>;
