"use client";

import { useState, useTransition } from "react";
import { Plus, Edit2, Trash2, Building2, AlertCircle, Search } from "lucide-react";
import { toast } from "sonner";
import { useT, useLocale } from "@/shared/lib/i18n/client";
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
import type { FacilityType } from "@/generated/prisma";
import type { FacilityDto } from "@/features/facilities";
import {
  createFacilityAction,
  updateFacilityAction,
  deleteFacilityAction,
  getAdminFacilitiesAction,
} from "@/features/facilities/actions";

interface Props {
  initialFacilities: FacilityDto[];
  canWrite: boolean;
  canManage: boolean;
}

export function FacilitiesClient({ initialFacilities, canWrite, canManage }: Props) {
  const t = useT();
  const locale = useLocale();
  const [facilities, setFacilities] = useState<FacilityDto[]>(initialFacilities);
  const [isPending, startTransition] = useTransition();

  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FacilityDto | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<FacilityDto | null>(null);

  // Form states
  const [code, setCode] = useState("");
  const [type, setType] = useState<FacilityType>("MEETING_ROOM");
  const [nameTh, setNameTh] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("20");
  const [equipmentStr, setEquipmentStr] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState("0");

  const reloadData = async () => {
    const res = await getAdminFacilitiesAction();
    if (res.ok) setFacilities(res.data);
  };

  const openCreateDialog = () => {
    setEditingItem(null);
    setCode("");
    setType("MEETING_ROOM");
    setNameTh("");
    setNameEn("");
    setLocation("");
    setCapacity("20");
    setEquipmentStr("");
    setImageUrl("");
    setIsActive(true);
    setSortOrder("0");
    setModalOpen(true);
  };

  const openEditDialog = (item: FacilityDto) => {
    setEditingItem(item);
    setCode(item.code);
    setType(item.type);
    setNameTh(item.nameTh);
    setNameEn(item.nameEn);
    setLocation(item.location ?? "");
    setCapacity(String(item.capacity));
    setEquipmentStr(item.equipment.join(", "));
    setImageUrl(item.imageUrl ?? "");
    setIsActive(item.isActive);
    setSortOrder(String(item.sortOrder));
    setModalOpen(true);
  };

  const handleSave = () => {
    startTransition(async () => {
      const equipment = equipmentStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        code: code.trim().toLowerCase(),
        type,
        nameTh: nameTh.trim(),
        nameEn: nameEn.trim(),
        location: location.trim() || undefined,
        capacity: Number(capacity) || 10,
        equipment,
        imageUrl: imageUrl.trim() || undefined,
        isActive,
        sortOrder: Number(sortOrder) || 0,
      };

      if (editingItem) {
        const res = await updateFacilityAction({ ...payload, id: editingItem.id });
        if (res.ok) {
          toast.success(t("facilities.updateSuccess"));
          setModalOpen(false);
          await reloadData();
        } else {
          toast.error(res.error.message);
        }
      } else {
        const res = await createFacilityAction(payload);
        if (res.ok) {
          toast.success(t("facilities.createSuccess"));
          setModalOpen(false);
          await reloadData();
        } else {
          toast.error(res.error.message);
        }
      }
    });
  };

  const handleDelete = (item: FacilityDto) => {
    startTransition(async () => {
      const res = await deleteFacilityAction(item.id);
      if (res.ok) {
        toast.success(t("facilities.deleteSuccess"));
        setDeleteConfirmItem(null);
        await reloadData();
      } else {
        toast.error(res.error.message);
      }
    });
  };

  const filteredFacilities = facilities.filter((f) => {
    const matchType = selectedType === "ALL" || f.type === selectedType;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      f.code.toLowerCase().includes(q) ||
      f.nameTh.toLowerCase().includes(q) ||
      f.nameEn.toLowerCase().includes(q) ||
      (f.location && f.location.toLowerCase().includes(q));
    return matchType && matchSearch;
  });

  const columns: DataTableColumn<FacilityDto>[] = [
    {
      key: "code",
      header: t("facilities.code"),
      render: (row) => (
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted text-foreground border border-border">
          {row.code.toUpperCase()}
        </span>
      ),
    },
    {
      key: "name",
      header: t("facilities.nameTh"),
      render: (row) => (
        <div>
          <div className="font-semibold text-foreground leading-snug">
            {locale === "th" ? row.nameTh : row.nameEn}
          </div>
          <div className="text-xs text-muted-foreground">{row.location || "-"}</div>
        </div>
      ),
    },
    {
      key: "type",
      header: t("facilities.type"),
      render: (row) => {
        const label =
          row.type === "MEETING_ROOM"
            ? t("facilities.meetingRoom")
            : row.type === "LABORATORY"
            ? t("facilities.laboratory")
            : row.type === "AUDITORIUM"
            ? t("facilities.auditorium")
            : t("facilities.vehicle");
        return <span className="text-xs font-medium">{label}</span>;
      },
    },
    {
      key: "capacity",
      header: t("facilities.capacity"),
      render: (row) => (
        <span className="text-xs font-bold">
          {row.capacity} {t("facilities.persons")}
        </span>
      ),
    },
    {
      key: "status",
      header: t("facilities.status"),
      render: (row) =>
        row.isActive ? (
          <StatusPill tone="ok">{t("facilities.active")}</StatusPill>
        ) : (
          <StatusPill tone="off">{t("facilities.inactive")}</StatusPill>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("facilities.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("facilities.subtitle")}</p>
        </div>
        {canWrite && (
          <Button onClick={openCreateDialog} className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t("facilities.create")}
          </Button>
        )}
      </div>

      <LiyonCard>
        {/* Filter Bar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหารหัส, ชื่อสถานที่..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="ALL">{t("facilities.allTypes")}</option>
              <option value="MEETING_ROOM">{t("facilities.meetingRoom")}</option>
              <option value="LABORATORY">{t("facilities.laboratory")}</option>
              <option value="AUDITORIUM">{t("facilities.auditorium")}</option>
              <option value="VEHICLE">{t("facilities.vehicle")}</option>
            </select>
          </div>
          <div className="text-xs text-muted-foreground">
            {locale === "th" ? `พบทั้งหมด ${filteredFacilities.length} รายการ` : `Total ${filteredFacilities.length} items`}
          </div>
        </div>

        {/* Table */}
        <DataTable<FacilityDto>
          state={filteredFacilities.length === 0 ? "empty" : "data"}
          headHeading={t("facilities.title")}
          columns={columns}
          rows={filteredFacilities}
          getRowId={(item) => item.id}
          empty={{
            icon: <Building2 className="h-10 w-10 text-muted-foreground" />,
            title: t("facilities.empty"),
          }}
          error={{
            icon: <AlertCircle className="h-10 w-10 text-destructive" />,
            title: t("common.error"),
          }}
          renderRowMenu={
            canWrite
              ? (item) => (
                  <>
                    <RowMenuItem onSelect={() => openEditDialog(item)} icon={<Edit2 className="h-4 w-4" />}>
                      {t("facilities.edit")}
                    </RowMenuItem>
                    {canManage && (
                      <RowMenuItem danger onSelect={() => setDeleteConfirmItem(item)} icon={<Trash2 className="h-4 w-4" />}>
                        {t("facilities.delete")}
                      </RowMenuItem>
                    )}
                  </>
                )
              : undefined
          }
        />
      </LiyonCard>

      {/* Create / Edit Dialog */}
      <LiyonDialog open={modalOpen} onOpenChange={setModalOpen} wide>
        <LiyonDialogHeader
          title={editingItem ? t("facilities.edit") : t("facilities.create")}
          description="จัดการข้อมูลห้องประชุม ห้องปฏิบัติการ และยานพาหนะของคณะ"
        />
        <LiyonDialogBody className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("facilities.code")} *</label>
              <Input
                placeholder="เช่น room-401"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("facilities.type")} *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as FacilityType)}
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="MEETING_ROOM">{t("facilities.meetingRoom")}</option>
                <option value="LABORATORY">{t("facilities.laboratory")}</option>
                <option value="AUDITORIUM">{t("facilities.auditorium")}</option>
                <option value="VEHICLE">{t("facilities.vehicle")}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("facilities.nameTh")} *</label>
              <Input
                placeholder="เช่น ห้องประชุมวิชาการ 401"
                value={nameTh}
                onChange={(e) => setNameTh(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("facilities.nameEn")} *</label>
              <Input
                placeholder="e.g. Executive Meeting Room 401"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("facilities.location")}</label>
              <Input
                placeholder="เช่น อาคาร 4 ชั้น 4"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("facilities.capacity")} *</label>
              <Input
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">{t("facilities.equipment")}</label>
            <Input
              placeholder="คั่นด้วยเครื่องหมายจุลภาค เช่น Smart Projector, Video Conference, Whiteboard"
              value={equipmentStr}
              onChange={(e) => setEquipmentStr(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">URL รูปภาพ</label>
            <Input
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-input text-primary focus:ring-primary"
              />
              <span>{t("facilities.active")}</span>
            </label>
          </div>
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setModalOpen(false)} disabled={isPending}>
            {t("facilities.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "กำลังบันทึก..." : t("facilities.save")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      {/* Delete Confirmation Dialog */}
      <LiyonDialog open={!!deleteConfirmItem} onOpenChange={(open) => !open && setDeleteConfirmItem(null)} danger>
        <LiyonDialogHeader
          title={t("facilities.delete")}
          description={t("facilities.deleteConfirm")}
        />
        <LiyonDialogBody>
          {deleteConfirmItem && (
            <div className="text-sm font-medium text-foreground">
              [{deleteConfirmItem.code.toUpperCase()}] {locale === "th" ? deleteConfirmItem.nameTh : deleteConfirmItem.nameEn}
            </div>
          )}
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setDeleteConfirmItem(null)} disabled={isPending}>
            {t("facilities.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteConfirmItem && handleDelete(deleteConfirmItem)}
            disabled={isPending}
          >
            {isPending ? "กำลังลบ..." : t("facilities.delete")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>
    </div>
  );
}
