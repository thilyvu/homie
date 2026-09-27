"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import { useLocale } from "@/context/ui";
import { loadReservations } from "@/lib/storage";
import type { Reservation } from "@/types";

function SuccessBody() {
  const params = useSearchParams();
  const { locale } = useLocale();
  const vi = locale === "vi";
  const code = params.get("code") ?? "TK-1048";
  const [reservation, setReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    setReservation(loadReservations().find((item) => item.code === code) ?? null);
  }, [code]);

  return (
    <main className="mx-auto flex w-full max-w-[760px] flex-col items-center px-5 py-16 text-center lg:py-24">
      <p className="text-[11px] font-bold tracking-[2px] text-matcha uppercase">{vi ? "ĐẶT CHỖ" : "RESERVE"}</p>
      <h1 className="mt-3 font-serif text-4xl lg:text-[44px]">{vi ? "Đặt chỗ đã được xác nhận" : "Your reservation is confirmed"}</h1>
      <section className="mt-8 w-full border border-line bg-white p-8 text-left">
        <div className="flex flex-col items-center text-center">
          <span className="flex size-[72px] items-center justify-center rounded-full bg-success-bg text-success">
            <Check className="size-8" aria-hidden />
          </span>
          <h2 className="mt-4 font-serif text-2xl">{vi ? "Hẹn gặp bạn tại Homies." : "See you at Homies."}</h2>
          <p className="mt-3 text-[11px] font-bold tracking-[2px] text-muted">{vi ? "MÃ ĐẶT CHỖ" : "BOOKING CODE"}</p>
          <p className="font-serif text-[25px]">{code}</p>
        </div>
        {reservation ? (
          <div className="mt-6">
            <BookingSummary
              compact
              locale={locale}
              date={reservation.date}
              time={reservation.time}
              guests={reservation.guests}
              areaId={reservation.areaId}
              seatId={reservation.seatId}
              hold="—"
            />
          </div>
        ) : null}
        <p className="mt-4 text-sm text-muted">Tầng 1, 83 Hùng Vương, phường Buôn Ma Thuột, Đắk Lắk</p>
        <Link href={`/reservation-lookup?code=${code}`} className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-[3px] bg-matcha-deep text-sm font-semibold text-white">
          {vi ? "Xem đặt chỗ" : "View reservation"}
        </Link>
      </section>
    </main>
  );
}

export default function BookingSuccessPage() {
  return (
    <>
      <SiteHeader />
      <Suspense fallback={<main className="px-5 py-16 text-center text-sm text-muted">Đang tải xác nhận…</main>}>
        <SuccessBody />
      </Suspense>
      <SiteFooter />
    </>
  );
}
