
import type { LearnLesson } from "@/actions/courses/get-course-learn";
import { EmptyContent } from "./empty-content";

type Props = {
  lesson: LearnLesson;
};

export function MediaLesson({ lesson }: Props) {
  const mediaUrl = lesson.content?.media_file;

  if (!mediaUrl) {
    return <EmptyContent />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <img
        src={mediaUrl}
        alt={lesson.title}
        className="w-full object-cover"
      />
    </div>
  );
}
