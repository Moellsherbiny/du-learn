
import { FileText } from "lucide-react";

import type { LearnLesson } from "@/actions/courses/get-course-learn";
import { EmptyContent } from "./empty-content";

type Props = {
  lesson: LearnLesson;
};

export function MaterialLesson({ lesson }: Props) {
  const materialUrl = lesson.content?.material_file;

  if (!materialUrl) {
    return <EmptyContent />;
  }

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <FileText className="size-7" />
        </div>

        <h3 className="mt-5 text-base font-semibold">
          المادة التعليمية
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          يمكنك فتح المادة التعليمية الخاصة بهذا الدرس.
        </p>

        <a
          href={materialUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          فتح المادة
          <FileText className="size-4" />
        </a>
      </div>
    </div>
  );
}