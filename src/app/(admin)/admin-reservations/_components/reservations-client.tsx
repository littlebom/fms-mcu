"use client";

import { useState, useTransition } from "react";
import { Check, X, CalendarCheck, AlertCircle, Search } from "lucide-react";
import { toast } from "sonner";
import { useT, useLocale } from "@/shared/lib/i18n/client";
import { formatDate } from "@/shared/lib/format";
import {
  LiyonCard,
  DataTable,
  StatusPill,
  LiyonDialog,
  LiyonDialogHeader,
  LiyonDialogBody,
  LiyonDialogFooter,
  RowMenuItem,
  type DataTableColumn,
} from "@/shared/components/liyon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ReservationDto, FacilityDto } from "@/features/facilities";
import {
  reviewReservationAction,
  getReservationsAction,
} from "@/features/facilities/actions";

interface Props {
  initialReservations: ReservationDto[];
  facilities: FacilityDto[];
  canApprove: boolean;
}

export function ReservationsClient({ initialReservations, facilities, canApprove }: Props) {
  const t = useT();
  const locale = useLocale();
  const [reservations, setReservations] = useState<ReservationDto[]>(initialReservations);
  const [isPending, startTransition] = useTransition();

  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedFacility, setSelectedFacility] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Review Dialog state
  const [reviewItem, setReviewItem] = useState<ReservationDto | null>(null);
  const [reviewActionType, setReviewActionType] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [reviewNote, setReviewNote] = useState("");

  const reloadData = async () => {
    const res = await getReservationsAction();
    if (res.ok) setReservations(res.data);
  };

  const openReviewModal = (item: ReservationDto, action: "APPROVED" | "REJECTED") => {
    setReviewItem(item);
    setReviewActionType(action);
    setReviewNote("");
  };

  const handleConfirmReview = () => {
    if (!reviewItem) return;
    startTransition(async () => {
      const res = await reviewReservationAction({
        id: reviewItem.id,
        status: reviewActionType,
        reviewNote: reviewNote.trim() || undefined,
      });

      if (res.ok) {
        toast.success(
          reviewActionType === "APPROVED"
            ? t("reservations.approveSuccess")
            : t("reservations.rejectSuccess")
        );
        setReviewItem(null);
        await reloadData();
      } else {
        toast.error(res.error.message);
      }
    });
  };

  const filteredReservations = reservations.filter((r) => {
    const matchStatus = selectedStatus === "ALL" || r.status === selectedStatus;
    const matchFac = selectedFacility === "ALL" || r.facilityId === selectedFacility;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.reservedByName.toLowerCase().includes(q) ||
      r.facilityNameTh.toLowerCase().includes(q) ||
      r.facilityNameEn.toLowerCase().includes(q) ||
      (r.reservedByDept && r.reservedByDept.toLowerCase().includes(q));
    return matchStatus && matchFac && matchSearch;
  });

  const columns: DataTableColumn<ReservationDto>[] = [
    {
      key: "title",
      header: t("reservations.reservationTitle"),
      render: (row) => (
        <div>
          <div className="font-semibold text-foreground leading-snug">{row.title}</div>
          <div className="text-xs text-muted-foreground">
            {row.attendeeCount} {locale === "th" ? "คน" : "attendees"}
            {row.description ? ` • ${row.description}` : ""}
          </div>
        </div>
      ),
    },
    {
      key: "facility",
      header: t("facilities.nav"),
      render: (row) => (
        <div>
          <div className="text-xs font-semibold text-foreground">
            {locale === "th" ? row.facilityNameTh : row.facilityNameEn}
          </div>
          <div className="text-[11px] text-muted-foreground">{row.facilityLocation || "-"}</div>
        </div>
      ),
    },
    {
      key: "reservedBy",
      header: t("reservations.reservedByName"),
      render: (row) => (
        <div>
          <div className="text-xs font-medium text-foreground">{row.reservedByName}</div>
          <div className="text-[11px] text-muted-foreground">
            {row.reservedByDept || row.reservedByEmail} ({row.reservedByPhone})
          </div>
        </div>
      ),
    },
    {
      key: "time",
      header: t("reservations.startTime"),
      render: (row) => {
        const start = new Date(row.startTime);
        const end = new Date(row.endTime);
        const dateFormatted = formatDate(start, locale);
        const timeFormatted = `${start.toLocaleTimeString(locale === "th" ? "th-TH" : "en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })} - ${end.toLocaleTimeString(locale === "th" ? "th-TH" : "en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}`;

        return (
          <div className="text-xs">
            <div className="font-medium text-foreground">{dateFormatted}</div>
            <div className="text-[11px] text-muted-foreground">{timeFormatted}</div>
          </div>
        );
      },
    },
    {
      key: "status",
      header: t("reservations.status"),
      render: (row) => {
        if (row.status === "APPROVED") {
          return <StatusPill tone="ok">{t("reservations.approved")}</StatusPill>;
        }
        if (row.status === "PENDING") {
          return <StatusPill tone="warn">{t("reservations.pending")}</StatusPill>;
        }
        if (row.status === "REJECTED") {
          return <StatusPill tone="bad">{t("reservations.rejected")}</StatusPill>;
        }
        return <StatusPill tone="off">{t("reservations.cancelled")}</StatusPill>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("reservations.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("reservations.subtitle")}</p>
        </div>
      </div>

      <LiyonCard>
        {/* Filter Bar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาชื่อผู้จอง, กิจกรรม..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="ALL">{locale === "th" ? "ทุกสถานะ" : "All Status"}</option>
              <option value="PENDING">{t("reservations.pending")}</option>
              <option value="APPROVED">{t("reservations.approved")}</option>
              <option value="REJECTED">{t("reservations.rejected")}</option>
              <option value="CANCELLED">{t("reservations.cancelled")}</option>
            </select>

            <select
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="ALL">{locale === "th" ? "ทุกสถานที่/ยานพาหนะ" : "All Facilities"}</option>
              {facilities.map((f) => (
                <option key={f.id} value={f.id}>
                  {locale === "th" ? f.nameTh : f.nameEn}
                </option>
              ))}
            </select>
          </div>
          <div className="text-xs text-muted-foreground">
            {locale === "th" ? `พบทั้งหมด ${filteredReservations.length} รายการ` : `Total ${filteredReservations.length} items`}
          </div>
        </div>

        {/* Table */}
        <DataTable<ReservationDto>
          state={filteredReservations.length === 0 ? "empty" : "data"}
          headHeading={t("reservations.title")}
          columns={columns}
          rows={filteredReservations}
          getRowId={(item) => item.id}
          empty={{
            icon: <CalendarCheck className="h-10 w-10 text-muted-foreground" />,
            title: t("reservations.empty"),
          }}
          error={{
            icon: <AlertCircle className="h-10 w-10 text-destructive" />,
            title: t("common.error"),
          }}
          renderRowMenu={
            canApprove
              ? (item) => (
                  <>
                    {item.status === "PENDING" && (
                      <>
                        <RowMenuItem
                          onSelect={() => openReviewModal(item, "APPROVED")}
                          icon={<Check className="h-4 w-4 text-emerald-600" />}
                        >
                          {t("reservations.approveAction")}
                        </RowMenuItem>
                        <RowMenuItem
                          danger
                          onSelect={() => openReviewModal(item, "REJECTED")}
                          icon={<X className="h-4 w-4" />}
                        >
                          {t("reservations.rejectAction")}
                        </RowMenuItem>
                      </>
                    )}
                  </>
                )
              : undefined
          }
        />
      </LiyonCard>

      {/* Review Modal */}
      <LiyonDialog
        open={!!reviewItem}
        onOpenChange={(open) => !open && setReviewItem(null)}
        danger={reviewActionType === "REJECTED"}
      >
        <LiyonDialogHeader
          title={
            reviewActionType === "APPROVED"
              ? t("reservations.approveAction")
              : t("reservations.rejectAction")
          }
          description={
            reviewActionType === "APPROVED"
              ? "ยืนยันการอนุมัติการใช้งานห้องหรือยานพาหนะตามเวลาที่ขอ"
              : "ระบุเหตุผลในการปฏิเสธคำขอการใช้งาน"
          }
        />
        {reviewItem && (
          <LiyonDialogBody className="space-y-4">
            <div className="p-3 rounded-xl bg-muted/60 text-xs space-y-1">
              <div className="font-bold text-foreground">{reviewItem.title}</div>
              <div className="text-muted-foreground">
                {locale === "th" ? reviewItem.facilityNameTh : reviewItem.facilityNameEn}
              </div>
              <div className="text-muted-foreground">
                {locale === "th" ? "ผู้ขอใช้:" : "Requested by:"} {reviewItem.reservedByName} ({reviewItem.reservedByDept || "-"})
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("reservations.reviewNote")}</label>
              <Input
                placeholder="เช่น อนุมัติการใช้งาน พร้อมเตรียมอุปกรณ์ หรือ เหตุผลที่ไม่อนุมัติ"
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
              />
            </div>
          </LiyonDialogBody>
        )}
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setReviewItem(null)} disabled={isPending}>
            {t("reservations.cancel")}
          </Button>
          <Button
            variant={reviewActionType === "REJECTED" ? "destructive" : "default"}
            onClick={handleConfirmReview}
            disabled={isPending}
          >
            {isPending
              ? "กำลังประมวลผล..."
              : reviewActionType === "APPROVED"
              ? t("reservations.approveAction")
              : t("reservations.rejectAction")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>
    </div>
  );
}
