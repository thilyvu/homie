import type { Locale } from "@/types";

export const copy = {
  vi: {
    nav: {
      home: "Trang chủ",
      menu: "Menu",
      story: "Câu chuyện",
      space: "Không gian",
      lookup: "Tra cứu đặt chỗ",
      book: "Đặt chỗ",
      lang: "VN · EN",
    },
    footer: {
      visit: "GHÉ HOMIES",
      address: "Tầng 1, 83 Hùng Vương, phường Buôn Ma Thuột, Đắk Lắk",
      hours: "06:45–18:00 mỗi ngày",
      contact: "LIÊN HỆ",
      follow: "ĐẶT MÓN",
      info: "THÔNG TIN",
      rules: "Nội quy · Chính sách bảo mật",
      copyright: "© 2026 Homies Coffee · Giá chép từ menu fanpage, cần xác nhận trước khi bán.",
    },
    rulesTitle: "Nội quy đặt chỗ",
    rulesBody: "Giữ bàn 15 phút. Vui lòng báo trước khi thay đổi số khách. Khu yên tĩnh hạn chế cuộc gọi.",
    rulesRead: "Tôi đã đọc",
    privacyTitle: "Chính sách bảo mật",
    privacyBody: "Chúng tôi chỉ dùng số điện thoại để xác nhận hoặc liên hệ về lượt đặt này. Không chia sẻ dữ liệu cho bên thứ ba.",
    close: "Đóng",
  },
  en: {
    nav: {
      home: "Home",
      menu: "Menu",
      story: "Story",
      space: "Space",
      lookup: "Find a booking",
      book: "Reserve",
      lang: "VN · EN",
    },
    footer: {
      visit: "VISIT",
      address: "Floor 1, 83 Hung Vuong, Buon Ma Thuot ward, Dak Lak",
      hours: "06:45–18:00 daily",
      contact: "CONTACT",
      follow: "ORDER",
      info: "INFO",
      rules: "House rules · Privacy",
      copyright: "© 2026 Homies Coffee · Prices are copied from the fanpage menu and should be confirmed before sale.",
    },
    rulesTitle: "Reservation rules",
    rulesBody: "Tables are held for 15 minutes. Please tell us before changing the party size. The quiet zone limits phone calls.",
    rulesRead: "I have read this",
    privacyTitle: "Privacy",
    privacyBody: "We only use your phone number to confirm or contact you about this reservation. We do not share it.",
    close: "Close",
  },
} as const;

export function t(locale: Locale) {
  return copy[locale];
}
