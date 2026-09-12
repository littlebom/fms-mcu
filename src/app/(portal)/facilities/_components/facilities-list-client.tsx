"use client";

import { useState } from "react";
import Image from "next/image";
import { Users, MapPin, Sparkles, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FacilityDto } from "@/features/facilities";
import { FacilityBookingModal } from "./facility-booking-modal";

interface Props {
  facilities: FacilityDto[];
  tenantId: string;
  locale: string;
}

export function FacilitiesListClient({ facilities, tenantId, locale }: Props) {
  const [selectedFacility, setSelectedFacility] = useState<FacilityDto | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleBook = (facility: FacilityDto) => {
    setSelectedFacility(facility);
    setModalOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {facilities.map((fac) => {
          const typeBadge =
            fac.type === "MEETING_ROOM"
              ? locale === "th" ? "ห้องประชุม" : "Meeting Room"
              : fac.type === "LABORATORY"
              ? locale === "th" ? "ห้องปฏิบัติการ" : "Laboratory"
              : fac.type === "AUDITORIUM"
              ? locale === "th" ? "หอประชุม" : "Auditorium"
              : locale === "th" ? "ยานพาหนะ" : "Vehicle";

          return (
            <div
              key={fac.id}
              className="liyon-card liyon-card-hover group rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              {fac.imageUrl && (
                <div className="h-48 w-full overflow-hidden bg-muted relative">
                  <Image
                    src={fac.imageUrl}
                    alt={locale === "th" ? fac.nameTh : fac.nameEn}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-background/90 backdrop-blur-md text-primary border border-border/80 shadow-sm">
                      {typeBadge}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted text-foreground border border-border">
                    {fac.code.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    <span className="font-semibold text-foreground">{fac.capacity}</span>{" "}
                    <span>{locale === "th" ? "ที่นั่ง" : "seats"}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {locale === "th" ? fac.nameTh : fac.nameEn}
                  </h2>
                  {fac.location && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>{fac.location}</span>
                    </div>
                  )}
                </div>

                {/* Equipment chips */}
                {fac.equipment.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-primary" />
                      <span>{locale === "th" ? "สิ่งอำนวยความสะดวก:" : "Amenities:"}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {fac.equipment.map((eq, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/50"
                        >
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-muted/30 border-t border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{locale === "th" ? "เปิดให้จองใช้งาน" : "Available for Booking"}</span>
                </div>

                <Button
                  size="sm"
                  onClick={() => handleBook(fac)}
                  className="inline-flex items-center gap-1.5 text-xs shadow-sm font-semibold"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{locale === "th" ? "ขอจองใช้งาน" : "Book Resource"}</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <FacilityBookingModal
        facility={selectedFacility}
        tenantId={tenantId}
        locale={locale}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
