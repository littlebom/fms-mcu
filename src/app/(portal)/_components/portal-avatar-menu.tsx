"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { LayoutDashboard, User, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PortalAvatarMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  adminConsoleLabel: string;
  profileLabel: string;
  signOutLabel: string;
  signInLabel: string;
}

export function PortalAvatarMenu({
  user,
  adminConsoleLabel,
  profileLabel,
  signOutLabel,
  signInLabel,
}: PortalAvatarMenuProps) {
  if (!user) {
    return (
      <Link href="/dashboard" className="hidden sm:inline-flex">
        <Button
          size="sm"
          variant="outline"
          className="items-center gap-1.5 text-xs h-9 rounded-[var(--r-ctl)] border-[var(--glass-border)] bg-[var(--glass)] hover:bg-[var(--glass-strong)] text-[var(--text)] transition-all"
        >
          <LogIn className="h-3.5 w-3.5" />
          <span>{adminConsoleLabel || signInLabel}</span>
        </Button>
      </Link>
    );
  }

  const initials = (user.name ?? "?").trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="acct">
      <DropdownMenuPrimitive.Root>
        <DropdownMenuPrimitive.Trigger asChild>
          <button type="button" aria-label={`Account menu for ${user.name ?? "User"}`}>
            <span className="who" aria-hidden="true">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt=""
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </span>
            <span className="nm max-w-[120px] truncate">{user.name}</span>
            <svg className="chev" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </DropdownMenuPrimitive.Trigger>

        <DropdownMenuPrimitive.Portal>
          <DropdownMenuPrimitive.Content
            className="menu-list"
            align="end"
            sideOffset={8}
            style={{ position: "static" }}
          >
            <DropdownMenuPrimitive.Label asChild>
              <div className="px-2.5 py-2">
                <p className="text-sm font-semibold text-[var(--text)]">{user.name}</p>
                {user.email && (
                  <p className="text-xs text-[var(--text-muted)] truncate">{user.email}</p>
                )}
              </div>
            </DropdownMenuPrimitive.Label>

            <DropdownMenuPrimitive.Separator asChild>
              <hr />
            </DropdownMenuPrimitive.Separator>

            <DropdownMenuPrimitive.Item asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="h-4 w-4" />
                <span>{adminConsoleLabel}</span>
              </Link>
            </DropdownMenuPrimitive.Item>

            <DropdownMenuPrimitive.Item asChild>
              <Link href="/me">
                <User className="h-4 w-4" />
                <span>{profileLabel}</span>
              </Link>
            </DropdownMenuPrimitive.Item>

            <DropdownMenuPrimitive.Separator asChild>
              <hr />
            </DropdownMenuPrimitive.Separator>

            <DropdownMenuPrimitive.Item asChild onSelect={() => signOut({ callbackUrl: "/" })}>
              <button type="button" className="danger">
                <LogOut className="h-4 w-4" />
                <span>{signOutLabel}</span>
              </button>
            </DropdownMenuPrimitive.Item>
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
      </DropdownMenuPrimitive.Root>
    </div>
  );
}
