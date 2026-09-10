import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { seedCore, seedUser } from "./lib/seed-core";
import { requireDatabaseUrl } from "./lib/require-database-url";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: requireDatabaseUrl() }) });

/** รหัสผ่านทุกบัญชีตัวอย่าง */
export const DEV_PASSWORD = "Passw0rd!vibe";

async function main() {
  if (process.env.NODE_ENV === "production" && process.env.SEED_ALLOW_PROD !== "1") {
    console.error("[seed] ปฏิเสธ: NODE_ENV=production — ใช้ npm run db:bootstrap แทน");
    process.exit(1);
  }
  const core = await seedCore(prisma, { tenantCode: "DEMO", nameTh: "องค์กรตัวอย่าง", nameEn: "Sample Organization" });
  const hash = await bcrypt.hash(DEV_PASSWORD, 12);
  const users = [
    { email: "admin@app.local", name: "ผู้ดูแลสูงสุด", roles: ["SUPER_ADMIN"] },
    { email: "staff@app.local", name: "เจ้าหน้าที่", roles: ["STAFF"] },
    { email: "viewer@app.local", name: "ผู้ดู", roles: ["VIEWER"] },
    { email: "lockme@app.local", name: "บัญชีทดสอบล็อก", roles: ["VIEWER"] },
    { email: "forced@app.local", name: "บัญชีบังคับเปลี่ยนรหัส", roles: ["VIEWER"], mustChangePassword: true },
  ];
  for (const u of users) {
    await seedUser(prisma, core.tenantId, { ...u, passwordHash: hash, roleIds: u.roles.map((c) => core.roleIds[c]) });
  }

  // Seed Departments
  const deptDean = await prisma.department.upsert({
    where: { tenantId_code: { tenantId: core.tenantId, code: "DEAN" } },
    update: {},
    create: {
      tenantId: core.tenantId,
      code: "DEAN",
      nameTh: "สำนักงานคณบดี",
      nameEn: "Dean's Office",
      isAcademic: false,
      sortOrder: 1,
    },
  });

  const deptCS = await prisma.department.upsert({
    where: { tenantId_code: { tenantId: core.tenantId, code: "CS" } },
    update: {},
    create: {
      tenantId: core.tenantId,
      code: "CS",
      nameTh: "ภาควิชาวิทยาการคอมพิวเตอร์",
      nameEn: "Department of Computer Science",
      isAcademic: true,
      sortOrder: 2,
    },
  });

  const deptIT = await prisma.department.upsert({
    where: { tenantId_code: { tenantId: core.tenantId, code: "IT" } },
    update: {},
    create: {
      tenantId: core.tenantId,
      code: "IT",
      nameTh: "ภาควิชาเทคโนโลยีสารสนเทศ",
      nameEn: "Department of Information Technology",
      isAcademic: true,
      sortOrder: 3,
    },
  });

  // Seed Staff Profiles
  const adminUser = await prisma.user.findUnique({ where: { email: "admin@app.local" } });
  if (adminUser) {
    await prisma.staffProfile.upsert({
      where: { userId: adminUser.id },
      update: {},
      create: {
        tenantId: core.tenantId,
        userId: adminUser.id,
        departmentId: deptDean.id,
        prefixTh: "ศ.ดร.",
        prefixEn: "Prof. Dr.",
        firstNameTh: "สมชาย",
        lastNameTh: "ใจดี",
        firstNameEn: "Somchai",
        lastNameEn: "Jaidee",
        positionTh: "คณบดี",
        positionEn: "Dean of Faculty",
        email: "somchai@app.local",
        phoneExt: "1001",
        roomNumber: "FMS-401",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
        expertises: ["Artificial Intelligence", "Machine Learning", "Software Architecture"],
        sortOrder: 1,
        isActive: true,
      },
    });
  }

  await prisma.staffProfile.upsert({
    where: { id: "00000000-0000-0000-0000-000000000002" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000002",
      tenantId: core.tenantId,
      departmentId: deptCS.id,
      prefixTh: "รศ.ดร.",
      prefixEn: "Assoc. Prof. Dr.",
      firstNameTh: "วิภาดา",
      lastNameTh: "สุขเกษม",
      firstNameEn: "Wipada",
      lastNameEn: "Sukkasem",
      positionTh: "หัวหน้าภาควิชาวิทยาการคอมพิวเตอร์",
      positionEn: "Head of Computer Science Department",
      email: "wipada@app.local",
      phoneExt: "2100",
      roomNumber: "CS-302",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
      expertises: ["Cloud Computing", "Cybersecurity", "Distributed Systems"],
      sortOrder: 2,
      isActive: true,
    },
  });

  await prisma.staffProfile.upsert({
    where: { id: "00000000-0000-0000-0000-000000000003" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000003",
      tenantId: core.tenantId,
      departmentId: deptIT.id,
      prefixTh: "ผศ.ดร.",
      prefixEn: "Asst. Prof. Dr.",
      firstNameTh: "อานนท์",
      lastNameTh: "ภักดี",
      firstNameEn: "Arnon",
      lastNameEn: "Phakdee",
      positionTh: "อาจารย์ประจำสาขาเทคโนโลยีสารสนเทศ",
      positionEn: "Lecturer in Information Technology",
      email: "arnon@app.local",
      phoneExt: "3105",
      roomNumber: "IT-205",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      expertises: ["Fullstack Development", "Data Engineering", "Human-Computer Interaction"],
      sortOrder: 3,
      isActive: true,
    },
  });

  // Seed Article Categories
  const catAcademic = await prisma.articleCategory.upsert({
    where: { tenantId_slug: { tenantId: core.tenantId, slug: "academic" } },
    update: {},
    create: {
      tenantId: core.tenantId,
      nameTh: "ข่าววิชาการและงานวิจัย",
      nameEn: "Academic & Research",
      slug: "academic",
      sortOrder: 1,
    },
  });

  const catActivities = await prisma.articleCategory.upsert({
    where: { tenantId_slug: { tenantId: core.tenantId, slug: "activities" } },
    update: {},
    create: {
      tenantId: core.tenantId,
      nameTh: "ข่าวกิจกรรมนักศึกษา",
      nameEn: "Student Activities",
      slug: "activities",
      sortOrder: 2,
    },
  });

  const catAnnouncements = await prisma.articleCategory.upsert({
    where: { tenantId_slug: { tenantId: core.tenantId, slug: "announcements" } },
    update: {},
    create: {
      tenantId: core.tenantId,
      nameTh: "ประกาศทั่วไป",
      nameEn: "Official Announcements",
      slug: "announcements",
      sortOrder: 3,
    },
  });

  // Seed Articles
  if (adminUser) {
    await prisma.article.upsert({
      where: { tenantId_slug: { tenantId: core.tenantId, slug: "ai-symposium-2026" } },
      update: {},
      create: {
        tenantId: core.tenantId,
        authorId: adminUser.id,
        categoryId: catAcademic.id,
        titleTh: "ขอเชิญร่วมงานสัมมนาวิชาการด้านปัญญาประดิษฐ์และนวัตกรรมดิจิทัล 2026",
        titleEn: "Invitation to Faculty AI & Digital Innovation Symposium 2026",
        slug: "ai-symposium-2026",
        excerptTh: "คณะขอเชิญคณาจารย์ นักศึกษา และผู้สนใจทั่วไปร่วมรับฟังการบรรยายพิเศษจากผู้เชี่ยวชาญระดับแนวหน้าของอุตสาหกรรมเทคโนโลยี",
        excerptEn: "Join us for an inspiring conference exploring breakthrough AI trends, foundation models, and ethical technologies.",
        contentTh: "งานสัมมนาวิชาการด้านปัญญาประดิษฐ์และนวัตกรรมดิจิทัล จัดขึ้นเพื่อส่งเสริมองค์ความรู้และการประยุกต์ใช้เทคโนโลยี Generative AI และ Machine Learning ในภาคธุรกิจและการศึกษา โดยมีหัวข้อการเสวนา อาทิ State of AI in 2026, Modular Monolith Architecture, และการเตรียมความพร้อมสู่ตลาดแรงงานดิจิทัล",
        contentEn: "The AI & Digital Innovation Symposium is designed to bridge academic research with state-of-the-art industry practices. Topics include Foundation Models, Modern Software Engineering, and AI Governance.",
        coverImageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=600&fit=crop",
        isPinned: true,
        isFeatured: true,
        status: "PUBLISHED",
        publishedAt: new Date(),
        viewCount: 245,
      },
    });

    await prisma.article.upsert({
      where: { tenantId_slug: { tenantId: core.tenantId, slug: "admissions-2026" } },
      update: {},
      create: {
        tenantId: core.tenantId,
        authorId: adminUser.id,
        categoryId: catAnnouncements.id,
        titleTh: "เปิดรับสมัครนักศึกษาใหม่ระดับปริญญาตรีและบัณฑิตศึกษา ประจำปีการศึกษา 2569",
        titleEn: "Admissions Open for Undergraduate & Graduate Programs 2026",
        slug: "admissions-2026",
        excerptTh: "เปิดรับสมัครรอบคัดเลือกพิเศษและรอบทั่วไป พร้อมทุนการศึกษาสำหรับผู้มีความสามารถทางวิชาการและเทคโนโลยี",
        excerptEn: "Admissions are officially open for academic year 2026. Explore available programs and scholarship opportunities.",
        contentTh: "คณะเปิดรับสมัครนักศึกษาใหม่ในหลักสูตรวิทยาการคอมพิวเตอร์ และเทคโนโลยีสารสนเทศ ทั้งหลักสูตรปกติและนานาชาติ ตรวจสอบคุณสมบัติและกำหนดการได้ที่ระบบรับสมัครของมหาวิทยาลัย",
        contentEn: "Applications are now open for Computer Science and Information Technology degree programs. Scholarships are available for top applicants.",
        coverImageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=600&fit=crop",
        isPinned: true,
        isFeatured: true,
        status: "PUBLISHED",
        publishedAt: new Date(),
        viewCount: 512,
      },
    });

    await prisma.article.upsert({
      where: { tenantId_slug: { tenantId: core.tenantId, slug: "hackathon-champion-2026" } },
      update: {},
      create: {
        tenantId: core.tenantId,
        authorId: adminUser.id,
        categoryId: catActivities.id,
        titleTh: "ทีมนักศึกษาคณะคว้ารางวัลชนะเลิศการแข่งขัน Thailand NextGen Hackathon 2026",
        titleEn: "Faculty Student Team Wins 1st Place at Thailand NextGen Hackathon 2026",
        slug: "hackathon-champion-2026",
        excerptTh: "ขอแสดงความยินดีกับทีม 'VibeArchitects' ที่สร้างสรรค์ผลงานแพลตฟอร์มบริหารจัดการทรัพยากรเมืองอัจฉริยะ",
        excerptEn: "Congratulations to our team 'VibeArchitects' for claiming the championship with their Smart City AI Resource Platform.",
        contentTh: "การแข่งขัน Thailand NextGen Hackathon ประจำปี 2026 มีทีมเข้าร่วมกว่า 80 สถาบันทั่วประเทศ โดยทีมนักศึกษาของคณะสามารถนำเสนอโซลูชันที่มีประสิทธิภาพสูงสุดและได้รับรางวัลมูลค่ากว่า 100,000 บาท",
        contentEn: "Over 80 university teams participated nationwide. Our faculty team demonstrated outstanding innovation, teamwork, and system architecture excellence.",
        coverImageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=600&fit=crop",
        isPinned: false,
        isFeatured: true,
        status: "PUBLISHED",
        publishedAt: new Date(),
        viewCount: 189,
      },
    });
  }

  // Seed Academic Programs
  await prisma.academicProgram.upsert({
    where: { tenantId_code: { tenantId: core.tenantId, code: "cs-bsc" } },
    update: {},
    create: {
      tenantId: core.tenantId,
      departmentId: deptCS.id,
      code: "cs-bsc",
      degreeLevel: "BACHELOR",
      studyType: "REGULAR",
      nameTh: "วิทยาศาสตรบัณฑิต สาขาวิชาวิทยาการคอมพิวเตอร์",
      nameEn: "Bachelor of Science in Computer Science",
      degreeNameTh: "วท.บ. (วิทยาการคอมพิวเตอร์)",
      degreeNameEn: "B.Sc. (Computer Science)",
      totalCredits: 128,
      tuitionFee: "24,000 บาท / ภาคการศึกษา",
      durationYears: 4.0,
      descriptionTh: "หลักสูตรมุ่งเน้นการพัฒนานักคิดและวิศวกรซอฟต์แวร์ที่มีความเชี่ยวชาญด้านขั้นตอนวิธี โครงสร้างสถาปัตยกรรมระบบคลาวด์ ปัญญาประดิษฐ์ และความมั่นคงปลอดภัยไซเบอร์",
      descriptionEn: "Comprehensive curriculum emphasizing algorithms, distributed systems, AI engineering, and modern cloud native software development.",
      philosophyTh: "ผลิตบัณฑิตที่มีทักษะการคิดเชิงคำนวณขั้นสูง สามารถสร้างสรรค์นวัตกรรมซอฟต์แวร์เพื่อขับเคลื่อนเศรษฐกิจดิจิทัลอย่างยั่งยืน",
      philosophyEn: "Nurturing high-caliber computational thinkers capable of pioneering software innovations for the global digital economy.",
      careerPaths: [
        "Fullstack Software Engineer",
        "AI / ML Engineer",
        "DevOps & Cloud Architect",
        "Cybersecurity Specialist",
      ],
      coverImageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop",
      brochureUrl: "https://example.com/cs-brochure.pdf",
      curriculumPdfUrl: "https://example.com/cs-tqf2.pdf",
      applicationUrl: "https://admissions.example.com",
      isOpenAdmissions: true,
      isActive: true,
      sortOrder: 1,
    },
  });

  await prisma.academicProgram.upsert({
    where: { tenantId_code: { tenantId: core.tenantId, code: "it-bsc-inter" } },
    update: {},
    create: {
      tenantId: core.tenantId,
      departmentId: deptIT.id,
      code: "it-bsc-inter",
      degreeLevel: "BACHELOR",
      studyType: "INTERNATIONAL",
      nameTh: "วิทยาศาสตรบัณฑิต สาขาวิชาเทคโนโลยีสารสนเทศ (หลักสูตรนานาชาติ)",
      nameEn: "Bachelor of Science in Information Technology (International Program)",
      degreeNameTh: "วท.บ. (เทคโนโลยีสารสนเทศ)",
      degreeNameEn: "B.Sc. (Information Technology)",
      totalCredits: 126,
      tuitionFee: "45,000 บาท / ภาคการศึกษา",
      durationYears: 4.0,
      descriptionTh: "หลักสูตรนานาชาติที่ออกแบบร่วมกับภาคอุตสาหกรรมเทคโนโลยีระดับโลก เน้นการบูรณาการเทคโนโลยีดิจิทัลสมัยใหม่ และการจัดการระบบสารสนเทศระดับองค์กร",
      descriptionEn: "An internationally accredited program co-designed with global tech leaders focusing on enterprise architecture, modern web technologies, and digital transformation.",
      philosophyTh: "สร้างผู้นำการเปลี่ยนแปลงทางเทคโนโลยีที่มีศักยภาพการแข่งขันในเวทีสากล",
      philosophyEn: "Cultivating tech leaders with global communication and technical competencies.",
      careerPaths: [
        "IT Solutions Architect",
        "Product Manager",
        "Business Systems Analyst",
        "Data Engineer",
      ],
      coverImageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&h=600&fit=crop",
      brochureUrl: "https://example.com/it-brochure.pdf",
      curriculumPdfUrl: "https://example.com/it-tqf2.pdf",
      applicationUrl: "https://admissions.example.com",
      isOpenAdmissions: true,
      isActive: true,
      sortOrder: 2,
    },
  });

  await prisma.academicProgram.upsert({
    where: { tenantId_code: { tenantId: core.tenantId, code: "ds-msc" } },
    update: {},
    create: {
      tenantId: core.tenantId,
      departmentId: deptCS.id,
      code: "ds-msc",
      degreeLevel: "MASTER",
      studyType: "SPECIAL",
      nameTh: "วิทยาศาสตรมหาบัณฑิต สาขาวิชาวิทยาการข้อมูลและปัญญาประดิษฐ์",
      nameEn: "Master of Science in Data Science & Artificial Intelligence",
      degreeNameTh: "วท.ม. (วิทยาการข้อมูลและปัญญาประดิษฐ์)",
      degreeNameEn: "M.Sc. (Data Science & AI)",
      totalCredits: 36,
      tuitionFee: "48,000 บาท / ภาคการศึกษา",
      durationYears: 2.0,
      descriptionTh: "หลักสูตรระดับบัณฑิตศึกษาสำหรับผู้บริหารและผู้เชี่ยวชาญที่ต้องการประยุกต์ใช้โมเดล Generative AI, Big Data Analytics และ Deep Learning ในระดับอุตสาหกรรม",
      descriptionEn: "Graduate program designed for professionals seeking deep mastery in Foundation Models, Deep Learning, Big Data Analytics, and AI Strategy.",
      philosophyTh: "มุ่งพัฒนานักวิจัยและผู้เชี่ยวชาญเพื่อสร้างมูลค่าเพิ่มและนวัตกรรมปัญญาประดิษฐ์ระดับแนวหน้า",
      philosophyEn: "Advanced research and engineering excellence in artificial intelligence and data science.",
      careerPaths: [
        "Chief AI Officer",
        "Lead Data Scientist",
        "Machine Learning Researcher",
        "AI Consultant",
      ],
      coverImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop",
      brochureUrl: "https://example.com/ds-msc-brochure.pdf",
      curriculumPdfUrl: "https://example.com/ds-msc-tqf2.pdf",
      applicationUrl: "https://grad.admissions.example.com",
      isOpenAdmissions: true,
      isActive: true,
      sortOrder: 3,
    },
  });

  await prisma.academicProgram.upsert({
    where: { tenantId_code: { tenantId: core.tenantId, code: "cs-phd" } },
    update: {},
    create: {
      tenantId: core.tenantId,
      departmentId: deptCS.id,
      code: "cs-phd",
      degreeLevel: "DOCTORAL",
      studyType: "REGULAR",
      nameTh: "ปรัชญาดุษฎีบัณฑิต สาขาวิชาวิทยาการคอมพิวเตอร์และนวัตกรรมดิจิทัล",
      nameEn: "Doctor of Philosophy in Computer Science & Digital Innovation",
      degreeNameTh: "ปร.ด. (วิทยาการคอมพิวเตอร์และนวัตกรรมดิจิทัล)",
      degreeNameEn: "Ph.D. (Computer Science & Digital Innovation)",
      totalCredits: 48,
      tuitionFee: "65,000 บาท / ภาคการศึกษา",
      durationYears: 3.0,
      descriptionTh: "หลักสูตรปริญญาเอกที่เน้นการทำวิจัยขั้นแนวหน้า (Frontier Research) ด้านวิศวกรรมคอมพิวเตอร์ สถาปัตยกรรมระบบขั้นสูง และทฤษฎีการคำนวณ",
      descriptionEn: "Doctoral research program advancing frontier computational sciences, quantum computing algorithms, and high-performance computing systems.",
      philosophyTh: "สร้างนักวิจัยระดับดุษฎีบัณฑิตเพื่อเป็นเสาหลักทางวิชาการและนวัตกรรมระดับโลก",
      philosophyEn: "Fostering world-class research scholars and thought leaders in computational sciences.",
      careerPaths: [
        "University Professor",
        "Principal Research Scientist",
        "R&D Director",
      ],
      coverImageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop",
      brochureUrl: "https://example.com/phd-brochure.pdf",
      curriculumPdfUrl: "https://example.com/phd-tqf2.pdf",
      applicationUrl: "https://grad.admissions.example.com",
      isOpenAdmissions: true,
      isActive: true,
      sortOrder: 4,
    },
  });

  // Seed Document Categories
  const docCatStudent = await prisma.documentCategory.upsert({
    where: { tenantId_code: { tenantId: core.tenantId, code: "student-forms" } },
    update: {},
    create: {
      tenantId: core.tenantId,
      code: "student-forms",
      nameTh: "แบบฟอร์มคำร้องสำหรับนักศึกษา",
      nameEn: "Student Request Forms",
      target: "STUDENT",
      sortOrder: 1,
    },
  });

  const docCatReg = await prisma.documentCategory.upsert({
    where: { tenantId_code: { tenantId: core.tenantId, code: "academic-regulations" } },
    update: {},
    create: {
      tenantId: core.tenantId,
      code: "academic-regulations",
      nameTh: "ระเบียบข้อบังคับและประกาศทางวิชาการ",
      nameEn: "Academic Rules & Regulations",
      target: "PUBLIC",
      sortOrder: 2,
    },
  });

  const docCatStaff = await prisma.documentCategory.upsert({
    where: { tenantId_code: { tenantId: core.tenantId, code: "staff-forms" } },
    update: {},
    create: {
      tenantId: core.tenantId,
      code: "staff-forms",
      nameTh: "แบบฟอร์มสำหรับบุคลากรและคณาจารย์",
      nameEn: "Staff & Faculty Forms",
      target: "STAFF",
      sortOrder: 3,
    },
  });

  // Seed Document Items
  await prisma.documentItem.createMany({
    data: [
      {
        tenantId: core.tenantId,
        categoryId: docCatStudent.id,
        code: "FM-STD-01",
        titleTh: "แบบฟอร์มคำร้องทั่วไป (General Request Form)",
        titleEn: "General Student Request Form",
        descriptionTh: "สำหรับนักศึกษาทุกระดับชั้นในการยื่นคำร้องต่อคณะบดีหรือหัวหน้าภาควิชา",
        descriptionEn: "Standard application form for student requests to the Dean or Department Head",
        fileUrl: "https://example.com/forms/FM-STD-01.pdf",
        fileType: "pdf",
        fileSizeBytes: 245000,
        downloadCount: 312,
        sortOrder: 1,
      },
      {
        tenantId: core.tenantId,
        categoryId: docCatStudent.id,
        code: "FM-STD-02",
        titleTh: "คำร้องขอเพิ่ม-ถอนรายวิชาล่าช้าเป็นกรณีพิเศษ",
        titleEn: "Special Late Course Add / Drop Request Form",
        descriptionTh: "ใช้สำหรับยื่นคำร้องหลังจากพ้นกำหนดเวลาเพิ่ม-ถอนปกติของมหาวิทยาลัย",
        descriptionEn: "Request form for course enrollment modification after the regular registration deadline",
        fileUrl: "https://example.com/forms/FM-STD-02.pdf",
        fileType: "pdf",
        fileSizeBytes: 185000,
        downloadCount: 145,
        sortOrder: 2,
      },
      {
        tenantId: core.tenantId,
        categoryId: docCatReg.id,
        code: "REG-ACD-2026",
        titleTh: "ข้อบังคับมหาวิทยาลัยว่าด้วยการศึกษาระดับปริญญาตรี พ.ศ. 2567",
        titleEn: "University Undergraduate Academic Regulations (2024 Edition)",
        descriptionTh: "เกณฑ์การวัดผล การเทียบโอนหน่วยกิต และการสำเร็จการศึกษา",
        descriptionEn: "Comprehensive regulations regarding grading, credit transfer, and degree fulfillment",
        fileUrl: "https://example.com/regulations/academic-2024.pdf",
        fileType: "pdf",
        fileSizeBytes: 1250000,
        downloadCount: 560,
        sortOrder: 1,
      },
      {
        tenantId: core.tenantId,
        categoryId: docCatStaff.id,
        code: "FM-STF-01",
        titleTh: "แบบฟอร์มขออนุมัติเดินทางไปราชการและเข้าร่วมการประชุมวิชาการ",
        titleEn: "Official Travel & Academic Conference Request Form",
        descriptionTh: "สำหรับคณาจารย์และบุคลากรเพื่อขออนุมัติงบประมาณและเวลาเดินทาง",
        descriptionEn: "Application form for faculty travel approval and conference grant support",
        fileUrl: "https://example.com/forms/FM-STF-01.docx",
        fileType: "docx",
        fileSizeBytes: 98000,
        downloadCount: 78,
        sortOrder: 1,
      },
    ],
    skipDuplicates: true,
  });

  // Seed Facilities
  const room401 = await prisma.facility.upsert({
    where: { tenantId_code: { tenantId: core.tenantId, code: "room-401" } },
    update: {},
    create: {
      tenantId: core.tenantId,
      code: "room-401",
      type: "MEETING_ROOM",
      nameTh: "ห้องประชุมวิชาการ 401 (Executive Meeting Room)",
      nameEn: "Executive Meeting Room 401",
      location: "อาคารวิทยาการจัดการ ชั้น 4",
      capacity: 25,
      equipment: ["Smart Projector 4K", "Cisco Video Conference System", "Wireless Microphones", "High-speed Wi-Fi"],
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&h=600&fit=crop",
      sortOrder: 1,
    },
  });

  const labAi = await prisma.facility.upsert({
    where: { tenantId_code: { tenantId: core.tenantId, code: "lab-ai-1" } },
    update: {},
    create: {
      tenantId: core.tenantId,
      code: "lab-ai-1",
      type: "LABORATORY",
      nameTh: "ห้องปฏิบัติการปัญญาประดิษฐ์และระบบอัจฉริยะ (AI & HPC Lab)",
      nameEn: "Artificial Intelligence & HPC Laboratory",
      location: "อาคารนวัตกรรมดิจิทัล ชั้น 3 ห้อง 302",
      capacity: 45,
      equipment: ["NVIDIA RTX Workstations (40 เครื่อง)", "Smart Interactive Board", "Gigabit Network Switch"],
      imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=1000&h=600&fit=crop",
      sortOrder: 2,
    },
  });

  const auditorium = await prisma.facility.upsert({
    where: { tenantId_code: { tenantId: core.tenantId, code: "auditorium-main" } },
    update: {},
    create: {
      tenantId: core.tenantId,
      code: "auditorium-main",
      type: "AUDITORIUM",
      nameTh: "หอประชุมใหญ่คณะวิทยาการจัดการ",
      nameEn: "Faculty Grand Auditorium",
      location: "อาคารวิทยาการจัดการ ชั้น 1",
      capacity: 300,
      equipment: ["LED Display Wall", "Stage Sound & Lighting", "Livestream Broadcasting System"],
      imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1000&h=600&fit=crop",
      sortOrder: 3,
    },
  });

  const van01 = await prisma.facility.upsert({
    where: { tenantId_code: { tenantId: core.tenantId, code: "van-01" } },
    update: {},
    create: {
      tenantId: core.tenantId,
      code: "van-01",
      type: "VEHICLE",
      nameTh: "รถตู้ส่วนกลางคณะ (Toyota Commuter ทะเบียน 1นข-9999)",
      nameEn: "Faculty Official Van 01 (1NK-9999)",
      location: "ลานจอดรถยานพาหนะคณะ",
      capacity: 13,
      equipment: ["เครื่องปรับอากาศ", "GPS Tracking", "ประกันภัยชั้น 1"],
      imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1000&h=600&fit=crop",
      sortOrder: 4,
    },
  });

  // Seed sample reservations
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);

  const tomorrowEnd = new Date(tomorrow);
  tomorrowEnd.setHours(12, 0, 0, 0);

  await prisma.reservation.create({
    data: {
      tenantId: core.tenantId,
      facilityId: room401.id,
      reservedByName: "ผศ.ดร. สุรชัย ชัยชนะ",
      reservedByEmail: "surachai.c@fms.ac.th",
      reservedByPhone: "081-234-5678",
      reservedByDept: "ภาควิชาวิทยาการคอมพิวเตอร์",
      title: "การประชุมคณะกรรมการพัฒนาหลักสูตรเทคโนโลยีสารสนเทศ 2569",
      description: "พิจารณาโครงสร้างรายวิชาหมวดปัญญาประดิษฐ์ประยุกต์",
      attendeeCount: 15,
      startTime: tomorrow,
      endTime: tomorrowEnd,
      status: "APPROVED",
      reviewNote: "อนุมัติการใช้งานพร้อมจัดเตรียมอุปกรณ์โสตทัศนูปกรณ์",
    },
  });

  console.log(`[seed] เสร็จ — login: admin@app.local / ${DEV_PASSWORD}`);
}

main().finally(() => prisma.$disconnect());
