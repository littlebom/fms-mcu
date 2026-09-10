"use client";

import { useState, useTransition } from "react";
import { Plus, Edit2, Trash2, FileText, AlertCircle, Search } from "lucide-react";
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
import type { DocumentDto, DocumentCategoryDto } from "@/features/documents";
import {
  createDocumentAction,
  updateDocumentAction,
  deleteDocumentAction,
  getAdminDocumentsAction,
} from "@/features/documents/actions";

interface Props {
  initialDocs: DocumentDto[];
  categories: DocumentCategoryDto[];
  canWrite: boolean;
  canManage: boolean;
}

export function DocumentsClient({ initialDocs, categories, canWrite, canManage }: Props) {
  const t = useT();
  const locale = useLocale();
  const [documents, setDocuments] = useState<DocumentDto[]>(initialDocs);
  const [isPending, startTransition] = useTransition();

  const [selectedCat, setSelectedCat] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DocumentDto | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<DocumentDto | null>(null);

  // Form states
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [code, setCode] = useState("");
  const [titleTh, setTitleTh] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descriptionTh, setDescriptionTh] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("pdf");
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState("0");

  const reloadData = async () => {
    const res = await getAdminDocumentsAction();
    if (res.ok) setDocuments(res.data);
  };

  const openCreateDialog = () => {
    setEditingItem(null);
    setCategoryId(categories[0]?.id ?? "");
    setCode("");
    setTitleTh("");
    setTitleEn("");
    setDescriptionTh("");
    setDescriptionEn("");
    setFileUrl("");
    setFileType("pdf");
    setIsActive(true);
    setSortOrder("0");
    setModalOpen(true);
  };

  const openEditDialog = (item: DocumentDto) => {
    setEditingItem(item);
    setCategoryId(item.categoryId);
    setCode(item.code ?? "");
    setTitleTh(item.titleTh);
    setTitleEn(item.titleEn);
    setDescriptionTh(item.descriptionTh ?? "");
    setDescriptionEn(item.descriptionEn ?? "");
    setFileUrl(item.fileUrl);
    setFileType(item.fileType);
    setIsActive(item.isActive);
    setSortOrder(String(item.sortOrder));
    setModalOpen(true);
  };

  const handleSave = () => {
    startTransition(async () => {
      const payload = {
        categoryId,
        code: code.trim() || undefined,
        titleTh: titleTh.trim(),
        titleEn: titleEn.trim(),
        descriptionTh: descriptionTh.trim() || undefined,
        descriptionEn: descriptionEn.trim() || undefined,
        fileUrl: fileUrl.trim(),
        fileType: fileType.trim().toLowerCase(),
        isActive,
        sortOrder: Number(sortOrder) || 0,
      };

      if (editingItem) {
        const res = await updateDocumentAction({ ...payload, id: editingItem.id });
        if (res.ok) {
          toast.success(t("documents.updateSuccess"));
          setModalOpen(false);
          await reloadData();
        } else {
          toast.error(res.error.message);
        }
      } else {
        const res = await createDocumentAction(payload);
        if (res.ok) {
          toast.success(t("documents.createSuccess"));
          setModalOpen(false);
          await reloadData();
        } else {
          toast.error(res.error.message);
        }
      }
    });
  };

  const handleDelete = (item: DocumentDto) => {
    startTransition(async () => {
      const res = await deleteDocumentAction(item.id);
      if (res.ok) {
        toast.success(t("documents.deleteSuccess"));
        setDeleteConfirmItem(null);
        await reloadData();
      } else {
        toast.error(res.error.message);
      }
    });
  };

  const filteredDocs = documents.filter((d) => {
    const matchCat = selectedCat === "ALL" || d.categoryId === selectedCat;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      d.titleTh.toLowerCase().includes(q) ||
      d.titleEn.toLowerCase().includes(q) ||
      (d.code && d.code.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const columns: DataTableColumn<DocumentDto>[] = [
    {
      key: "code",
      header: t("documents.code"),
      render: (row) => (
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted text-foreground border border-border">
          {row.code || "-"}
        </span>
      ),
    },
    {
      key: "title",
      header: t("documents.nameTh"),
      render: (row) => (
        <div>
          <div className="font-semibold text-foreground leading-snug">
            {locale === "th" ? row.titleTh : row.titleEn}
          </div>
          <div className="text-xs text-muted-foreground">{row.fileUrl}</div>
        </div>
      ),
    },
    {
      key: "category",
      header: t("documents.category"),
      render: (row) => (
        <span className="text-xs font-medium text-muted-foreground">
          {locale === "th" ? row.categoryNameTh : row.categoryNameEn}
        </span>
      ),
    },
    {
      key: "type",
      header: t("documents.fileType"),
      render: (row) => (
        <div className="text-xs">
          <span className="font-bold uppercase px-1.5 py-0.5 rounded bg-muted">
            {row.fileType}
          </span>
          <span className="text-muted-foreground ml-2">({row.downloadCount} downloads)</span>
        </div>
      ),
    },
    {
      key: "status",
      header: t("documents.status"),
      render: (row) =>
        row.isActive ? (
          <StatusPill tone="ok">{t("documents.active")}</StatusPill>
        ) : (
          <StatusPill tone="off">{t("documents.inactive")}</StatusPill>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("documents.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("documents.subtitle")}</p>
        </div>
        {canWrite && (
          <Button onClick={openCreateDialog} className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t("documents.create")}
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
                placeholder={t("documents.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="ALL">{t("documents.allCategories")}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {locale === "th" ? c.nameTh : c.nameEn}
                </option>
              ))}
            </select>
          </div>
          <div className="text-xs text-muted-foreground">
            {locale === "th" ? `พบทั้งหมด ${filteredDocs.length} ฉบับ` : `Total ${filteredDocs.length} documents`}
          </div>
        </div>

        {/* Table */}
        <DataTable<DocumentDto>
          state={filteredDocs.length === 0 ? "empty" : "data"}
          headHeading={t("documents.title")}
          columns={columns}
          rows={filteredDocs}
          getRowId={(item) => item.id}
          empty={{
            icon: <FileText className="h-10 w-10 text-muted-foreground" />,
            title: t("documents.empty"),
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
                      {t("documents.edit")}
                    </RowMenuItem>
                    {canManage && (
                      <RowMenuItem danger onSelect={() => setDeleteConfirmItem(item)} icon={<Trash2 className="h-4 w-4" />}>
                        {t("documents.delete")}
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
          title={editingItem ? t("documents.edit") : t("documents.create")}
          description="จัดการไฟล์เอกสารและแบบฟอร์มคำร้องสำหรับดาวน์โหลด"
        />
        <LiyonDialogBody className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("documents.category")} *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {locale === "th" ? c.nameTh : c.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("documents.code")}</label>
              <Input
                placeholder="เช่น FM-STD-01"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">{t("documents.nameTh")} *</label>
            <Input
              placeholder="เช่น แบบฟอร์มคำร้องทั่วไป"
              value={titleTh}
              onChange={(e) => setTitleTh(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">{t("documents.nameEn")} *</label>
            <Input
              placeholder="e.g. General Student Request Form"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold">{t("documents.fileUrl")} *</label>
              <Input
                placeholder="https://example.com/file.pdf"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("documents.fileType")} *</label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="pdf">PDF (.pdf)</option>
                <option value="docx">Word (.docx)</option>
                <option value="xlsx">Excel (.xlsx)</option>
                <option value="zip">ZIP Archive (.zip)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">{t("documents.descriptionTh")}</label>
            <textarea
              rows={2}
              value={descriptionTh}
              onChange={(e) => setDescriptionTh(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
              placeholder="คำอธิบายเพิ่มเติมเกี่ยวกับเอกสาร..."
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
              <span>{t("documents.active")}</span>
            </label>
          </div>
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setModalOpen(false)} disabled={isPending}>
            {t("documents.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "กำลังบันทึก..." : t("documents.save")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      {/* Delete Confirmation Dialog */}
      <LiyonDialog open={!!deleteConfirmItem} onOpenChange={(open) => !open && setDeleteConfirmItem(null)} danger>
        <LiyonDialogHeader
          title={t("documents.delete")}
          description={t("documents.deleteConfirm")}
        />
        <LiyonDialogBody>
          {deleteConfirmItem && (
            <div className="text-sm font-medium text-foreground">
              {deleteConfirmItem.code ? `[${deleteConfirmItem.code}] ` : ""}
              {locale === "th" ? deleteConfirmItem.titleTh : deleteConfirmItem.titleEn}
            </div>
          )}
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setDeleteConfirmItem(null)} disabled={isPending}>
            {t("documents.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteConfirmItem && handleDelete(deleteConfirmItem)}
            disabled={isPending}
          >
            {isPending ? "กำลังลบ..." : t("documents.delete")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>
    </div>
  );
}
