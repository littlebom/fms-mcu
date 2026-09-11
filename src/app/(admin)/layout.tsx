import { getTenantSettings, resolveDefaultTenantId } from "@/features/identity/server";
import { AdminLayoutClient } from "./_components/admin-layout-client";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // ดึง logoUrl จาก DB ฝั่ง Server ก่อนส่งให้ Client Component
  let logoUrl: string | null = null;
  try {
    const tenantId = await resolveDefaultTenantId();
    const settings = await getTenantSettings(tenantId);
    logoUrl = settings.logoUrl ?? null;
  } catch {
    // ถ้าดึงไม่ได้ (ยังไม่มี tenant / DB ไม่พร้อม) ใช้ค่า null → แสดง SVG icon เดิม
  }

  return <AdminLayoutClient logoUrl={logoUrl}>{children}</AdminLayoutClient>;
}
