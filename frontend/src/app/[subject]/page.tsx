import { notFound } from "next/navigation";
import { ChatInterface } from "@/components/chat-interface";
import { slugToSubjectId, VALID_SUBJECT_SLUGS } from "@/lib/subjects";

export function generateStaticParams() {
  return VALID_SUBJECT_SLUGS.map((subject) => ({ subject }));
}

interface SubjectPageProps {
  params: Promise<{ subject: string }>;
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { subject: slug } = await params;
  const subjectId = slugToSubjectId(slug);

  if (!subjectId) {
    notFound();
  }

  return <ChatInterface subjectId={subjectId} locked />;
}
