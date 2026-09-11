"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Newspaper, AlertCircle, Search, Pin, Eye } from "lucide-react";
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
import type { ArticleDto, ArticleCategoryDto } from "@/features/news";
import {
  createArticleAction,
  updateArticleAction,
  deleteArticleAction,
  getAdminArticlesAction,
} from "@/features/news/actions";

interface Props {
  initialArticles: ArticleDto[];
  categories: ArticleCategoryDto[];
  canWrite: boolean;
  canPublish: boolean;
  canManage: boolean;
}

export function NewsClient({ initialArticles, categories, canWrite, canPublish, canManage }: Props) {
  const t = useT();
  const locale = useLocale();
  const [articles, setArticles] = useState<ArticleDto[]>(initialArticles);
  const [isPending, startTransition] = useTransition();

  const [selectedCat, setSelectedCat] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ArticleDto | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<ArticleDto | null>(null);

  // Form states
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [titleTh, setTitleTh] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [slug, setSlug] = useState("");
  const [excerptTh, setExcerptTh] = useState("");
  const [excerptEn, setExcerptEn] = useState("");
  const [contentTh, setContentTh] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">("DRAFT");

  const reloadData = async () => {
    const res = await getAdminArticlesAction({
      categoryId: selectedCat === "ALL" ? undefined : selectedCat,
      status: selectedStatus === "ALL" ? undefined : selectedStatus,
    });
    if (res.ok) setArticles(res.data);
  };

  const autoGenerateSlug = (val: string) => {
    return val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  const openCreateDialog = () => {
    setEditingItem(null);
    setCategoryId(categories[0]?.id ?? "");
    setTitleTh("");
    setTitleEn("");
    setSlug("");
    setExcerptTh("");
    setExcerptEn("");
    setContentTh("");
    setContentEn("");
    setCoverImageUrl("");
    setIsPinned(false);
    setIsFeatured(false);
    setStatus("DRAFT");
    setModalOpen(true);
  };

  const openEditDialog = (item: ArticleDto) => {
    setEditingItem(item);
    setCategoryId(item.categoryId);
    setTitleTh(item.titleTh);
    setTitleEn(item.titleEn);
    setSlug(item.slug);
    setExcerptTh(item.excerptTh ?? "");
    setExcerptEn(item.excerptEn ?? "");
    setContentTh(item.contentTh);
    setContentEn(item.contentEn);
    setCoverImageUrl(item.coverImageUrl ?? "");
    setIsPinned(item.isPinned);
    setIsFeatured(item.isFeatured);
    setStatus(item.status as "DRAFT" | "PUBLISHED" | "ARCHIVED");
    setModalOpen(true);
  };

  const handleSave = () => {
    startTransition(async () => {
      const payload = {
        categoryId,
        titleTh: titleTh.trim(),
        titleEn: titleEn.trim(),
        slug: slug.trim() || autoGenerateSlug(titleEn) || `news-${Date.now()}`,
        excerptTh: excerptTh.trim() || null,
        excerptEn: excerptEn.trim() || null,
        contentTh: contentTh.trim(),
        contentEn: contentEn.trim(),
        coverImageUrl: coverImageUrl.trim() || null,
        isPinned,
        isFeatured,
        status,
      };

      if (editingItem) {
        const res = await updateArticleAction({ ...payload, id: editingItem.id });
        if (res.ok) {
          toast.success(t("news.updateSuccess"));
          setModalOpen(false);
          await reloadData();
        } else {
          toast.error(res.error.message);
        }
      } else {
        const res = await createArticleAction(payload);
        if (res.ok) {
          toast.success(t("news.createSuccess"));
          setModalOpen(false);
          await reloadData();
        } else {
          toast.error(res.error.message);
        }
      }
    });
  };

  const handleDelete = (item: ArticleDto) => {
    startTransition(async () => {
      const res = await deleteArticleAction(item.id);
      if (res.ok) {
        toast.success(t("news.deleteSuccess"));
        setDeleteConfirmItem(null);
        await reloadData();
      } else {
        toast.error(res.error.message);
      }
    });
  };

  const filteredArticles = articles.filter((a) => {
    const matchCat = selectedCat === "ALL" || a.categoryId === selectedCat;
    const matchStatus = selectedStatus === "ALL" || a.status === selectedStatus;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      a.titleTh.toLowerCase().includes(q) ||
      a.titleEn.toLowerCase().includes(q) ||
      a.slug.toLowerCase().includes(q);
    return matchCat && matchStatus && matchSearch;
  });

  const columns: DataTableColumn<ArticleDto>[] = [
    {
      key: "article",
      header: t("news.titleTh"),
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.coverImageUrl ? (
            <Image
              src={row.coverImageUrl}
              alt={row.titleTh || "Article cover"}
              width={64}
              height={48}
              unoptimized
              className="h-12 w-16 rounded object-cover border border-border shrink-0"
            />
          ) : (
            <div className="h-12 w-16 rounded bg-muted flex items-center justify-center border border-border shrink-0">
              <Newspaper className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              {row.isPinned && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                  <Pin className="h-3 w-3" /> ปักหมุด
                </span>
              )}
              <div className="font-medium text-foreground line-clamp-1">
                {locale === "th" ? row.titleTh : row.titleEn}
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              /{row.slug} • โดย {row.authorName}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: t("news.category"),
      render: (row) => (
        <span className="text-sm font-medium">
          {locale === "th" ? row.categoryNameTh : row.categoryNameEn}
        </span>
      ),
    },
    {
      key: "views",
      header: t("news.viewCount"),
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Eye className="h-3.5 w-3.5" />
          {row.viewCount.toLocaleString()}
        </div>
      ),
    },
    {
      key: "status",
      header: t("news.status"),
      render: (row) => {
        if (row.status === "PUBLISHED") {
          return <StatusPill tone="ok">{t("news.statusPublished")}</StatusPill>;
        }
        if (row.status === "ARCHIVED") {
          return <StatusPill tone="off">{t("news.statusArchived")}</StatusPill>;
        }
        return <StatusPill tone="warn">{t("news.statusDraft")}</StatusPill>;
      },
    },
    {
      key: "publishedAt",
      header: t("news.publishedAt"),
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.publishedAt ? formatDate(new Date(row.publishedAt), locale) : "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("news.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("news.subtitle")}</p>
        </div>
        {canWrite && (
          <Button onClick={openCreateDialog} className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t("news.create")}
          </Button>
        )}
      </div>

      <LiyonCard>
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาหัวข้อข่าว, slug..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <select
              value={selectedCat}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCat(e.target.value)}
              className="h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="ALL">{t("news.allCategories")}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {locale === "th" ? c.nameTh : c.nameEn}
                </option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value)}
              className="h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="ALL">ทุกสถานะ</option>
              <option value="PUBLISHED">{t("news.statusPublished")}</option>
              <option value="DRAFT">{t("news.statusDraft")}</option>
              <option value="ARCHIVED">{t("news.statusArchived")}</option>
            </select>
          </div>
          <div className="text-xs text-muted-foreground">
            พบทั้งหมด {filteredArticles.length} รายการ
          </div>
        </div>

        <DataTable<ArticleDto>
          state={filteredArticles.length === 0 ? "empty" : "data"}
          headHeading={t("news.title")}
          columns={columns}
          rows={filteredArticles}
          getRowId={(item) => item.id}
          empty={{
            icon: <Newspaper className="h-10 w-10 text-muted-foreground" />,
            title: t("news.empty"),
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
                      {t("news.edit")}
                    </RowMenuItem>
                    {canManage && (
                      <RowMenuItem danger onSelect={() => setDeleteConfirmItem(item)} icon={<Trash2 className="h-4 w-4" />}>
                        {t("news.delete")}
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
          title={editingItem ? t("news.edit") : t("news.create")}
          description="กรอกข้อมูลบทความหรือข่าวประชาสัมพันธ์ของคณะ"
        />
        <LiyonDialogBody className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("news.category")} *</label>
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
              <label className="text-xs font-semibold">{t("news.slug")} *</label>
              <Input
                placeholder="ai-symposium-2026"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">{t("news.titleTh")} *</label>
            <Input value={titleTh} onChange={(e) => setTitleTh(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">{t("news.titleEn")} *</label>
            <Input
              value={titleEn}
              onChange={(e) => {
                setTitleEn(e.target.value);
                if (!editingItem && !slug) {
                  setSlug(autoGenerateSlug(e.target.value));
                }
              }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">{t("news.excerptTh")}</label>
            <textarea
              className="w-full min-h-[60px] p-2 rounded-md border border-input bg-background text-sm"
              value={excerptTh}
              onChange={(e) => setExcerptTh(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">{t("news.contentTh")} *</label>
            <textarea
              className="w-full min-h-[120px] p-2 rounded-md border border-input bg-background text-sm"
              value={contentTh}
              onChange={(e) => setContentTh(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">{t("news.contentEn")} *</label>
            <textarea
              className="w-full min-h-[100px] p-2 rounded-md border border-input bg-background text-sm"
              value={contentEn}
              onChange={(e) => setContentEn(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">{t("news.coverImageUrl")}</label>
            <Input
              placeholder="https://example.com/banner.jpg"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("news.status")}</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED" | "ARCHIVED")}
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="DRAFT">{t("news.statusDraft")}</option>
                {canPublish && <option value="PUBLISHED">{t("news.statusPublished")}</option>}
                <option value="ARCHIVED">{t("news.statusArchived")}</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="isPinned"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="isPinned" className="text-sm font-medium cursor-pointer">
                {t("news.isPinned")}
              </label>
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="isFeatured" className="text-sm font-medium cursor-pointer">
                {t("news.isFeatured")}
              </label>
            </div>
          </div>
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setModalOpen(false)}>
            {t("news.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {t("news.save")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      {/* Delete Confirmation Dialog */}
      <LiyonDialog open={!!deleteConfirmItem} onOpenChange={(open) => !open && setDeleteConfirmItem(null)} danger>
        <LiyonDialogHeader
          title={t("news.delete")}
          description={t("news.deleteConfirm")}
        />
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setDeleteConfirmItem(null)}>
            {t("news.cancel")}
          </Button>
          <Button variant="destructive" onClick={() => deleteConfirmItem && handleDelete(deleteConfirmItem)} disabled={isPending}>
            {t("news.delete")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>
    </div>
  );
}
