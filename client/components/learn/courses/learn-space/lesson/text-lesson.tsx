
import type { LearnLesson } from "@/actions/courses/get-course-learn";
import { EmptyContent } from "./empty-content";

type Props = {
  lesson: LearnLesson;
};

export function TextLesson({ lesson }: Props) {
  const text = lesson.content?.text;

  if (!text) {
    return <EmptyContent />;
  }

  return (
    <article
      dir="rtl"
      className="prose prose-neutral dark:prose-invert max-w-none leading-8"
    >
      {text}
    </article>
  );
}
