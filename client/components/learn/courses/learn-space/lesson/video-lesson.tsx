
import type { LearnLesson } from "@/actions/courses/get-course-learn";
import { EmptyContent } from "./empty-content";

type Props = {
  lesson: LearnLesson;
};

export function VideoLesson({ lesson }: Props) {
  const videoUrl = lesson.content?.video_url;

  if (!videoUrl) {
    return <EmptyContent />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="aspect-video bg-black">
        <iframe
          src={videoUrl}
          title={lesson.title}
          className="size-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
