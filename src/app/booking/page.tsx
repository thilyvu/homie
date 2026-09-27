"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarCheck, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { DatePicker } from "@/components/booking/DatePicker";
import { SeatSelector } from "@/components/booking/SeatSelector";
import { StepIndicator } from "@/components/booking/StepIndicator";
import { TimeSlot } from "@/components/booking/TimeSlot";
import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/Input";
import { AREAS, SEED_SEATS } from "@/data/catalog";
import { useLocale } from "@/context/ui";
import { formatPhone, isValidPhone } from "@/lib/format";
import { loadReservations, saveReservations } from "@/lib/storage";
import type { BookingDraft } from "@/types";

const DRAFT_KEY = "homies-booking-draft";

const emptyDraft: BookingDraft = {
  date: "2026-10-10",
  guests: 2,
  time: "10:30",
  areaId: "bar",
  seatId: "B2",
  name: "Nguyễn Minh An",
  phone: "090 123 4567",
  note: "Ưu tiên chỗ ít nắng.",
  agreed: true,
};

const guestSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập họ và tên"),
  phone: z.string().refine((value) => isValidPhone(value), "Số điện thoại cần 10 số và bắt đầu bằng 0"),
  note: z.string(),
});

type GuestForm = z.infer<typeof guestSchema>;

function holdLabel(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${`${minutes}`.padStart(2, "0")}:${`${rest}`.padStart(2, "0")}`;
}

export default function BookingPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const vi = locale === "vi";
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<BookingDraft>(emptyDraft);
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(10);
  const [hold, setHold] = useState(8 * 60 + 42);
  const [notice, setNotice] = useState<{ title: string; body: string }>();
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [rulesError, setRulesError] = useState("");

  const form = useForm<GuestForm>({
    resolver: zodResolver(guestSchema),
    defaultValues: { name: emptyDraft.name, phone: emptyDraft.phone, note: emptyDraft.note },
  });

  useEffect(() => {
    const timer = window.setInterval(() => setHold((value) => (value > 0 ? value - 1 : 0)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (step !== 2) return;
    setSlotsLoading(true);
    const timer = window.setTimeout(() => setSlotsLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, [step]);

  const area = AREAS.find((entry) => entry.id === draft.areaId);
  const titles = useMemo(
    () =>
      vi
        ? ["Chọn ngày và số khách", "Chọn khung giờ", "Chọn khu vực và ghế", "Thông tin liên hệ", "Kiểm tra", "Xác nhận"]
        : ["Choose a date and party size", "Choose a time", "Choose an area and seat", "Your details", "Review", "Confirm"],
    [vi],
  );

  const goNext = () => setStep((value) => Math.min(6, value + 1));

  const submitGuests = form.handleSubmit((values) => {
    setDraft((current) => ({ ...current, ...values, phone: formatPhone(values.phone) }));
    goNext();
  });

  const continueStep = () => {
    if (step === 4) {
      void submitGuests();
      return;
    }
    if (step === 5 && !draft.agreed) {
      setRulesError(vi ? "Vui lòng đồng ý với nội quy đặt chỗ." : "Please agree to the reservation rules.");
      return;
    }
    goNext();
  };

  const confirmBooking = () => {
    setConfirming(true);
    const reservations = loadReservations();
    let code = "";
    do {
      code = `TK-${Math.floor(1000 + Math.random() * 9000)}`;
    } while (reservations.some((item) => item.code === code));
    saveReservations([
      {
        code,
        name: draft.name,
        phone: draft.phone.replace(/\D/g, ""),
        date: draft.date,
        time: draft.time,
        guests: draft.guests,
        areaId: draft.areaId,
        seatId: draft.seatId,
        note: draft.note,
        status: "confirmed",
      },
      ...reservations,
    ]);
    window.sessionStorage.setItem(DRAFT_KEY, code);
    router.push(`/booking/success?code=${code}`);
  };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1440px] px-5 py-12 lg:px-16 lg:py-16">
        <p className="text-[11px] font-bold tracking-[2px] text-matcha uppercase">{vi ? "ĐẶT CHỖ" : "RESERVE"}</p>
        <h1 className="mt-3 font-serif text-4xl font-normal text-ink lg:text-[44px]">{titles[step - 1]}</h1>
        <div className="mt-8">
          <StepIndicator current={step} locale={locale} />
        </div>
        <div className="mt-8 flex flex-col gap-9 lg:flex-row lg:items-start">
          <section className="motion-static flex-1 border border-line bg-white p-5 sm:p-8">
            <div key={step} className="motion-swap">
            {step === 1 ? (
              <div className="flex flex-col gap-8">
                <DatePicker
                  year={year}
                  month={month}
                  selected={draft.date}
                  locale={locale}
                  onSelect={(date) => setDraft((current) => ({ ...current, date }))}
                  onMonth={(nextYear, nextMonth) => {
                    setYear(nextYear);
                    setMonth(nextMonth);
                  }}
                />
                <div>
                  <p className="text-xs font-semibold">{vi ? "Số khách" : "Guests"}</p>
                  <div className="mt-3 flex items-center gap-4">
                    <button type="button" aria-label={vi ? "Giảm số khách" : "Fewer guests"} className="flex size-10 items-center justify-center rounded-full border border-line" onClick={() => setDraft((current) => ({ ...current, guests: Math.max(1, current.guests - 1) }))}>
                      <Minus className="size-4" />
                    </button>
                    <span className="font-serif text-[22px]">{draft.guests}</span>
                    <button type="button" aria-label={vi ? "Tăng số khách" : "More guests"} className="flex size-10 items-center justify-center rounded-full border border-line" onClick={() => setDraft((current) => ({ ...current, guests: Math.min(6, current.guests + 1) }))}>
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <p className="mt-2 text-[11px] text-muted">{vi ? "Tối đa 6 khách / lượt đặt" : "Up to 6 guests per booking"}</p>
                </div>
              </div>
            ) : null}
            {step === 2 ? <TimeSlot value={draft.time} locale={locale} isLoading={slotsLoading} onChange={(time) => setDraft((current) => ({ ...current, time }))} /> : null}
            {step === 3 ? (
              <SeatSelector
                areaId={draft.areaId}
                seatId={draft.seatId}
                seats={SEED_SEATS}
                locale={locale}
                notice={notice}
                onArea={(areaId) => {
                  const nextSeat = SEED_SEATS.find((seat) => seat.areaId === areaId && seat.state === "available");
                  setDraft((current) => ({ ...current, areaId, seatId: nextSeat?.id ?? "" }));
                  setNotice(undefined);
                }}
                onSeat={(seatId) => {
                  const seat = SEED_SEATS.find((entry) => entry.id === seatId);
                  if (seat?.state === "unavailable") {
                    setNotice({
                      title: vi ? `Ghế ${seatId} vừa được người khác đặt` : `Seat ${seatId} was just taken`,
                      body: vi ? `Sơ đồ đã được cập nhật. Ghế ${draft.seatId} vẫn đang được giữ cho bạn.` : `The map was updated. Seat ${draft.seatId} is still held for you.`,
                    });
                    return;
                  }
                  setNotice(undefined);
                  setDraft((current) => ({ ...current, seatId }));
                }}
              />
            ) : null}
            {step === 4 ? (
              <form className="flex flex-col gap-4" onSubmit={submitGuests} noValidate>
                <Input id="guest-name" label={vi ? "Họ và tên *" : "Full name *"} {...form.register("name")} error={form.formState.errors.name?.message} />
                <Input id="guest-phone" label={vi ? "Số điện thoại *" : "Phone *"} inputMode="tel" {...form.register("phone")} error={form.formState.errors.phone?.message} hint={vi ? "Chúng tôi chỉ dùng số điện thoại để xác nhận hoặc liên hệ về lượt đặt này." : "We only use this number to confirm or contact you about this booking."} />
                <TextArea id="guest-note" label={vi ? "Ghi chú (tùy chọn)" : "Note (optional)"} {...form.register("note")} />
              </form>
            ) : null}
            {step === 5 ? (
              <div className="flex flex-col gap-5">
                <BookingSummary date={draft.date} time={draft.time} guests={draft.guests} areaId={draft.areaId} seatId={draft.seatId} locale={locale} hold={holdLabel(hold)} compact />
                <dl className="grid gap-3 text-sm">
                  <div className="flex justify-between gap-4"><dt className="text-muted">{vi ? "Họ tên" : "Name"}</dt><dd className="font-semibold">{draft.name}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-muted">{vi ? "Điện thoại" : "Phone"}</dt><dd className="font-semibold">{draft.phone}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-muted">{vi ? "Ghi chú" : "Note"}</dt><dd className="text-right font-semibold">{draft.note || "—"}</dd></div>
                </dl>
                <Checkbox
                  id="rules"
                  checked={draft.agreed}
                  onChange={(agreed) => {
                    setDraft((current) => ({ ...current, agreed }));
                    setRulesError("");
                  }}
                  label={vi ? "Tôi đã đọc và đồng ý với nội quy đặt chỗ." : "I have read and agree to the reservation rules."}
                />
                {rulesError ? <p className="text-[11px] text-error">{rulesError}</p> : null}
                <div className="bg-cream p-4 text-xs leading-relaxed text-muted">
                  <p className="font-semibold text-ink">{vi ? "Nội quy chính" : "House rules"}</p>
                  <ul className="mt-2 list-disc pl-4">
                    <li>{vi ? "Giữ bàn tối đa 15 phút sau giờ hẹn." : "Tables are held for 15 minutes after the booked time."}</li>
                    <li>{vi ? "Vui lòng báo trước khi thay đổi số khách." : "Please tell us before changing the party size."}</li>
                    <li>{vi ? "Khu yên tĩnh hạn chế cuộc gọi và thiết bị phát âm thanh." : "The quiet zone limits calls and speakers."}</li>
                  </ul>
                </div>
              </div>
            ) : null}
            {step === 6 ? (
              <div className="flex flex-col items-start gap-4">
                <span className="flex size-14 items-center justify-center rounded-full bg-warn-bg text-matcha">
                  <CalendarCheck aria-hidden />
                </span>
                <h2 className="font-serif text-3xl">{vi ? "Sẵn sàng xác nhận?" : "Ready to confirm?"}</h2>
                <p className="text-sm text-muted">{vi ? "Homies sẽ gửi mã đặt chỗ qua SMS sau khi bạn xác nhận." : "Homies will send a booking code by SMS after you confirm."}</p>
                <BookingSummary date={draft.date} time={draft.time} guests={draft.guests} areaId={draft.areaId} seatId={draft.seatId} locale={locale} hold={holdLabel(hold)} compact />
              </div>
            ) : null}
            </div>
            <p className="mt-6 border-l-[3px] border-sand bg-note p-3 text-xs text-muted">
              {vi
                ? "Chọn ghế là đề xuất cần xác nhận. Quán mở 06:45–18:00, nhận mang đi."
                : "Seat choice needs confirmation. The shop is open 06:45–18:00 for take-away."}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <Button variant="ghost" withArrow disabled={step === 1} onClick={() => setStep((value) => Math.max(1, value - 1))}>
                {vi ? "Quay lại" : "Back"}
              </Button>
              {step < 6 ? (
                <Button withArrow onClick={continueStep}>
                  {vi ? "Tiếp tục" : "Continue"}
                </Button>
              ) : (
                <Button withArrow isLoading={confirming} onClick={confirmBooking}>
                  {vi ? "Xác nhận đặt chỗ" : "Confirm reservation"}
                </Button>
              )}
            </div>
          </section>
          <div className="w-full lg:w-[360px]">
            <BookingSummary date={draft.date} time={draft.time} guests={draft.guests} areaId={draft.areaId} seatId={draft.seatId} locale={locale} hold={holdLabel(hold)} />
            <p className="sr-only">{area?.nameVi}</p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
