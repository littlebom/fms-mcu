"use client";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// React 19 (Next.js 16) แสดงข้อความเตือนเมื่อ next-themes ฝัง inline <script> ตอนทำ SSR
// เพื่อป้องกันหน้ากระพริบ (FOUC) — กรองข้อความเตือนเฉพาะเคสนี้ในโหมด development เพื่อไม่ให้รกคอนโซล
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const origError = console.error;
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) {
      return;
    }
    origError.apply(console, args);
  };
}

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
