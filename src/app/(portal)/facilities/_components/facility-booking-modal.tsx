"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  LiyonDialog,
  LiyonDialogHeader,
  LiyonDialogBody,
  LiyonDialogFooter,
} from "@/shared/components/liyon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FacilityDto } from "@/features/facilities";
import { submitReservationAction } from "@/features/facilities/actions";

interface Props {
  facility: FacilityDto | null;
  tenantId: string;
  locale: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FacilityBookingModal({ facility, tenantId, locale, open, onOpenChange }: Props) {
  const [isPending, startTransition] = useTransition();

  const [reservedByName, setReservedByName] = useState("");
  const [reservedByEmail, setReservedByEmail] = useState("");
  const [reservedByPhone, setReservedByPhone] = useState("");
  const [reservedByDept, setReservedByDept] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attendeeCount, setAttendeeCount] = useState("5");
  const [dateStr, setDateStr] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [startTimeStr, setStartTimeStr] = useState("09:00");
  const [endTimeStr, setEndTimeStr] = useState("12:00");

  if (!facility) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const startDateTime = new Date(`${dateStr}T${startTimeStr}:00`);
      const endDateTime = new Date(`${dateStr}T${endTimeStr}:00`);

      if (endDateTime <= startDateTime) {
        toast.error(
          locale === "th"
            ? "เวลาสิ้นสุดต้องอยู่หลังเวลาเริ่มต้น"
            : "End time must be after start time"
        );
        return;
      }

      const res = await submitReservationAction(tenantId, {
        facilityId: facility.id,
        reservedByName: reservedByName.trim(),
        reservedByEmail: reservedByEmail.trim(),
        reservedByPhone: reservedByPhone.trim(),
        reservedByDept: reservedByDept.trim() || undefined,
        title: title.trim(),
        description: description.trim() || undefined,
        attendeeCount: Number(attendeeCount) || 1,
        startTime: startDateTime,
        endTime: endDateTime,
      });

      if (res.ok) {
        toast.success(
          locale === "th"
            ? "ส่งคำขอจองเรียบร้อยแล้ว เจ้าหน้าที่จะทำการตรวจสอบและแจ้งผลทางอีเมล"
            : "Booking request submitted successfully! We will notify you via email."
        );
        onOpenChange(false);
        // Reset form
        setTitle("");
        setDescription("");
      } else {
        toast.error(res.error.message);
      }
    });
  };

  return (
    <LiyonDialog open={open} onOpenChange={onOpenChange} wide>
      <LiyonDialogHeader
        title={locale === "th" ? `จองใช้งาน: ${facility.nameTh}` : `Book: ${facility.nameEn}`}
        description={
          locale === "th"
            ? `ความจุ ${facility.capacity} ที่นั่ง • ${facility.location || "อาคารคณะ"}`
            : `Capacity ${facility.capacity} • ${facility.location || "Faculty Building"}`
        }
      />
      <form onSubmit={handleSubmit}>
        <LiyonDialogBody className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">
                {locale === "th" ? "ชื่อ-นามสกุล ผู้ขอใช้งาน *" : "Full Name *"}
              </label>
              <Input
                required
                placeholder="เช่น ผศ.ดร. นวัตกรรม ดิจิทัล"
                value={reservedByName}
                onChange={(e) => setReservedByName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">
                {locale === "th" ? "สังกัด / ภาควิชา / หน่วยงาน *" : "Department / Organization *"}
              </label>
              <Input
                required
                placeholder="เช่น ภาควิชาวิทยาการคอมพิวเตอร์"
                value={reservedByDept}
                onChange={(e) => setReservedByDept(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">
                {locale === "th" ? "อีเมลติดต่อ *" : "Email Address *"}
              </label>
              <Input
                type="email"
                required
                placeholder="contact@university.ac.th"
                value={reservedByEmail}
                onChange={(e) => setReservedByEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">
                {locale === "th" ? "เบอร์โทรศัพท์ติดต่อ *" : "Phone Number *"}
              </label>
              <Input
                required
                placeholder="081-234-5678"
                value={reservedByPhone}
                onChange={(e) => setReservedByPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">
                {locale === "th" ? "วันที่ต้องการใช้งาน *" : "Date *"}
              </label>
              <Input
                type="date"
                required
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">
                {locale === "th" ? "เวลาเริ่มต้น *" : "Start Time *"}
              </label>
              <Input
                type="time"
                required
                value={startTimeStr}
                onChange={(e) => setStartTimeStr(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">
                {locale === "th" ? "เวลาสิ้นสุด *" : "End Time *"}
              </label>
              <Input
                type="time"
                required
                value={endTimeStr}
                onChange={(e) => setEndTimeStr(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">
              {locale === "th" ? "หัวข้อกิจกรรม / วัตถุประสงค์การใช้งาน *" : "Event / Meeting Title *"}
            </label>
            <Input
              required
              placeholder="เช่น การประชุมเตรียมความพร้อมจัดสอบโครงงาน"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">
                {locale === "th" ? "จำนวนผู้เข้าร่วม (คน) *" : "Attendees *"}
              </label>
              <Input
                type="number"
                min="1"
                max={facility.capacity * 2}
                required
                value={attendeeCount}
                onChange={(e) => setAttendeeCount(e.target.value)}
              />
            </div>

            <div className="sm:col-span-3 space-y-1.5">
              <label className="text-xs font-semibold">
                {locale === "th" ? "รายละเอียดเพิ่มเติม / อุปกรณ์ที่ต้องการใช้" : "Additional Notes / Equipment"}
              </label>
              <Input
                placeholder="เช่น ขอใช้ระบบบันทึกภาพและไมโครโฟนไร้สาย 4 ตัว"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            {locale === "th" ? "ยกเลิก" : "Cancel"}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending
              ? locale === "th" ? "กำลังส่งคำขอ..." : "Submitting..."
              : locale === "th" ? "ยืนยันการขอจอง" : "Confirm Booking"}
          </Button>
        </LiyonDialogFooter>
      </form>
    </LiyonDialog>
  );
}
