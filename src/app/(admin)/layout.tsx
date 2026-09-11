import { resolveTenantSettings } from "@/features/identity/server";
import { AdminLayoutClient } from "./_components/admin-layout-client";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let logoUrl: string | null = null;
  let nameTh: string | null = null;
  let nameEn: string | null = null;
  try {
    const settings = await resolveTenantSettings();
    if (settings) {
      logoUrl = settings.logoUrl ?? null;
      nameTh = settings.nameTh;
      nameEn = settings.nameEn;
    }
  } catch {
    // fallback
  }

  return (
    <AdminLayoutClient
      logoUrl={logoUrl}
      orgNameTh={nameTh}
      orgNameEn={nameEn}
    >
      {children}
    </AdminLayoutClient>
  );
}
