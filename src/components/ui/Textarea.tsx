import { cn } from "@/lib/utils";

interface TextareaProps {
  label?: string;
  name: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  className?: string;
}

export default function Textarea({
  label,
  name,
  placeholder,
  value,
  defaultValue,
  onChange,
  rows = 4,
  className,
}: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-600">
          {label}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        rows={rows}
        className={cn(
          "border-b-2 border-black bg-transparent px-1 py-2 text-base outline-none transition-colors resize-none",
          "focus:border-gray-400",
          "placeholder:text-gray-400",
          className
        )}
      />
    </div>
  );
}
