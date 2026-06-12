import { cn } from "@/lib/utils";

interface SelectProps {
  label?: string;
  name: string;
  options: { value: string; label: string }[];
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  className?: string;
}

export default function Select({
  label,
  name,
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "请选择...",
  className,
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-600">
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        className={cn(
          "border-b-2 border-black bg-transparent px-1 py-2 text-base outline-none transition-colors",
          "focus:border-gray-400",
          "cursor-pointer",
          className
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
