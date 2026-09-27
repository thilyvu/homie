interface BadgeProps {
  children: string;
  tone?: "matcha" | "error" | "success" | "muted" | "sand";
}

const tones = {
  matcha: "text-matcha",
  error: "text-error",
  success: "bg-success-bg text-success",
  muted: "text-muted",
  sand: "bg-[#fff2d6] text-[#a76612]",
};

export function Badge({ children, tone = "matcha" }: BadgeProps) {
  const isPill = tone === "success" || tone === "sand";
  return (
    <span className={`text-[10px] font-bold tracking-[1px] uppercase ${isPill ? "px-3 py-1.5" : ""} ${tones[tone]}`}>
      {children}
    </span>
  );
}
