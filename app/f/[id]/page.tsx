import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { normalizeSchema } from "@/lib/theme";
import type { FormSchema } from "@/lib/types";
import { FormRenderer } from "@/components/render/FormRenderer";

export const dynamic = "force-dynamic";

export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const form = await prisma.form.findUnique({ where: { id } });
  if (!form) notFound();

  const schema = normalizeSchema(form.schema as unknown as FormSchema);
  return <FormRenderer schema={schema} formId={id} />;
}
