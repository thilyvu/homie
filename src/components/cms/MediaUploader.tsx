"use client";

import { ImagePlus } from "lucide-react";
import { useState } from "react";

interface MediaUploaderProps {
  preview?: string;
  alt: string;
  onAlt: (value: string) => void;
  onFile: (src: string, name: string) => void;
}

export function MediaUploader({ preview, alt, onAlt, onFile }: MediaUploaderProps) {
  const [name, setName] = useState("usucha-homies-hero.jpg");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="h-[156px] w-full overflow-hidden rounded-xl bg-cms-bg sm:w-[210px]">
          {preview ? <img src={preview} alt={alt || "Ảnh món"} className="h-full w-full object-cover" /> : null}
        </div>
        <div className="flex flex-1 flex-col gap-2.5">
          <p className="text-xs text-cms-ink">Ảnh đại diện</p>
          <p className="text-[11px] text-cms-muted">{name} · xem trước từ tệp đã chọn</p>
          <label className="inline-flex h-10 w-fit cursor-pointer items-center gap-2 rounded-lg border border-cms-line bg-white px-4 text-[13px] text-matcha-deep">
            <ImagePlus className="size-4" aria-hidden />
            Thay ảnh
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                setName(file.name);
                const reader = new FileReader();
                reader.onload = () => {
                  if (typeof reader.result === "string") onFile(reader.result, file.name);
                };
                reader.readAsDataURL(file);
              }}
            />
          </label>
        </div>
      </div>
      <label className="flex flex-col gap-[7px] text-xs text-cms-ink">
        Alt text ảnh đại diện
        <input value={alt} onChange={(event) => onAlt(event.target.value)} className="h-[42px] rounded-lg border border-cms-line px-3 text-[13px]" />
        <span className="text-[11px] text-cms-muted">Mô tả ngắn gọn nội dung ảnh cho người dùng trình đọc màn hình.</span>
      </label>
    </div>
  );
}
