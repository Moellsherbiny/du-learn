
import type { LearnLesson } from "@/actions/courses/get-course-learn";

import { MediaLesson } from "./media-lesson";
import { MaterialLesson } from "./material-lesson";
import { TextLesson } from "./text-lesson";
import { VideoLesson } from "./video-lesson";

type Props = {
  lesson: LearnLesson;
};

export function LessonBody({ lesson }: Props) {
  switch (lesson.content_type) {
    case "VIDEO":
      return <VideoLesson lesson={lesson} />;

    case "MEDIA":
      return <MediaLesson lesson={lesson} />;

    case "MATERIAL":
      return <MaterialLesson lesson={lesson} />;

    case "TEXT":
    default:
      return <TextLesson lesson={lesson} />;
  }
}
