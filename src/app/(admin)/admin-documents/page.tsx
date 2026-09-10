import { requirePermission, hasPermission } from "@/features/identity/server";
import { DOC_P, listAdminDocuments, listDocumentCategories } from "@/features/documents/server";
import { DocumentsClient } from "./_components/documents-client";

export default async function AdminDocumentsPage() {
  const ctx = await requirePermission(DOC_P.documentRead);
  const [initialDocs, categories] = await Promise.all([
    listAdminDocuments(ctx.tenantId),
    listDocumentCategories(ctx.tenantId),
  ]);

  return (
    <DocumentsClient
      initialDocs={initialDocs}
      categories={categories}
      canWrite={hasPermission(ctx, DOC_P.documentWrite)}
      canManage={hasPermission(ctx, DOC_P.documentManage)}
    />
  );
}
