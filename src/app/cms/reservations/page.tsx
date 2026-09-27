"use client";

import { useEffect, useState } from "react";
import { AREAS } from "@/data/catalog";
import { formatLongDate, formatPhone } from "@/lib/format";
import { loadReservations } from "@/lib/storage";
import type { Reservation } from "@/types";

export default function CmsReservationsPage() {
  const [rows, setRows] = useState<Reservation[]>([]);
  useEffect(() => setRows(loadReservations()), []);

  return (
    <div>
      <p className="text-[11px] font-bold tracking-[2px] text-matcha">VẬN HÀNH</p>
      <h1 className="mt-2 font-serif text-3xl">Đặt chỗ</h1>
      <p className="mt-1 text-sm text-cms-muted">Danh sách đọc từ dữ liệu đặt chỗ trên trình duyệt. Không có thanh toán hay kho.</p>
      {!rows.length ? <p className="mt-6 text-sm text-cms-muted">Chưa có đặt chỗ.</p> : null}
      <ul className="mt-6 divide-y divide-cms-line rounded-xl bg-white shadow-[var(--cms-shadow)]">
        {rows.map((row) => {
          const area = AREAS.find((entry) => entry.id === row.areaId);
          return (
            <li key={row.code} className="flex flex-col gap-1 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <span>
                <span className="font-medium">{row.code} · {row.name}</span>
                <span className="block text-xs text-cms-muted">{formatLongDate(row.date, "vi")} · {row.time} · {area?.nameVi} {row.seatId} · {formatPhone(row.phone)}</span>
              </span>
              <span className="text-xs uppercase">{row.status === "confirmed" ? "Đã xác nhận" : row.status === "cancelled" ? "Đã hủy" : "Không hủy online"}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
