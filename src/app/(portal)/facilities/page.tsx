import { getLocale } from "@/shared/lib/i18n/server";
import { resolveDefaultTenantId } from "@/features/identity/server";
import { listPublicFacilities } from "@/features/facilities/server";
import type { FacilityType } from "@/generated/prisma";
import Link from "next/link";
import {
  Building2,
  Building,
  Layers,
  Car,
  Laptop,
} from "lucide-react";
import { FacilitiesListClient } from "./_components/facilities-list-client";

export default async function FacilitiesPortalPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const locale = await getLocale();
  const tenantId = await resolveDefaultTenantId();
  const { type } = await searchParams;

  const validType =
    type && ["MEETING_ROOM", "LABORATORY", "AUDITORIUM", "VEHICLE"].includes(type)
      ? (type as FacilityType)
      : undefined;

  const facilities = await listPublicFacilities(tenantId, { type: validType });

  const TYPE_TABS = [
    { id: "ALL", labelTh: "สถานที่ทั้งหมด", labelEn: "All Resources", icon: Building2 },
    { id: "MEETING_ROOM", labelTh: "ห้องประชุม", labelEn: "Meeting Rooms", icon: Building },
    { id: "LABORATORY", labelTh: "ห้องแล็บ/ปฏิบัติการ", labelEn: "Laboratories", icon: Laptop },
    { id: "AUDITORIUM", labelTh: "หอประชุม", labelEn: "Auditoriums", icon: Layers },
    { id: "VEHICLE", labelTh: "ยานพาหนะ", labelEn: "Vehicles", icon: Car },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <Building2 className="h-3.5 w-3.5" />
          <span>{locale === "th" ? "บริการทรัพยากรคณะ" : "Faculty Infrastructure"}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          {locale === "th"
            ? "บริการห้องประชุม ห้องปฏิบัติการ และยานพาหนะ"
            : "Facilities & Vehicle Reservation"}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
          {locale === "th"
            ? "ตรวจสอบสิ่งอำนวยความสะดวก อุปกรณ์โสตทัศนูปกรณ์ และยื่นคำขอจองใช้บริการห้องประชุม ห้องสัมมนา หรือยานพาหนะส่วนกลางของคณะ"
            : "Explore our modern seminar rooms, high-performance computing labs, and official vehicles available for academic and administrative bookings."}
        </p>
      </div>

      {/* Type Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
        {TYPE_TABS.map((tab) => {
          const isSelected = (!type && tab.id === "ALL") || type === tab.id;
          const href = tab.id === "ALL" ? "/facilities" : `/facilities?type=${tab.id}`;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.id}
              href={href}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-1.5 ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm scale-100"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{locale === "th" ? tab.labelTh : tab.labelEn}</span>
            </Link>
          );
        })}
      </div>

      {/* Facilities Grid */}
      {facilities.length === 0 ? (
        <div className="liyon-card text-center py-20 rounded-2xl">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="text-lg font-bold text-foreground">
            {locale === "th"
              ? "ไม่พบข้อมูลสถานที่หรือยานพาหนะในหมวดหมู่นี้"
              : "No facilities found in this category"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {locale === "th"
              ? "กรุณาเลือกหมวดหมู่อื่น หรือตรวจสอบภายหลัง"
              : "Please try another filter category"}
          </p>
        </div>
      ) : (
        <FacilitiesListClient facilities={facilities} tenantId={tenantId} locale={locale} />
      )}
    </div>
  );
}
