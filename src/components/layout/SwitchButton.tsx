import Link from "next/link";

interface SwitchButtonProps {
  target: string;
  label: string;
}

export default function SwitchButton({ target, label }: SwitchButtonProps) {
  return (
    <Link
      href={target}
      className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg hover:bg-gray-800 hover:scale-105 transition-all"
      title={label}
      aria-label={label}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 4h4v4H4V4zm8 0h4v4h-4V4zm-8 8h4v4H4v-4zm8 4v-4h4v4h-4z"
          fill="currentColor"
        />
      </svg>
    </Link>
  );
}
