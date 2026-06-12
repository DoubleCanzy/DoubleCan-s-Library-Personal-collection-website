"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DayPicker } from "react-day-picker";
import { zhCN } from "date-fns/locale";
import "react-day-picker/style.css";

export default function CalendarWidget() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedDate = searchParams.get("date");

  function handleSelect(date: Date | undefined) {
    if (!date) {
      // 清除日期筛选
      const params = new URLSearchParams(searchParams.toString());
      params.delete("date");
      router.push(`/feed?${params.toString()}`);
      return;
    }

    const dateStr = date.toISOString().split("T")[0];
    router.push(`/feed?date=${dateStr}`);
  }

  return (
    <div className="flex justify-center">
      <DayPicker
        mode="single"
        selected={selectedDate ? new Date(selectedDate + "T00:00:00") : undefined}
        onSelect={handleSelect}
        locale={zhCN}
        className="rdp-custom"
        styles={{
          root: { "--rdp-accent-color": "#000000" } as React.CSSProperties,
        }}
      />
    </div>
  );
}
