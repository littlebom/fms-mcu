"use client";
import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LiyonCard, LiyonField, LiyonSelect, LiyonSwitchRow, PalettePicker } from "@/shared/components/liyon";
import { useT } from "@/shared/lib/i18n/client";
import type { PaletteId } from "@/shared/lib/palette";
import type { TenantSettings } from "@/features/identity";
import { updateSettingsAction, testSmtpAction } from "@/features/identity/actions";

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
  const [form, setForm] = useState({
    nameTh: initial.nameTh,
    nameEn: initial.nameEn,
    logoUrl: initial.logoUrl ?? "",
    palette: initial.palette as PaletteId,
    smtp: {
      enabled: initial.smtp?.enabled ?? false,
      host: initial.smtp?.host || "smtp.gmail.com",
      port: initial.smtp?.port || 465,
      secure: initial.smtp?.secure ?? true,
      user: initial.smtp?.user || "",
      pass: "",
      fromName: initial.smtp?.fromName || "",
      fromEmail: initial.smtp?.fromEmail || "",
      hasSavedPass: initial.smtp?.hasSavedPass ?? false,
    },
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [pending, start] = useTransition();

  // Test SMTP state
  const [testTo, setTestTo] = useState("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  function save() {
    start(async () => {
      const r = await updateSettingsAction(form);
      if (!r.ok) {
        setErrors(r.error.fieldErrors ?? {});
        if (!r.error.fieldErrors) toast.error(t(`error.${r.error.code}`));
        return;
      }
      setErrors({});
      toast.success(t("settings.saveOk"));
      router.refresh();
    });
  }

  async function handleTestSmtp() {
    if (!testTo.trim()) {
      toast.error(t("settings.smtpTestEmailRequired"));
      return;
    }
    if (!form.smtp.pass && !form.smtp.hasSavedPass) {
      toast.error(t("settings.smtpTestPassRequired"));
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testSmtpAction({
        host: form.smtp.host,
        port: form.smtp.port,
        secure: form.smtp.secure,
        user: form.smtp.user,
        pass: form.smtp.pass,
        fromName: form.smtp.fromName,
        fromEmail: form.smtp.fromEmail,
        to: testTo.trim(),
      });
      if (res.ok) {
        toast.success(t("settings.smtpTestSuccess"));
        setTestResult({ success: true, message: t("settings.smtpTestSuccess") });
      } else {
        let msg = res.error.fieldErrors?._form?.[0] || res.error.fieldErrors?.pass?.[0] || t("settings.smtpTestFail");
        if (msg.includes("535") || msg.includes("BadCredentials") || msg.includes("Username and Password not accepted")) {
          msg = `${t("settings.smtpBadCredentialsHint")}\n\n[Google Error: ${msg}]`;
        }
        toast.error(t("settings.smtpTestFail"));
        setTestResult({ success: false, message: msg });
      }
    } catch {
      toast.error(t("settings.smtpTestFail"));
      setTestResult({ success: false, message: t("settings.smtpTestFail") });
    } finally {
      setTesting(false);
    }
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

        {/* Gmail SMTP Card */}
        <LiyonCard>
          <h2>{t("settings.smtpTitle")}</h2>
          <p className="text-sm text-gray-500 mb-4">{t("settings.smtpDesc")}</p>

          <LiyonSwitchRow
            id="s-smtp-enabled"
            checked={form.smtp.enabled}
            onCheckedChange={(checked) => setForm({ ...form, smtp: { ...form.smtp, enabled: checked } })}
            label={t("settings.smtpEnabled")}
            description={t("settings.smtpEnabledDesc")}
          />

          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50/70 p-4 text-sm text-blue-900">
            <h4 className="font-semibold mb-1 flex items-center gap-1.5">
              <svg className="w-4 h-4 text-blue-600 inline shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t("settings.smtpHelpTitle")}
            </h4>
            <ul className="list-none space-y-1 text-xs text-blue-800 mt-2">
              <li>{t("settings.smtpHelpStep1")}</li>
              <li>
                {t("settings.smtpHelpStep2")}{" "}
                <a
                  href="https://myaccount.google.com/apppasswords"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline hover:text-blue-950 inline-flex items-center gap-0.5"
                >
                  myaccount.google.com/apppasswords &rarr;
                </a>
              </li>
              <li>{t("settings.smtpHelpStep3")}</li>
            </ul>
          </div>

          <div className="fields mt-4">
            <LiyonField label={t("settings.smtpHost")} htmlFor="s-smtp-host">
              <input
                id="s-smtp-host"
                value={form.smtp.host}
                onChange={(e) => setForm({ ...form, smtp: { ...form.smtp, host: e.target.value } })}
                placeholder="smtp.gmail.com"
              />
            </LiyonField>

            <LiyonField label={t("settings.smtpPort")} htmlFor="s-smtp-port">
              <LiyonSelect
                id="s-smtp-port"
                value={form.smtp.port}
                onChange={(e) => {
                  const port = Number(e.target.value);
                  setForm({
                    ...form,
                    smtp: {
                      ...form.smtp,
                      port,
                      secure: port === 465,
                    },
                  });
                }}
              >
                <option value={465}>{t("settings.smtpPortSsl")}</option>
                <option value={587}>{t("settings.smtpPortTls")}</option>
              </LiyonSelect>
            </LiyonField>

            <LiyonField
              label={t("settings.smtpUser")}
              htmlFor="s-smtp-user"
              hint={t("settings.smtpUserHint")}
              error={errors["smtp.user"]?.[0]}
            >
              <input
                id="s-smtp-user"
                type="email"
                value={form.smtp.user}
                onChange={(e) => setForm({ ...form, smtp: { ...form.smtp, user: e.target.value } })}
                placeholder="example@gmail.com"
              />
            </LiyonField>

            <LiyonField
              label={t("settings.smtpPass")}
              htmlFor="s-smtp-pass"
              hint={form.smtp.hasSavedPass && !form.smtp.pass ? t("settings.smtpPassKeep") : t("settings.smtpPassHint")}
              error={errors["smtp.pass"]?.[0]}
            >
              <input
                id="s-smtp-pass"
                type="password"
                value={form.smtp.pass}
                onChange={(e) => setForm({ ...form, smtp: { ...form.smtp, pass: e.target.value } })}
                placeholder={form.smtp.hasSavedPass ? "••••••••••••••••" : "abcd efgh ijkl mnop"}
                autoComplete="new-password"
              />
            </LiyonField>

            <LiyonField
              label={t("settings.smtpFromName")}
              htmlFor="s-smtp-from-name"
              hint={t("settings.smtpFromNameHint")}
            >
              <input
                id="s-smtp-from-name"
                value={form.smtp.fromName}
                onChange={(e) => setForm({ ...form, smtp: { ...form.smtp, fromName: e.target.value } })}
                placeholder="FMS Platform"
              />
            </LiyonField>

            <LiyonField
              label={t("settings.smtpFromEmail")}
              htmlFor="s-smtp-from-email"
              hint={t("settings.smtpFromEmailHint")}
              error={errors["smtp.fromEmail"]?.[0]}
            >
              <input
                id="s-smtp-from-email"
                type="email"
                value={form.smtp.fromEmail}
                onChange={(e) => setForm({ ...form, smtp: { ...form.smtp, fromEmail: e.target.value } })}
                placeholder={form.smtp.user || "example@gmail.com"}
              />
            </LiyonField>
          </div>

          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50/80 p-4">
            <h3 className="text-sm font-semibold text-gray-800">{t("settings.smtpTestTitle")}</h3>
            <p className="text-xs text-gray-500 mb-3">{t("settings.smtpTestDesc")}</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder={t("settings.smtpTestEmail")}
                value={testTo}
                onChange={(e) => setTestTo(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleTestSmtp}
                disabled={testing || !form.smtp.user}
                className="whitespace-nowrap"
              >
                {testing ? t("settings.smtpTesting") : t("settings.smtpTestBtn")}
              </Button>
            </div>
            {testResult && (
              <div
                className={`mt-3 rounded p-2.5 text-xs font-medium ${
                  testResult.success ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {testResult.message}
              </div>
            )}
          </div>
        </LiyonCard>

        <div className="savebar"><Button type="button" onClick={save} disabled={pending}>{t("common.save")}</Button></div>
      </div>
    </>
  );
}
