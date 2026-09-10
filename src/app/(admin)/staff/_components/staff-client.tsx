"use client";

import { useState, useTransition } from "react";
import { Plus, Edit2, Trash2, UserCheck, AlertCircle, Search } from "lucide-react";
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
import type { StaffProfileDto, DepartmentDto } from "@/features/staff";
import {
  createStaffProfileAction,
  updateStaffProfileAction,
  deleteStaffProfileAction,
  getStaffProfilesAction,
} from "@/features/staff/actions";

interface Props {
  initialStaff: StaffProfileDto[];
  departments: DepartmentDto[];
  canManage: boolean;
}

export function StaffClient({ initialStaff, departments, canManage }: Props) {
  const t = useT();
  const locale = useLocale();
  const [staffList, setStaffList] = useState<StaffProfileDto[]>(initialStaff);
  const [isPending, startTransition] = useTransition();

  const [selectedDept, setSelectedDept] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StaffProfileDto | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<StaffProfileDto | null>(null);

  // Form states
  const [departmentId, setDepartmentId] = useState(departments[0]?.id ?? "");
  const [prefixTh, setPrefixTh] = useState("");
  const [prefixEn, setPrefixEn] = useState("");
  const [firstNameTh, setFirstNameTh] = useState("");
  const [lastNameTh, setLastNameTh] = useState("");
  const [firstNameEn, setFirstNameEn] = useState("");
  const [lastNameEn, setLastNameEn] = useState("");
  const [positionTh, setPositionTh] = useState("");
  const [positionEn, setPositionEn] = useState("");
  const [email, setEmail] = useState("");
  const [phoneExt, setPhoneExt] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const reloadData = async () => {
    const res = await getStaffProfilesAction(selectedDept === "ALL" ? undefined : selectedDept);
    if (res.ok) setStaffList(res.data);
  };

  const openCreateDialog = () => {
    setEditingItem(null);
    setDepartmentId(departments[0]?.id ?? "");
    setPrefixTh("");
    setPrefixEn("");
    setFirstNameTh("");
    setLastNameTh("");
    setFirstNameEn("");
    setLastNameEn("");
    setPositionTh("");
    setPositionEn("");
    setEmail("");
    setPhoneExt("");
    setRoomNumber("");
    setAvatarUrl("");
    setSortOrder("0");
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditDialog = (item: StaffProfileDto) => {
    setEditingItem(item);
    setDepartmentId(item.departmentId);
    setPrefixTh(item.prefixTh);
    setPrefixEn(item.prefixEn);
    setFirstNameTh(item.firstNameTh);
    setLastNameTh(item.lastNameTh);
    setFirstNameEn(item.firstNameEn);
    setLastNameEn(item.lastNameEn);
    setPositionTh(item.positionTh);
    setPositionEn(item.positionEn);
    setEmail(item.email);
    setPhoneExt(item.phoneExt ?? "");
    setRoomNumber(item.roomNumber ?? "");
    setAvatarUrl(item.avatarUrl ?? "");
    setSortOrder(String(item.sortOrder));
    setIsActive(item.isActive);
    setModalOpen(true);
  };

  const handleSave = () => {
    startTransition(async () => {
      const payload = {
        departmentId,
        prefixTh: prefixTh.trim(),
        prefixEn: prefixEn.trim(),
        firstNameTh: firstNameTh.trim(),
        lastNameTh: lastNameTh.trim(),
        firstNameEn: firstNameEn.trim(),
        lastNameEn: lastNameEn.trim(),
        positionTh: positionTh.trim(),
        positionEn: positionEn.trim(),
        email: email.trim(),
        phoneExt: phoneExt.trim() || null,
        roomNumber: roomNumber.trim() || null,
        avatarUrl: avatarUrl.trim() || null,
        sortOrder: Number(sortOrder) || 0,
        isActive,
      };

      if (editingItem) {
        const res = await updateStaffProfileAction({ ...payload, id: editingItem.id });
        if (res.ok) {
          toast.success(t("staff.updateSuccess"));
          setModalOpen(false);
          await reloadData();
        } else {
          toast.error(res.error.message);
        }
      } else {
        const res = await createStaffProfileAction(payload);
        if (res.ok) {
          toast.success(t("staff.createSuccess"));
          setModalOpen(false);
          await reloadData();
        } else {
          toast.error(res.error.message);
        }
      }
    });
  };

  const handleDelete = (item: StaffProfileDto) => {
    startTransition(async () => {
      const res = await deleteStaffProfileAction(item.id);
      if (res.ok) {
        toast.success(t("staff.deleteSuccess"));
        setDeleteConfirmItem(null);
        await reloadData();
      } else {
        toast.error(res.error.message);
      }
    });
  };

  const filteredStaff = staffList.filter((s) => {
    const matchDept = selectedDept === "ALL" || s.departmentId === selectedDept;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      s.firstNameTh.toLowerCase().includes(q) ||
      s.lastNameTh.toLowerCase().includes(q) ||
      s.firstNameEn.toLowerCase().includes(q) ||
      s.lastNameEn.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.positionTh.toLowerCase().includes(q);
    return matchDept && matchSearch;
  });

  const columns: DataTableColumn<StaffProfileDto>[] = [
    {
      key: "person",
      header: t("staff.nameTh"),
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"}
            alt=""
            className="h-10 w-10 rounded-full object-cover border border-border"
          />
          <div>
            <div className="font-medium text-foreground">
              {locale === "th"
                ? `${row.prefixTh} ${row.firstNameTh} ${row.lastNameTh}`
                : `${row.prefixEn} ${row.firstNameEn} ${row.lastNameEn}`}
            </div>
            <div className="text-xs text-muted-foreground">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "position",
      header: t("staff.positionTh"),
      render: (row) => (
        <div>
          <div className="text-sm font-medium">{locale === "th" ? row.positionTh : row.positionEn}</div>
          <div className="text-xs text-muted-foreground">
            {locale === "th" ? row.departmentNameTh : row.departmentNameEn}
          </div>
        </div>
      ),
    },
    {
      key: "room",
      header: t("staff.roomNumber"),
      render: (row) => <span className="text-sm text-muted-foreground">{row.roomNumber || "-"}</span>,
    },
    {
      key: "status",
      header: t("staff.status"),
      render: (row) =>
        row.isActive ? (
          <StatusPill tone="ok">{t("staff.active")}</StatusPill>
        ) : (
          <StatusPill tone="off">{t("staff.inactive")}</StatusPill>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("staff.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("staff.subtitle")}</p>
        </div>
        {canManage && (
          <Button onClick={openCreateDialog} className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t("staff.create")}
          </Button>
        )}
      </div>

      <LiyonCard>
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาชื่อ, ตำแหน่ง, อีเมล..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <select
              value={selectedDept}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedDept(e.target.value)}
              className="h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="ALL">{t("staff.allDepartments")}</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {locale === "th" ? d.nameTh : d.nameEn}
                </option>
              ))}
            </select>
          </div>
          <div className="text-xs text-muted-foreground">
            พบทั้งหมด {filteredStaff.length} ท่าน
          </div>
        </div>

        <DataTable<StaffProfileDto>
          state={filteredStaff.length === 0 ? "empty" : "data"}
          headHeading={t("staff.title")}
          columns={columns}
          rows={filteredStaff}
          getRowId={(item) => item.id}
          empty={{
            icon: <UserCheck className="h-10 w-10 text-muted-foreground" />,
            title: t("staff.empty"),
          }}
          error={{
            icon: <AlertCircle className="h-10 w-10 text-destructive" />,
            title: t("common.error"),
          }}
          renderRowMenu={
            canManage
              ? (item) => (
                  <>
                    <RowMenuItem onSelect={() => openEditDialog(item)} icon={<Edit2 className="h-4 w-4" />}>
                      {t("staff.edit")}
                    </RowMenuItem>
                    <RowMenuItem danger onSelect={() => setDeleteConfirmItem(item)} icon={<Trash2 className="h-4 w-4" />}>
                      {t("staff.delete")}
                    </RowMenuItem>
                  </>
                )
              : undefined
          }
        />
      </LiyonCard>

      {/* Create / Edit Dialog */}
      <LiyonDialog open={modalOpen} onOpenChange={setModalOpen} wide>
        <LiyonDialogHeader
          title={editingItem ? t("staff.edit") : t("staff.create")}
          description="กรอกข้อมูลบุคลากรเพื่อแสดงในทำเนียบของคณะ"
        />
        <LiyonDialogBody className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">{t("staff.department")} *</label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {locale === "th" ? d.nameTh : d.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("staff.prefixTh")} *</label>
              <Input placeholder="ศ.ดร. / ผศ." value={prefixTh} onChange={(e) => setPrefixTh(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("staff.firstNameTh")} *</label>
              <Input value={firstNameTh} onChange={(e) => setFirstNameTh(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("staff.lastNameTh")} *</label>
              <Input value={lastNameTh} onChange={(e) => setLastNameTh(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("staff.prefixEn")} *</label>
              <Input placeholder="Prof. Dr. / Asst. Prof." value={prefixEn} onChange={(e) => setPrefixEn(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("staff.firstNameEn")} *</label>
              <Input value={firstNameEn} onChange={(e) => setFirstNameEn(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("staff.lastNameEn")} *</label>
              <Input value={lastNameEn} onChange={(e) => setLastNameEn(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("staff.positionTh")} *</label>
              <Input placeholder="หัวหน้าภาควิชา / อาจารย์ประจำ" value={positionTh} onChange={(e) => setPositionTh(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("staff.positionEn")} *</label>
              <Input placeholder="Head of Department / Lecturer" value={positionEn} onChange={(e) => setPositionEn(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("staff.email")} *</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("staff.phoneExt")}</label>
              <Input placeholder="1001" value={phoneExt} onChange={(e) => setPhoneExt(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("staff.roomNumber")}</label>
              <Input placeholder="CS-302" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">URL รูปภาพโปรไฟล์</label>
            <Input placeholder="https://example.com/photo.jpg" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("staff.sortOrder")}</label>
              <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("staff.status")}</label>
              <select
                value={isActive ? "active" : "inactive"}
                onChange={(e) => setIsActive(e.target.value === "active")}
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="active">{t("staff.active")}</option>
                <option value="inactive">{t("staff.inactive")}</option>
              </select>
            </div>
          </div>
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setModalOpen(false)}>
            {t("staff.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {t("staff.save")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      {/* Delete Confirmation Dialog */}
      <LiyonDialog open={!!deleteConfirmItem} onOpenChange={(open) => !open && setDeleteConfirmItem(null)} danger>
        <LiyonDialogHeader
          title={t("staff.delete")}
          description={t("staff.deleteConfirm")}
        />
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setDeleteConfirmItem(null)}>
            {t("staff.cancel")}
          </Button>
          <Button variant="destructive" onClick={() => deleteConfirmItem && handleDelete(deleteConfirmItem)} disabled={isPending}>
            {t("staff.delete")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>
    </div>
  );
}
