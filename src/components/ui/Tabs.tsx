interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  variant?: "underline" | "chip";
  label: string;
}

export function Tabs({ items, value, onChange, variant = "underline", label }: TabsProps) {
  return (
    <div role="tablist" aria-label={label} className={variant === "chip" ? "flex flex-wrap gap-2.5" : "flex flex-wrap"}>
      {items.map((item) => {
        const isActive = item.id === value;
        if (variant === "chip") {
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(item.id)}
              className={`px-3.5 py-2 text-xs font-semibold ${isActive ? "bg-matcha text-white" : "border border-line bg-transparent text-ink hover:border-matcha"}`}
            >
              {item.label}
            </button>
          );
        }
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.id)}
            className={`border-b px-4 py-2.5 text-[13px] ${isActive ? "border-b-2 border-matcha font-bold text-matcha" : "border-line font-medium text-muted"}`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
