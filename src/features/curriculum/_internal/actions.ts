"use server";

import { revalidatePath } from "next/cache";
import { runAction, type ActionResult } from "@/shared/lib/result";
import { getLocale } from "@/shared/lib/i18n/server";
import { zodErrorMap } from "@/shared/lib/i18n/zod-locale";
import { requirePermission } from "@/features/identity/server";
import type { DegreeLevel } from "@/generated/prisma";
import { CURRICULUM_P } from "../permissions";
import { createProgramSchema, updateProgramSchema } from "./validations";
import {
  createProgram,
  updateProgram,
  deleteProgram,
  listAdminPrograms,
  type ProgramDto,
} from "./services";

export async function getAdminProgramsAction(options?: {
  degreeLevel?: DegreeLevel;
  departmentId?: string;
  search?: string;
}): Promise<ActionResult<ProgramDto[]>> {
  return runAction(async () => {
    const ctx = await requirePermission(CURRICULUM_P.curriculumRead);
    return listAdminPrograms(ctx.tenantId, options);
  });
}

export async function createProgramAction(input: unknown): Promise<ActionResult<ProgramDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(CURRICULUM_P.curriculumWrite);
    const parsed = createProgramSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await createProgram(ctx.tenantId, parsed, ctx.userId);
    revalidatePath("/programs");
    revalidatePath("/(portal)/programs", "page");
    return result;
  });
}

export async function updateProgramAction(input: unknown): Promise<ActionResult<ProgramDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(CURRICULUM_P.curriculumWrite);
    const parsed = updateProgramSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await updateProgram(ctx.tenantId, parsed, ctx.userId);
    revalidatePath("/programs");
    revalidatePath("/(portal)/programs", "page");
    return result;
  });
}

export async function deleteProgramAction(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(CURRICULUM_P.curriculumManage);
    await deleteProgram(ctx.tenantId, id, ctx.userId);
    revalidatePath("/programs");
    revalidatePath("/(portal)/programs", "page");
  });
}
