-- CreateEnum
CREATE TYPE "DegreeLevel" AS ENUM ('BACHELOR', 'MASTER', 'DOCTORAL');

-- CreateEnum
CREATE TYPE "StudyType" AS ENUM ('REGULAR', 'SPECIAL', 'INTERNATIONAL');

-- CreateTable
CREATE TABLE "academic_programs" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "department_id" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "degree_level" "DegreeLevel" NOT NULL DEFAULT 'BACHELOR',
    "study_type" "StudyType" NOT NULL DEFAULT 'REGULAR',
    "name_th" VARCHAR(255) NOT NULL,
    "name_en" VARCHAR(255) NOT NULL,
    "degree_name_th" VARCHAR(255) NOT NULL,
    "degree_name_en" VARCHAR(255) NOT NULL,
    "total_credits" INTEGER NOT NULL DEFAULT 120,
    "tuition_fee" VARCHAR(255),
    "duration_years" DECIMAL(3,1) NOT NULL DEFAULT 4.0,
    "description_th" TEXT,
    "description_en" TEXT,
    "philosophy_th" TEXT,
    "philosophy_en" TEXT,
    "career_paths" JSONB NOT NULL DEFAULT '[]',
    "cover_image_url" VARCHAR(500),
    "brochure_url" VARCHAR(500),
    "curriculum_pdf_url" VARCHAR(500),
    "application_url" VARCHAR(500),
    "is_open_admissions" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "academic_programs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "academic_programs_tenant_id_idx" ON "academic_programs"("tenant_id");

-- CreateIndex
CREATE INDEX "academic_programs_tenant_id_department_id_idx" ON "academic_programs"("tenant_id", "department_id");

-- CreateIndex
CREATE INDEX "academic_programs_tenant_id_degree_level_idx" ON "academic_programs"("tenant_id", "degree_level");

-- CreateIndex
CREATE UNIQUE INDEX "academic_programs_tenant_id_code_key" ON "academic_programs"("tenant_id", "code");

-- AddForeignKey
ALTER TABLE "academic_programs" ADD CONSTRAINT "academic_programs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_programs" ADD CONSTRAINT "academic_programs_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
