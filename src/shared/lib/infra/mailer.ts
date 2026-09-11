import "server-only";
import nodemailer from "nodemailer";
import { env, smtpConfigured } from "./env";
import { logger } from "./logger";
import { prisma } from "./prisma";

export interface MailInput { to: string; subject: string; text: string; html?: string }

export interface SmtpConfig {
  host: string;
  port: number;
  secure?: boolean;
  user?: string;
  pass?: string;
  from?: string;
}

export async function getEffectiveSmtpConfig(custom?: SmtpConfig): Promise<SmtpConfig | null> {
  if (custom) return custom;
  try {
    const tenant = await prisma.tenant.findFirst({
      where: { isActive: true },
      select: { settings: true },
      orderBy: { createdAt: "asc" },
    });
    const s = tenant?.settings as { smtp?: { enabled?: boolean; host?: string; port?: number; secure?: boolean; user?: string; pass?: string; fromName?: string; fromEmail?: string } } | null;
    if (s?.smtp?.enabled && s.smtp.host && s.smtp.user && s.smtp.pass) {
      const from = s.smtp.fromName
        ? `"${s.smtp.fromName}" <${s.smtp.fromEmail || s.smtp.user}>`
        : (s.smtp.fromEmail || s.smtp.user);
      return {
        host: s.smtp.host,
        port: Number(s.smtp.port) || 465,
        secure: s.smtp.secure ?? (Number(s.smtp.port) === 465),
        user: s.smtp.user,
        pass: s.smtp.pass,
        from,
      };
    }
  } catch {
    // If DB is unavailable or table empty, fallback to env
  }

  if (smtpConfigured()) {
    const e = env();
    return {
      host: e.SMTP_HOST,
      port: e.SMTP_PORT,
      secure: e.SMTP_PORT === 465,
      user: e.SMTP_USER || undefined,
      pass: e.SMTP_PASS || undefined,
      from: e.SMTP_FROM,
    };
  }

  return null;
}

/** ไม่มี SMTP → เขียนลง log ระดับ info แล้วคืน delivered:false — ระบบต้องไม่ล้มเพราะส่งอีเมลไม่ได้ */
export async function sendMail(input: MailInput, customSmtp?: SmtpConfig): Promise<{ delivered: boolean }> {
  const config = await getEffectiveSmtpConfig(customSmtp);
  if (!config) {
    logger.info("mail (no SMTP, logged only)", { to: input.to, subject: input.subject, text: input.text });
    return { delivered: false };
  }
  try {
    const transport = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure ?? (config.port === 465),
      auth: config.user ? { user: config.user, pass: config.pass } : undefined,
    });
    await transport.sendMail({
      from: config.from || config.user || "no-reply@localhost",
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });
    return { delivered: true };
  } catch (err) {
    logger.error("mail send failed", { to: input.to, err: err instanceof Error ? err.message : String(err) });
    return { delivered: false };
  }
}

export async function testSmtp(config: SmtpConfig, to: string): Promise<{ success: boolean; message?: string }> {
  try {
    const transport = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure ?? (config.port === 465),
      auth: config.user ? { user: config.user, pass: config.pass } : undefined,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
    });
    await transport.verify();
    await transport.sendMail({
      from: config.from || config.user || "no-reply@localhost",
      to,
      subject: "Test Email from FMS Platform (Gmail SMTP)",
      text: "ยินดีด้วย! การตั้งค่า Gmail SMTP ของคุณทำงานได้อย่างถูกต้อง\n\nCongratulations! Your Gmail SMTP configuration is working properly.",
      html: `
        <div style="font-family: sans-serif; padding: 20px; line-height: 1.6; color: #333;">
          <h2 style="color: #2563eb;">FMS Platform - Gmail SMTP Test</h2>
          <p>ยินดีด้วย! การเชื่อมต่อระบบส่งอีเมลผ่าน Gmail SMTP สำเร็จเรียบร้อยแล้ว</p>
          <p>Congratulations! Your Gmail SMTP settings are verified and working properly.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="font-size: 12px; color: #6b7280;">Sent from FMS Platform</p>
        </div>
      `,
    });
    return { success: true };
  } catch (err) {
    logger.error("SMTP test failed", { err: err instanceof Error ? err.message : String(err) });
    return { success: false, message: err instanceof Error ? err.message : String(err) };
  }
}
