import Link from "next/link";
import Image from "next/image";
import { getLocale } from "@/shared/lib/i18n/server";
import { resolveDefaultTenantId } from "@/features/identity/server";
import { listStaffProfiles, listDepartments } from "@/features/staff/server";
import { Mail, Phone, MapPin, Sparkles, UserCheck } from "lucide-react";

export default async function FacultyPortalPage({
  searchParams,
}: {
  searchParams: Promise<{ dept?: string }>;
}) {
  const locale = await getLocale();
  const tenantId = await resolveDefaultTenantId();
  const { dept } = await searchParams;

  const [departments, staffMembers] = await Promise.all([
    listDepartments(tenantId),
    listStaffProfiles(tenantId, {
      departmentId: dept,
      activeOnly: true,
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          {locale === "th" ? "ทำเนียบคณาจารย์และบุคลากร" : "Faculty & Staff Directory"}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
          {locale === "th"
            ? "คณาจารย์ผู้ทรงคุณวุฒิ นักวิจัย และบุคลากรสายสนับสนุนประจำคณะ พร้อมให้คำปรึกษาด้านวิชาการ การวิจัย และการเรียนการสอน"
            : "Explore our experienced professors, specialized researchers, and academic staff across all departments."}
        </p>
      </div>

      {/* Department Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
        <Link
          href="/faculty"
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
            !dept
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          {locale === "th" ? "ทั้งหมด" : "All Members"}
        </Link>
        {departments.map((d) => (
          <Link
            key={d.id}
            href={`/faculty?dept=${d.id}`}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
              dept === d.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {locale === "th" ? d.nameTh : d.nameEn}
          </Link>
        ))}
      </div>

      {/* Staff Grid */}
      {staffMembers.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border/80">
          <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="text-lg font-bold text-foreground">
            {locale === "th" ? "ไม่พบบุคลากรในหน่วยงานนี้" : "No staff found in this unit"}
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staffMembers.map((member) => (
            <div
              key={member.id}
              className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Image
                    src={
                      member.avatarUrl ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop"
                    }
                    alt={
                      locale === "th"
                        ? `${member.prefixTh} ${member.firstNameTh} ${member.lastNameTh}`
                        : `${member.prefixEn} ${member.firstNameEn} ${member.lastNameEn}`
                    }
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-2xl object-cover border border-border/80 shadow-sm shrink-0"
                  />
                  <div className="space-y-1">
                    <h2 className="font-bold text-base text-foreground leading-snug">
                      {locale === "th"
                        ? `${member.prefixTh} ${member.firstNameTh} ${member.lastNameTh}`
                        : `${member.prefixEn} ${member.firstNameEn} ${member.lastNameEn}`}
                    </h2>
                    <div className="text-xs font-medium text-primary">
                      {locale === "th" ? member.positionTh : member.positionEn}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {locale === "th" ? member.departmentNameTh : member.departmentNameEn}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 text-xs text-muted-foreground border-t border-border/60">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <a href={`mailto:${member.email}`} className="hover:text-primary transition-colors truncate">
                      {member.email}
                    </a>
                  </div>
                  {member.phoneExt && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>{member.phoneExt}</span>
                    </div>
                  )}
                  {member.roomNumber && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>{member.roomNumber}</span>
                    </div>
                  )}
                </div>

                {member.expertises.length > 0 && (
                  <div className="pt-2 space-y-1.5">
                    <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-primary" />
                      <span>{locale === "th" ? "ความเชี่ยวชาญ:" : "Expertises:"}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {member.expertises.map((exp, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
