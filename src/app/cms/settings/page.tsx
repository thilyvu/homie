export default function CmsSettingsPage() {
  return (
    <div className="max-w-2xl">
      <p className="text-[11px] font-bold tracking-[2px] text-matcha">HỆ THỐNG</p>
      <h1 className="mt-2 font-serif text-3xl">Cài đặt</h1>
      <p className="mt-3 text-sm leading-relaxed text-cms-muted">
        Content Studio đang dùng tiếng Việt làm ngôn ngữ mặc định. Nội dung món có cặp trường VI/EN. Dữ liệu menu, ảnh tải lên và đặt chỗ được lưu cục bộ trên trình duyệt, không có tài khoản thành viên, giỏ hàng hay sổ quỹ.
      </p>
      <dl className="mt-6 grid gap-3 rounded-xl bg-white p-5 text-sm shadow-[var(--cms-shadow)]">
        <div className="flex justify-between"><dt className="text-cms-muted">Phiên bản</dt><dd>CMS v2.4</dd></div>
        <div className="flex justify-between"><dt className="text-cms-muted">Người dùng</dt><dd>Mai Anh · Quản trị nội dung</dd></div>
        <div className="flex justify-between"><dt className="text-cms-muted">Website</dt><dd>Đang hoạt động</dd></div>
      </dl>
    </div>
  );
}
