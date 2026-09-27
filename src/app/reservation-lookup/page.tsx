"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { AREAS } from "@/data/catalog";
import { useLocale } from "@/context/ui";
import { digitsOnly, formatLongDate, formatPhone, isValidPhone } from "@/lib/format";
import { loadReservations, saveReservations } from "@/lib/storage";
import type { Reservation } from "@/types";

const schema = z.object({
  code: z.string().trim().min(1, "Vui lòng nhập mã đặt chỗ"),
  phone: z.string().refine((value) => isValidPhone(value), "Số điện thoại cần 10 số và bắt đầu bằng 0"),
});

type LookupForm = z.infer<typeof schema>;
type View = "form" | "loading" | "found" | "empty" | "cancelled" | "locked";

function LookupBody() {
  const params = useSearchParams();
  const { locale } = useLocale();
  const vi = locale === "vi";
  const [view, setView] = useState<View>("form");
  const [match, setMatch] = useState<Reservation | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const form = useForm<LookupForm>({
    resolver: zodResolver(schema),
    defaultValues: { code: params.get("code") ?? "", phone: "" },
  });

  const search = form.handleSubmit((values) => {
    setView("loading");
    window.setTimeout(() => {
      const found = loadReservations().find(
        (item) => item.code.toLowerCase() === values.code.trim().toLowerCase() && digitsOnly(item.phone) === digitsOnly(values.phone),
      );
      if (!found) {
        setMatch(null);
        setView("empty");
        return;
      }
      setMatch(found);
      if (found.status === "cancelled") setView("cancelled");
      else if (found.status === "locked") setView("locked");
      else setView("found");
    }, 450);
  });

  const cancel = () => {
    if (!match) return;
    const next = loadReservations().map((item) => (item.code === match.code ? { ...item, status: "cancelled" as const } : item));
    saveReservations(next);
    setMatch({ ...match, status: "cancelled" });
    setView("cancelled");
    setConfirmOpen(false);
  };

  const area = AREAS.find((entry) => entry.id === match?.areaId);

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-5 py-16 lg:px-[190px] lg:py-20">
      <p className="text-[11px] font-bold tracking-[2px] text-matcha uppercase">{vi ? "TRA CỨU ĐẶT CHỖ" : "FIND A BOOKING"}</p>
      <h1 className="mt-3 text-center font-serif text-4xl lg:text-[46px]">{vi ? "Thông tin chuyến ghé Homies." : "Your visit to Homies."}</h1>
      <p className="mt-3 max-w-[640px] text-center text-sm text-muted">
        {vi ? "Nhập mã đặt chỗ và số điện thoại đã sử dụng để xem hoặc hủy đặt chỗ." : "Enter the booking code and phone number to view or cancel."}
      </p>
      <form onSubmit={search} className="mt-8 flex w-full max-w-[820px] flex-col gap-3 lg:flex-row lg:items-end" noValidate>
        <Input id="lookup-code" label={vi ? "Mã đặt chỗ" : "Booking code"} {...form.register("code")} error={form.formState.errors.code?.message} />
        <Input id="lookup-phone" label={vi ? "Số điện thoại" : "Phone"} inputMode="tel" {...form.register("phone")} error={form.formState.errors.phone?.message} />
        <Button type="submit" className="lg:w-[130px]" isLoading={view === "loading"}>
          {vi ? "Tra cứu" : "Search"}
        </Button>
      </form>

      {view === "empty" ? (
        <div className="mt-8 w-full max-w-[820px] bg-warn-bg p-4" role="status">
          <p className="text-[13px] font-bold text-matcha">{vi ? "Không tìm thấy đặt chỗ" : "No reservation found"}</p>
          <p className="mt-1 text-xs text-muted">{vi ? "Kiểm tra lại mã và số điện thoại, hoặc gọi 0919 768 409 để được hỗ trợ." : "Check the code and phone number, or call 0919 768 409."}</p>
        </div>
      ) : null}

      {view === "cancelled" && match ? (
        <div className="mt-8 flex w-full max-w-[820px] flex-col gap-4">
          <div className="bg-success-bg p-4" role="status">
            <p className="text-[13px] font-bold text-success">{vi ? `Đã hủy đặt chỗ ${match.code}` : `Reservation ${match.code} was cancelled`}</p>
            <p className="mt-1 text-xs text-muted">{vi ? "Tin nhắn xác nhận đã được gửi đến số điện thoại của bạn." : "A confirmation message was sent to your phone."}</p>
          </div>
          <a href="/booking" className="inline-flex h-12 items-center justify-center rounded-[3px] bg-matcha-deep text-sm font-semibold text-white">
            {vi ? "Đặt chỗ mới" : "Make a new reservation"}
          </a>
        </div>
      ) : null}

      {view === "locked" && match ? (
        <div className="mt-8 flex w-full max-w-[820px] flex-col gap-4">
          <div className="bg-error-bg p-4" role="alert">
            <p className="text-[13px] font-bold text-error">{vi ? "Đặt chỗ này không thể hủy online" : "This reservation cannot be cancelled online"}</p>
            <p className="mt-1 text-xs text-error">{vi ? "Lượt đặt còn dưới 2 giờ. Vui lòng gọi 0919 768 409 để Homies hỗ trợ." : "Less than 2 hours remain. Please call 0919 768 409."}</p>
          </div>
          <a href="tel:0901234567" className="inline-flex h-12 items-center justify-center rounded-[3px] border border-matcha text-sm font-semibold text-matcha-deep">
            {vi ? "Gọi cho Homies" : "Call Homies"}
          </a>
        </div>
      ) : null}

      {view === "found" && match && area ? (
        <article className="mt-8 w-full max-w-[820px] border border-line bg-white p-6">
          <p className="text-[11px] font-bold tracking-[1.5px] text-muted">{vi ? "MÃ ĐẶT CHỖ" : "BOOKING CODE"}</p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="font-serif text-[25px]">{match.code}</p>
            <Badge tone="success">{vi ? "Đã xác nhận" : "Confirmed"}</Badge>
          </div>
          <dl className="mt-5 grid gap-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-muted">{vi ? "Ngày & giờ" : "Date & time"}</dt><dd className="text-right font-semibold">{formatLongDate(match.date, locale)} · {match.time}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">{vi ? "Số khách" : "Guests"}</dt><dd className="font-semibold">{match.guests}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">{vi ? "Khu vực / ghế" : "Area / seat"}</dt><dd className="font-semibold">{vi ? area.nameVi : area.nameEn} · {match.seatId}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">{vi ? "Khách đặt" : "Guest"}</dt><dd className="text-right font-semibold">{match.name} · {formatPhone(match.phone)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">{vi ? "Địa chỉ" : "Address"}</dt><dd className="text-right font-semibold">{vi ? "Tầng 1, 83 Hùng Vương, phường Buôn Ma Thuột, Đắk Lắk" : "Floor 1, 83 Hung Vuong, Buon Ma Thuot ward, Dak Lak"}</dd></div>
          </dl>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a className="inline-flex h-12 flex-1 items-center justify-center rounded-[3px] border border-matcha text-sm font-semibold text-matcha-deep" href="https://maps.google.com/?q=83+Hung+Vuong+Buon+Ma+Thuot" target="_blank" rel="noreferrer">
              {vi ? "Chỉ đường" : "Directions"}
            </a>
            <Button variant="danger" fullWidth className="sm:flex-1" onClick={() => setConfirmOpen(true)}>
              {vi ? "Hủy đặt chỗ" : "Cancel reservation"}
            </Button>
          </div>
          <p className="mt-4 text-[11px] text-muted">{vi ? "Hủy online là đề xuất. Homies xác nhận lại qua điện thoại nếu cần." : "Online cancellation is a request. Homies may confirm by phone."}</p>
        </article>
      ) : null}

      <Modal open={confirmOpen} title={vi ? "Hủy đặt chỗ?" : "Cancel this reservation?"} onClose={() => setConfirmOpen(false)}>
        <p className="text-sm text-muted">{vi ? "Thao tác này không thể hoàn tác." : "This cannot be undone."}</p>
        <div className="mt-5 flex gap-2">
          <Button variant="outline" fullWidth onClick={() => setConfirmOpen(false)}>
            {vi ? "Giữ đặt chỗ" : "Keep it"}
          </Button>
          <Button variant="danger" fullWidth onClick={cancel}>
            {vi ? "Xác nhận hủy" : "Confirm cancel"}
          </Button>
        </div>
      </Modal>
    </main>
  );
}

export default function LookupPage() {
  return (
    <>
      <SiteHeader />
      <Suspense fallback={<main className="px-5 py-16 text-center">Đang tải…</main>}>
        <LookupBody />
      </Suspense>
      <SiteFooter />
    </>
  );
}
