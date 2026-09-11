"use server";
import { revalidatePath } from "next/cache";
import { runAction, type ActionResult } from "@/shared/lib/result";
import { getLocale } from "@/shared/lib/i18n/server";
import { zodErrorMap } from "@/shared/lib/i18n/zod-locale";
import { testSmtp } from "@/shared/lib/infra/mailer";
import { errors } from "@/shared/lib/errors";
import { P } from "../../permissions";
import { requirePermission } from "../rbac";
import { updateSettingsSchema, testSmtpInputSchema } from "../validations/settings";
import { getTenantSettings, updateTenantSettings, getTenantSmtpConfig, type TenantSettings } from "../services/tenant.service";

export async function getSettingsAction(): Promise<ActionResult<TenantSettings>> {
  return runAction(async () => getTenantSettings((await requirePermission(P.settingsManage)).tenantId));
}
export async function updateSettingsAction(input: unknown): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(P.settingsManage);
    await updateTenantSettings({ tenantId: ctx.tenantId, actorId: ctx.userId, ...updateSettingsSchema.parse(input, { error: zodErrorMap(await getLocale()) }) });
    revalidatePath("/", "layout");
    revalidatePath("/(portal)", "layout");
    revalidatePath("/(admin)", "layout");
    revalidatePath("/");
    revalidatePath("/settings");
  });
}

export async function testSmtpAction(input: unknown): Promise<ActionResult<{ success: boolean; message?: string }>> {
  return runAction(async () => {
    const ctx = await requirePermission(P.settingsManage);
    const locale = await getLocale();
    const data = testSmtpInputSchema.parse(input, { error: zodErrorMap(locale) });

    let pass = data.pass;
    if (!pass) {
      const stored = await getTenantSmtpConfig(ctx.tenantId);
      pass = stored?.pass || "";
    }
    if (!pass) {
      throw errors.validation("smtp_pass_required", { pass: [locale === "th" ? "กรุณากรอกรหัสผ่าน App Password ก่อนทดสอบ" : "Please provide App Password before testing"] });
    }

    const cleanPass = (data.host.includes("gmail") ? pass.replace(/\s+/g, "") : pass).trim();
    const cleanUser = data.user.trim();
    const cleanFrom = data.fromName
      ? `"${data.fromName.trim()}" <${(data.fromEmail || cleanUser).trim()}>`
      : (data.fromEmail || cleanUser).trim();

    const result = await testSmtp({
      host: data.host.trim(),
      port: data.port,
      secure: data.secure,
      user: cleanUser,
      pass: cleanPass,
      from: cleanFrom,
    }, data.to.trim());

    if (!result.success) {
      throw errors.validation("smtp_test_failed", { _form: [result.message || (locale === "th" ? "เชื่อมต่อ SMTP ไม่สำเร็จ" : "SMTP connection failed")] });
    }

    return result;
  });
}
