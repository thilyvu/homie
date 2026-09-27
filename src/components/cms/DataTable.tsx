"use client";

import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getId: (row: T) => string;
  selected: string[];
  onToggle: (id: string) => void;
  onToggleAll: (checked: boolean) => void;
  empty: string;
  isLoading?: boolean;
}

export function DataTable<T>({ columns, rows, getId, selected, onToggle, onToggleAll, empty, isLoading }: DataTableProps<T>) {
  if (isLoading) {
    return <p className="bg-warn-bg p-4 text-sm text-matcha">Đang tải danh sách…</p>;
  }
  if (!rows.length) {
    return <p className="border border-dashed border-cms-line p-8 text-center text-sm text-cms-muted">{empty}</p>;
  }
  const allChecked = rows.every((row) => selected.includes(getId(row)));
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[880px] text-left text-xs">
        <thead className="bg-[#fff8ea] text-[11px] tracking-wide text-cms-muted uppercase">
          <tr>
            <th className="px-3 py-3">
              <input type="checkbox" checked={allChecked} onChange={(event) => onToggleAll(event.target.checked)} aria-label="Chọn tất cả" />
            </th>
            {columns.map((column) => (
              <th key={column.key} className={`px-3 py-3 font-medium ${column.className ?? ""}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const id = getId(row);
            return (
              <tr key={id} className="border-t border-cms-line bg-white">
                <td className="px-3 py-3">
                  <input type="checkbox" checked={selected.includes(id)} onChange={() => onToggle(id)} aria-label={`Chọn ${id}`} />
                </td>
                {columns.map((column) => (
                  <td key={column.key} className={`px-3 py-3 text-cms-ink ${column.className ?? ""}`}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
