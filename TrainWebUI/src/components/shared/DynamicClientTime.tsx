// 🎨 DynamicClientTime component with unified theme system
"use client";

import { useEffect, useState } from "react";
import { Small } from "@/components/ui/typography";
import { Clock } from "lucide-react";

export function DynamicClientTime() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 rounded-full border bg-background px-4 py-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <Small className="text-muted-foreground">Loading...</Small>
      </div>
    );
  }

  const formattedTime = currentTime.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedDate = currentTime.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-center gap-2 rounded-full border bg-background px-4 py-2">
      <Clock className="h-4 w-4 text-primary" />
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
        <Small className="font-medium text-foreground">
          {formattedTime}
        </Small>
        <Small className="hidden sm:block text-muted-foreground">•</Small>
        <Small className="text-muted-foreground">{formattedDate}</Small>
      </div>
    </div>
  );
}
