"use client";
import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LiyonCard, LiyonField, PalettePicker } from "@/shared/components/liyon";
import { useT } from "@/shared/lib/i18n/client";
import type { PaletteId } from "@/shared/lib/palette";
import type { TenantSettings } from "@/features/identity";
import { updateSettingsAction } from "@/features/identity/actions";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

interface LogoUploaderProps {
  currentUrl: string;
  onUpload: (url: string) => void;
}

function LogoUploader({ currentUrl, onUpload }: LogoUploaderProps) {
  const t = useT();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  async function processFile(file: File) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(t("settings.uploadBadType"));
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error(t("settings.uploadTooLarge"));
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload/logo", { method: "POST", body: fd });
      if (!res.ok) {
        toast.error(t("settings.uploadFail"));
        return;
      }
      const { url } = (await res.json()) as { url: string };
      onUpload(url);
    } catch {
      toast.error(t("settings.uploadFail"));
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void processFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void processFile(file);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Preview โลโก้ปัจจุบัน */}
      {currentUrl && (
        <div className="flex items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3">
          <Image
            src={currentUrl}
            alt={t("settings.logoPreview")}
            width={120}
            height={60}
            style={{ objectFit: "contain", maxWidth: "120px", height: "60px", width: "auto" }}
            unoptimized={currentUrl.startsWith("/")}
          />
          <span className="text-sm text-gray-500">{t("settings.logoPreview")}</span>
        </div>
      )}

      {/* Drop zone + Browse button */}
      <div
        role="button"
        tabIndex={0}
        aria-label={t("settings.logoUpload")}
        onClick={() => !uploading && fileRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && !uploading && fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={[
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-6 text-center transition-colors",
          dragOver
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50",
          uploading ? "pointer-events-none opacity-60" : "",
        ].join(" ")}
      >
        {uploading ? (
          <span className="text-sm text-gray-500">{t("settings.uploading")}</span>
        ) : (
          <>
            {/* Upload icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            <div>
              <span className="font-medium text-blue-600 underline underline-offset-2">
                {t("settings.logoUpload")}
              </span>
              <span className="ml-1 text-sm text-gray-500">หรือลากมาวางที่นี่</span>
            </div>
            <p className="text-xs text-gray-400">{t("settings.logoUploadHint")}</p>
          </>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden="true"
      />
    </div>
  );
}

export function SettingsForm({ initial }: { initial: TenantSettings }) {
  const t = useT();
  const router = useRouter();
  const [form, setForm] = useState({ nameTh: initial.nameTh, nameEn: initial.nameEn, logoUrl: initial.logoUrl ?? "", palette: initial.palette as PaletteId });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [pending, start] = useTransition();

  function save() {
    start(async () => {
      const r = await updateSettingsAction(form);
      if (!r.ok) { setErrors(r.error.fieldErrors ?? {}); if (!r.error.fieldErrors) toast.error(t(`error.${r.error.code}`)); return; }
      setErrors({});
      toast.success(t("settings.saveOk"));
      router.refresh();
    });
  }

  return (
    <>
      <header className="ph"><h1>{t("settings.title")}</h1></header>
      <div className="set-cards">
        <LiyonCard>
          <h2>{t("settings.orgTitle")}</h2>
          <div className="fields">
            <LiyonField label={t("settings.nameTh")} htmlFor="s-name-th" error={errors.nameTh?.[0]}><input id="s-name-th" value={form.nameTh} onChange={(e) => setForm({ ...form, nameTh: e.target.value })} /></LiyonField>
            <LiyonField label={t("settings.nameEn")} htmlFor="s-name-en" error={errors.nameEn?.[0]}><input id="s-name-en" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} /></LiyonField>
            <LiyonField label={t("settings.logoUrl")} htmlFor="s-logo" hint={t("common.optional")} error={errors.logoUrl?.[0]}>
              <LogoUploader currentUrl={form.logoUrl} onUpload={(url) => setForm({ ...form, logoUrl: url })} />
              <input id="s-logo" type="url" value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} placeholder="https://..." />
            </LiyonField>
          </div>
        </LiyonCard>
        <LiyonCard>
          <h2>{t("settings.brandTitle")}</h2>
          <p>{t("settings.brandDesc")}</p>
          <PalettePicker value={form.palette} onChange={(p) => setForm({ ...form, palette: p })} label={t("settings.paletteLabel")} />
          {form.palette === "coral" && <p className="warn" role="note">{t("settings.coralWarn")}</p>}
        </LiyonCard>
        <div className="savebar"><Button type="button" onClick={save} disabled={pending}>{t("common.save")}</Button></div>
      </div>
    </>
  );
}
