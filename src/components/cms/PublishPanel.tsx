"use client";

import { ArchiveRestore, CircleCheck, Save, Send } from "lucide-react";
import type { PublishStatus } from "@/types";

interface PublishPanelProps {
  status: PublishStatus;
  publishedAt?: string;
  checks: { label: string; ok: boolean }[];
  onPublish: () => void;
  onDraft: () => void;
  onUnpublish: () => void;
  conflict?: string;
}

const statusLabel: Record<PublishStatus, string> = {
  published: "Đã xuất bản",
  draft: "Bản nháp",
  unpublished: "Đã gỡ",
};

export function PublishPanel({ status, publishedAt, checks, onPublish, onDraft, onUnpublish, conflict }: PublishPanelProps) {
  const done = checks.filter((check) => check.ok).length;
  const percent = Math.round((done / checks.length) * 100);
  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-xl border border-cms-line bg-white p-5 shadow-[var(--cms-shadow)]">
        <h2 className="font-serif text-lg font-semibold text-cms-ink">Trạng thái xuất bản</h2>
        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="text-cms-muted">Hiện tại</span>
          <span className={`rounded-full px-2.5 py-1 text-[11px] ${status === "published" ? "bg-[#e8f3ed] text-[#2f7354]" : status === "draft" ? "bg-[#fff2d6] text-[#a76612]" : "bg-[#f7f1e7] text-cms-muted"}`}>
            {statusLabel[status]}
          </span>
        </div>
        {publishedAt ? <p className="mt-3 text-[11px] text-cms-muted">Xuất bản · {publishedAt}</p> : null}
        <div className="mt-4 flex flex-col gap-2">
          <button type="button" onClick={onPublish} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-matcha-deep px-4 text-[13px] text-white">
            <Send className="size-4" aria-hidden /> {status === "published" ? "Cập nhật xuất bản" : "Xuất bản"}
          </button>
          <button type="button" onClick={onDraft} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-cms-line px-4 text-[13px] text-matcha-deep">
            <Save className="size-4" aria-hidden /> Lưu bản nháp
          </button>
          <button type="button" onClick={onUnpublish} disabled={status !== "published"} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-[13px] text-matcha-deep disabled:opacity-40">
            <ArchiveRestore className="size-4" aria-hidden /> Gỡ xuất bản
          </button>
        </div>
      </section>
      <section className="rounded-xl border border-cms-line bg-white p-5 shadow-[var(--cms-shadow)]">
        <h2 className="font-serif text-lg font-semibold text-cms-ink">Kiểm tra nội dung</h2>
        <div className="mt-3 flex justify-between text-[11px]">
          <span className="text-cms-muted">Hoàn thiện</span>
          <span className="font-bold text-[#2f7354]">{percent}%</span>
        </div>
        <div className="mt-2 h-[5px] rounded-full bg-[#e8f3ed]">
          <div className="h-[5px] rounded-full bg-[#2f7354]" style={{ width: `${percent}%` }} />
        </div>
        <ul className="mt-3 flex flex-col gap-2">
          {checks.map((check) => (
            <li key={check.label} className="flex items-center gap-2 text-[11px] text-cms-ink">
              <CircleCheck className={`size-3.5 ${check.ok ? "text-[#2f7354]" : "text-cms-line"}`} aria-hidden />
              {check.label}
            </li>
          ))}
        </ul>
      </section>
      {conflict ? (
        <p className="border-l-[3px] border-error bg-error-bg p-3 text-xs text-error" role="alert">
          {conflict}
        </p>
      ) : null}
    </div>
  );
}
