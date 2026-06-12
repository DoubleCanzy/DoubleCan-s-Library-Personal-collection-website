import { cn } from "@/lib/utils";

interface TagBadgeProps {
  name: string;
  onRemove?: () => void;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}

export default function TagBadge({
  name,
  onRemove,
  onClick,
  active = false,
  className,
}: TagBadgeProps) {
  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 px-3 py-1 text-sm transition-colors",
        active
          ? "bg-black text-white"
          : "bg-gray-100 text-black hover:bg-gray-200",
        onClick && "cursor-pointer",
        className
      )}
    >
      {name}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 hover:text-red-500 transition-colors"
          aria-label={`移除标签 ${name}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
