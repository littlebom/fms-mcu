import { cache } from "react";
import { prisma, type Db } from "@/shared/lib/infra/prisma";
import { DEFAULT_PALETTE, isPalette, type PaletteId } from "@/shared/lib/palette";
import { errors } from "@/shared/lib/errors";
import { writeAudit } from "../audit";
import type { UpdateSettingsInput } from "../validations/settings";

export interface TenantSmtpSettings {
  enabled: boolean;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass?: string;
  fromName: string;
  fromEmail: string;
  hasSavedPass?: boolean;
}

export interface TenantSettings {
  code: string;
  nameTh: string;
  nameEn: string;
  logoUrl: string | null;
  palette: PaletteId;
  smtp?: TenantSmtpSettings;
}

async function readTenantSettings(tenantId: string, db: Db): Promise<TenantSettings> {
  const t = await db.tenant.findUnique({ where: { id: tenantId } });
  if (!t) throw errors.not_found();
  const s = (t.settings as { palette?: unknown; smtp?: { enabled?: boolean; host?: string; port?: number; secure?: boolean; user?: string; pass?: string; fromName?: string; fromEmail?: string } }) || {};
  const p = s.palette;
  const smtpRaw = s.smtp;
  return {
    code: t.code,
    nameTh: t.nameTh,
    nameEn: t.nameEn,
    logoUrl: t.logoUrl,
    palette: isPalette(p) ? p : DEFAULT_PALETTE,
    smtp: {
      enabled: Boolean(smtpRaw?.enabled),
      host: smtpRaw?.host || "smtp.gmail.com",
      port: Number(smtpRaw?.port) || 465,
      secure: smtpRaw?.secure ?? true,
      user: smtpRaw?.user || "",
      pass: "",
      fromName: smtpRaw?.fromName || "",
      fromEmail: smtpRaw?.fromEmail || "",
      hasSavedPass: Boolean(smtpRaw?.pass && smtpRaw.pass.length > 0),
    },
  };
}

export async function getTenantSettings(tenantId: string): Promise<TenantSettings> {
  return readTenantSettings(tenantId, prisma);
}

export async function getTenantSmtpConfig(tenantId: string) {
  const t = await prisma.tenant.findUnique({ where: { id: tenantId }, select: { settings: true } });
  const s = (t?.settings as { smtp?: { enabled?: boolean; host?: string; port?: number; secure?: boolean; user?: string; pass?: string; fromName?: string; fromEmail?: string } })?.smtp;
  if (!s) return null;
  return {
    enabled: Boolean(s.enabled),
    host: s.host || "smtp.gmail.com",
    port: Number(s.port) || 465,
    secure: s.secure ?? true,
    user: s.user || "",
    pass: s.pass || "",
    fromName: s.fromName || "",
    fromEmail: s.fromEmail || "",
  };
}

/** เก็บคีย์อื่น ๆ ใน settings JSON ไว้ทั้งหมด — merge เฉพาะ palette และ smtp ที่เปลี่ยน ไม่ทับทั้งก้อน */
export async function updateTenantSettings(input: { tenantId: string; actorId: string } & UpdateSettingsInput): Promise<void> {
  await prisma.$transaction(async (tx) => {
    // อ่านผ่าน tx เดียวกัน ไม่ใช่ client กลาง
    const before = await readTenantSettings(input.tenantId, tx);
    const t = await tx.tenant.findUniqueOrThrow({ where: { id: input.tenantId }, select: { settings: true } });
    const currentSettings = (t.settings as { palette?: unknown; smtp?: { enabled?: boolean; host?: string; port?: number; secure?: boolean; user?: string; pass?: string; fromName?: string; fromEmail?: string } }) || {};

    let newSmtp = currentSettings.smtp;
    if (input.smtp) {
      newSmtp = {
        enabled: input.smtp.enabled,
        host: input.smtp.host || "smtp.gmail.com",
        port: input.smtp.port || 465,
        secure: input.smtp.secure ?? true,
        user: input.smtp.user?.trim() || "",
        pass: input.smtp.pass && input.smtp.pass.trim() !== ""
          ? (input.smtp.host.includes("gmail") ? input.smtp.pass.replace(/\s+/g, "") : input.smtp.pass.trim())
          : (currentSettings.smtp?.pass || ""),
        fromName: input.smtp.fromName?.trim() || "",
        fromEmail: input.smtp.fromEmail?.trim() || input.smtp.user?.trim() || "",
      };
    }

    const updatedSettings = {
      ...currentSettings,
      palette: input.palette,
      smtp: newSmtp,
    };

    await tx.tenant.update({
      where: { id: input.tenantId },
      data: {
        nameTh: input.nameTh,
        nameEn: input.nameEn,
        logoUrl: input.logoUrl || null,
        settings: updatedSettings as object,
      },
    });

    const auditBefore = { ...before, smtp: before.smtp ? { ...before.smtp, pass: "***" } : undefined };
    const auditAfter = { ...input, smtp: input.smtp ? { ...input.smtp, pass: input.smtp.pass ? "***" : "(unchanged)" } : undefined };
    await writeAudit({
      tenantId: input.tenantId,
      actorId: input.actorId,
      action: "tenant.settings_update",
      entity: "tenant",
      entityId: input.tenantId,
      before: auditBefore,
      after: auditAfter,
    }, tx);
  });
}

export async function getTenantPalette(tenantId: string): Promise<PaletteId> {
  const t = await prisma.tenant.findUnique({ where: { id: tenantId }, select: { settings: true } });
  const p = (t?.settings as { palette?: unknown } | null)?.palette;
  return isPalette(p) ? p : DEFAULT_PALETTE;
}

/**
 * tenant ของ session ถ้ามี — import แบบ dynamic เพราะ `../auth` ดึง next-auth ทั้งก้อนเข้ามา และ
 * โมดูลนี้ถูก import จาก root layout ที่รันทุก request · แยก try ของตัวเองไว้ต่างหากโดยเจตนา: เดิมมันอยู่
 * ใน try เดียวกับการอ่านฐานข้อมูล ทำให้ "โหลด auth ไม่ได้" กับ "ฐานข้อมูลล้ม" กลืนหายไปเป็นค่าเดียวกัน
 * และเส้นทางอ่าน tenant ทั้งเส้นทดสอบไม่ได้เลย (ในสภาพแวดล้อมเทสต์ next-auth resolve ไม่ผ่าน)
 */
async function sessionTenantId(): Promise<string | null> {
  try {
    const { auth } = await import("../auth");
    return (await auth())?.tenantId || null;
  } catch {
    return null;
  }
}

/** ใช้โดย root layout ทุก request — tenant จาก session ถ้ามี ไม่งั้น tenant แรก (หน้า login ยังไม่มี session) · ไม่ throw */
export const resolvePalette = cache(async (): Promise<PaletteId> => {
  try {
    const tenantId = (await sessionTenantId()) || (await prisma.tenant.findFirst({ orderBy: { createdAt: "asc" }, select: { id: true } }))?.id;
    return tenantId ? await getTenantPalette(tenantId) : DEFAULT_PALETTE;
  } catch {
    return DEFAULT_PALETTE;
  }
});

export async function resolveDefaultTenantId(): Promise<string> {
  const tenant = await prisma.tenant.findFirst({ orderBy: { createdAt: "asc" }, select: { id: true } });
  if (!tenant) throw errors.internal("No tenant configured");
  return tenant.id;
}

export const resolveTenantSettings = cache(async (): Promise<TenantSettings | null> => {
  try {
    const tenantId = (await sessionTenantId()) || (await prisma.tenant.findFirst({ orderBy: { createdAt: "asc" }, select: { id: true } }))?.id;
    return tenantId ? await getTenantSettings(tenantId) : null;
  } catch {
    return null;
  }
});

