import Link from "next/link";

export default function LinkStartButton() {
  return (
    <div className="flex justify-center py-12">
      <Link
        href="/feed"
        className="group inline-flex items-center gap-3 bg-black px-10 py-5 text-xl font-semibold text-white transition-all hover:bg-gray-800 hover:scale-105"
      >
        Link Start
        <svg
          className="transition-transform group-hover:translate-x-1"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 12h14M13 5l7 7-7 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  );
}
