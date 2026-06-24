// app/clinicalnews/[id]/page.jsx

import { notFound } from "next/navigation";
import ClinicalDetail from "./ClinicalDetails";
import { getPostById } from "@/sanity/lib/queries";

export default async function ClinicalDetailPage({ params }) {
  const { id } = await params;

  const post = await getPostById(id);

  if (!post) notFound();

  return <ClinicalDetail post={post} backHref="/" />;
}
