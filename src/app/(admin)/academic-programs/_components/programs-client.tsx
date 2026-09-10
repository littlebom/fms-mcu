"use client";

import { useState, useTransition } from "react";
import { Plus, Edit2, Trash2, BookOpen, AlertCircle, Search } from "lucide-react";
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
import type { DegreeLevel, StudyType } from "@/generated/prisma";
import type { ProgramDto } from "@/features/curriculum";
import type { DepartmentDto } from "@/features/staff";
import {
  createProgramAction,
  updateProgramAction,
  deleteProgramAction,
  getAdminProgramsAction,
} from "@/features/curriculum/actions";

interface Props {
  initialPrograms: ProgramDto[];
  departments: DepartmentDto[];
  canWrite: boolean;
  canManage: boolean;
}

export function ProgramsClient({ initialPrograms, departments, canWrite, canManage }: Props) {
  const t = useT();
  const locale = useLocale();
  const [programs, setPrograms] = useState<ProgramDto[]>(initialPrograms);
  const [isPending, startTransition] = useTransition();

  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [selectedDept, setSelectedDept] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProgramDto | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<ProgramDto | null>(null);

  // Form states
  const [departmentId, setDepartmentId] = useState(departments[0]?.id ?? "");
  const [code, setCode] = useState("");
  const [degreeLevel, setDegreeLevel] = useState<DegreeLevel>("BACHELOR");
  const [studyType, setStudyType] = useState<StudyType>("REGULAR");
  const [nameTh, setNameTh] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [degreeNameTh, setDegreeNameTh] = useState("");
  const [degreeNameEn, setDegreeNameEn] = useState("");
  const [totalCredits, setTotalCredits] = useState("132");
  const [durationYears, setDurationYears] = useState("4");
  const [tuitionFee, setTuitionFee] = useState("");
  const [descriptionTh, setDescriptionTh] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [philosophyTh, setPhilosophyTh] = useState("");
  const [philosophyEn, setPhilosophyEn] = useState("");
  const [careerPathsStr, setCareerPathsStr] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [brochureUrl, setBrochureUrl] = useState("");
  const [curriculumPdfUrl, setCurriculumPdfUrl] = useState("");
  const [applicationUrl, setApplicationUrl] = useState("");
  const [isOpenAdmissions, setIsOpenAdmissions] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState("0");

  const reloadData = async () => {
    const res = await getAdminProgramsAction();
    if (res.ok) setPrograms(res.data);
  };

  const openCreateDialog = () => {
    setEditingItem(null);
    setDepartmentId(departments[0]?.id ?? "");
    setCode("");
    setDegreeLevel("BACHELOR");
    setStudyType("REGULAR");
    setNameTh("");
    setNameEn("");
    setDegreeNameTh("");
    setDegreeNameEn("");
    setTotalCredits("132");
    setDurationYears("4");
    setTuitionFee("");
    setDescriptionTh("");
    setDescriptionEn("");
    setPhilosophyTh("");
    setPhilosophyEn("");
    setCareerPathsStr("");
    setCoverImageUrl("");
    setBrochureUrl("");
    setCurriculumPdfUrl("");
    setApplicationUrl("");
    setIsOpenAdmissions(true);
    setIsActive(true);
    setSortOrder("0");
    setModalOpen(true);
  };

  const openEditDialog = (item: ProgramDto) => {
    setEditingItem(item);
    setDepartmentId(item.departmentId);
    setCode(item.code);
    setDegreeLevel(item.degreeLevel);
    setStudyType(item.studyType);
    setNameTh(item.nameTh);
    setNameEn(item.nameEn);
    setDegreeNameTh(item.degreeNameTh);
    setDegreeNameEn(item.degreeNameEn);
    setTotalCredits(String(item.totalCredits));
    setDurationYears(String(item.durationYears));
    setTuitionFee(item.tuitionFee ?? "");
    setDescriptionTh(item.descriptionTh ?? "");
    setDescriptionEn(item.descriptionEn ?? "");
    setPhilosophyTh(item.philosophyTh ?? "");
    setPhilosophyEn(item.philosophyEn ?? "");
    setCareerPathsStr(item.careerPaths.join(", "));
    setCoverImageUrl(item.coverImageUrl ?? "");
    setBrochureUrl(item.brochureUrl ?? "");
    setCurriculumPdfUrl(item.curriculumPdfUrl ?? "");
    setApplicationUrl(item.applicationUrl ?? "");
    setIsOpenAdmissions(item.isOpenAdmissions);
    setIsActive(item.isActive);
    setSortOrder(String(item.sortOrder));
    setModalOpen(true);
  };

  const handleSave = () => {
    startTransition(async () => {
      const careerPaths = careerPathsStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        departmentId,
        code: code.trim().toLowerCase(),
        degreeLevel,
        studyType,
        nameTh: nameTh.trim(),
        nameEn: nameEn.trim(),
        degreeNameTh: degreeNameTh.trim(),
        degreeNameEn: degreeNameEn.trim(),
        totalCredits: Number(totalCredits) || 120,
        durationYears: Number(durationYears) || 4,
        tuitionFee: tuitionFee.trim() || undefined,
        descriptionTh: descriptionTh.trim() || undefined,
        descriptionEn: descriptionEn.trim() || undefined,
        philosophyTh: philosophyTh.trim() || undefined,
        philosophyEn: philosophyEn.trim() || undefined,
        careerPaths,
        coverImageUrl: coverImageUrl.trim() || undefined,
        brochureUrl: brochureUrl.trim() || undefined,
        curriculumPdfUrl: curriculumPdfUrl.trim() || undefined,
        applicationUrl: applicationUrl.trim() || undefined,
        isOpenAdmissions,
        isActive,
        sortOrder: Number(sortOrder) || 0,
      };

      if (editingItem) {
        const res = await updateProgramAction({ ...payload, id: editingItem.id });
        if (res.ok) {
          toast.success(t("curriculum.updateSuccess"));
          setModalOpen(false);
          await reloadData();
        } else {
          toast.error(res.error.message);
        }
      } else {
        const res = await createProgramAction(payload);
        if (res.ok) {
          toast.success(t("curriculum.createSuccess"));
          setModalOpen(false);
          await reloadData();
        } else {
          toast.error(res.error.message);
        }
      }
    });
  };

  const handleDelete = (item: ProgramDto) => {
    startTransition(async () => {
      const res = await deleteProgramAction(item.id);
      if (res.ok) {
        toast.success(t("curriculum.deleteSuccess"));
        setDeleteConfirmItem(null);
        await reloadData();
      } else {
        toast.error(res.error.message);
      }
    });
  };

  const filteredPrograms = programs.filter((p) => {
    const matchLevel = selectedLevel === "ALL" || p.degreeLevel === selectedLevel;
    const matchDept = selectedDept === "ALL" || p.departmentId === selectedDept;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      p.code.toLowerCase().includes(q) ||
      p.nameTh.toLowerCase().includes(q) ||
      p.nameEn.toLowerCase().includes(q) ||
      p.degreeNameTh.toLowerCase().includes(q);
    return matchLevel && matchDept && matchSearch;
  });

  const columns: DataTableColumn<ProgramDto>[] = [
    {
      key: "code",
      header: t("curriculum.code"),
      render: (row) => (
        <div>
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted text-foreground border border-border">
            {row.code.toUpperCase()}
          </span>
        </div>
      ),
    },
    {
      key: "name",
      header: t("curriculum.nameTh"),
      render: (row) => (
        <div>
          <div className="font-semibold text-foreground leading-snug">
            {locale === "th" ? row.nameTh : row.nameEn}
          </div>
          <div className="text-xs text-muted-foreground">
            {locale === "th" ? row.degreeNameTh : row.degreeNameEn}
          </div>
        </div>
      ),
    },
    {
      key: "level",
      header: t("curriculum.degreeLevel"),
      render: (row) => {
        const levelLabel =
          row.degreeLevel === "BACHELOR"
            ? t("curriculum.bachelor")
            : row.degreeLevel === "MASTER"
            ? t("curriculum.master")
            : t("curriculum.doctoral");

        const typeLabel =
          row.studyType === "INTERNATIONAL"
            ? t("curriculum.international")
            : row.studyType === "SPECIAL"
            ? t("curriculum.special")
            : t("curriculum.regular");

        return (
          <div>
            <div className="text-xs font-semibold text-foreground">{levelLabel}</div>
            <div className="text-[11px] text-muted-foreground">{typeLabel}</div>
          </div>
        );
      },
    },
    {
      key: "department",
      header: t("curriculum.department"),
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {locale === "th" ? row.departmentNameTh : row.departmentNameEn}
        </span>
      ),
    },
    {
      key: "credits",
      header: t("curriculum.totalCredits"),
      render: (row) => (
        <div className="text-xs">
          <span className="font-bold">{row.totalCredits}</span> {t("curriculum.credits")} ({row.durationYears} {t("curriculum.years")})
          {row.tuitionFee && (
            <div className="text-muted-foreground text-[11px]">{row.tuitionFee}</div>
          )}
        </div>
      ),
    },
    {
      key: "admissions",
      header: t("curriculum.isOpenAdmissions"),
      render: (row) =>
        row.isOpenAdmissions ? (
          <StatusPill tone="ok">{t("curriculum.openAdmissions")}</StatusPill>
        ) : (
          <StatusPill tone="off">{t("curriculum.closedAdmissions")}</StatusPill>
        ),
    },
    {
      key: "status",
      header: t("curriculum.status"),
      render: (row) =>
        row.isActive ? (
          <StatusPill tone="ok">{t("curriculum.active")}</StatusPill>
        ) : (
          <StatusPill tone="off">{t("curriculum.inactive")}</StatusPill>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("curriculum.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("curriculum.subtitle")}</p>
        </div>
        {canWrite && (
          <Button onClick={openCreateDialog} className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t("curriculum.create")}
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
                placeholder="ค้นหารหัส, ชื่อหลักสูตร..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="ALL">{t("curriculum.degreeLevelAll")}</option>
              <option value="BACHELOR">{t("curriculum.bachelor")}</option>
              <option value="MASTER">{t("curriculum.master")}</option>
              <option value="DOCTORAL">{t("curriculum.doctoral")}</option>
            </select>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="ALL">{locale === "th" ? "ทุกภาควิชา" : "All Departments"}</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {locale === "th" ? d.nameTh : d.nameEn}
                </option>
              ))}
            </select>
          </div>
          <div className="text-xs text-muted-foreground">
            {locale === "th" ? `พบทั้งหมด ${filteredPrograms.length} หลักสูตร` : `Total ${filteredPrograms.length} programs`}
          </div>
        </div>

        {/* Table */}
        <DataTable<ProgramDto>
          state={filteredPrograms.length === 0 ? "empty" : "data"}
          headHeading={t("curriculum.title")}
          columns={columns}
          rows={filteredPrograms}
          getRowId={(item) => item.id}
          empty={{
            icon: <BookOpen className="h-10 w-10 text-muted-foreground" />,
            title: t("curriculum.empty"),
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
                      {t("curriculum.edit")}
                    </RowMenuItem>
                    {canManage && (
                      <RowMenuItem danger onSelect={() => setDeleteConfirmItem(item)} icon={<Trash2 className="h-4 w-4" />}>
                        {t("curriculum.delete")}
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
          title={editingItem ? t("curriculum.edit") : t("curriculum.create")}
          description="จัดการรายละเอียดโครงสร้างหลักสูตร เกณฑ์ และเอกสารประกอบ"
        />
        <LiyonDialogBody className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("curriculum.code")} *</label>
              <Input
                placeholder="เช่น cs-bsc"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("curriculum.degreeLevel")} *</label>
              <select
                value={degreeLevel}
                onChange={(e) => setDegreeLevel(e.target.value as DegreeLevel)}
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="BACHELOR">{t("curriculum.bachelor")}</option>
                <option value="MASTER">{t("curriculum.master")}</option>
                <option value="DOCTORAL">{t("curriculum.doctoral")}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("curriculum.studyType")} *</label>
              <select
                value={studyType}
                onChange={(e) => setStudyType(e.target.value as StudyType)}
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="REGULAR">{t("curriculum.regular")}</option>
                <option value="SPECIAL">{t("curriculum.special")}</option>
                <option value="INTERNATIONAL">{t("curriculum.international")}</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">{t("curriculum.department")} *</label>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("curriculum.nameTh")} *</label>
              <Input
                placeholder="เช่น หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชาวิทยาการคอมพิวเตอร์"
                value={nameTh}
                onChange={(e) => setNameTh(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("curriculum.nameEn")} *</label>
              <Input
                placeholder="e.g. Bachelor of Science in Computer Science"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("curriculum.degreeNameTh")} *</label>
              <Input
                placeholder="เช่น วท.บ. (วิทยาการคอมพิวเตอร์)"
                value={degreeNameTh}
                onChange={(e) => setDegreeNameTh(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("curriculum.degreeNameEn")} *</label>
              <Input
                placeholder="e.g. B.Sc. (Computer Science)"
                value={degreeNameEn}
                onChange={(e) => setDegreeNameEn(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("curriculum.totalCredits")} *</label>
              <Input
                type="number"
                value={totalCredits}
                onChange={(e) => setTotalCredits(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("curriculum.durationYears")} *</label>
              <Input
                type="number"
                step="0.5"
                value={durationYears}
                onChange={(e) => setDurationYears(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("curriculum.tuitionFee")}</label>
              <Input
                placeholder="เช่น 24,000 บาท/ภาคการศึกษา"
                value={tuitionFee}
                onChange={(e) => setTuitionFee(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">{t("curriculum.philosophyTh")}</label>
            <textarea
              rows={3}
              value={philosophyTh}
              onChange={(e) => setPhilosophyTh(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
              placeholder="ปรัชญาและความสำคัญของหลักสูตร..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">{t("curriculum.careerPaths")}</label>
            <Input
              placeholder="คั่นด้วยเครื่องหมายจุลภาค เช่น Software Engineer, AI Specialist, Data Scientist"
              value={careerPathsStr}
              onChange={(e) => setCareerPathsStr(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("curriculum.curriculumPdfUrl")}</label>
              <Input
                placeholder="https://..."
                value={curriculumPdfUrl}
                onChange={(e) => setCurriculumPdfUrl(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">{t("curriculum.applicationUrl")}</label>
              <Input
                placeholder="https://admissions...."
                value={applicationUrl}
                onChange={(e) => setApplicationUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={isOpenAdmissions}
                onChange={(e) => setIsOpenAdmissions(e.target.checked)}
                className="rounded border-input text-primary focus:ring-primary"
              />
              <span>{t("curriculum.openAdmissions")}</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-input text-primary focus:ring-primary"
              />
              <span>{t("curriculum.active")}</span>
            </label>
          </div>
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setModalOpen(false)} disabled={isPending}>
            {t("curriculum.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "กำลังบันทึก..." : t("curriculum.save")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      {/* Delete Confirmation Dialog */}
      <LiyonDialog open={!!deleteConfirmItem} onOpenChange={(open) => !open && setDeleteConfirmItem(null)} danger>
        <LiyonDialogHeader
          title={t("curriculum.delete")}
          description={t("curriculum.deleteConfirm")}
        />
        <LiyonDialogBody>
          {deleteConfirmItem && (
            <div className="text-sm font-medium text-foreground">
              {deleteConfirmItem.code.toUpperCase()} - {locale === "th" ? deleteConfirmItem.nameTh : deleteConfirmItem.nameEn}
            </div>
          )}
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setDeleteConfirmItem(null)} disabled={isPending}>
            {t("curriculum.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteConfirmItem && handleDelete(deleteConfirmItem)}
            disabled={isPending}
          >
            {isPending ? "กำลังลบ..." : t("curriculum.delete")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>
    </div>
  );
}
