"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  href: string;
  label: string;
}

export function PortalNavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <ul className="portal-main-menu">
      {items.map((item) => {
        const isHash = item.href.includes("#");
        const isActive = !isHash && (
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`)
        );

        return (
          <li key={item.href} className={isActive ? "on" : undefined}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        );
      })}
    </ul>
  );
}
