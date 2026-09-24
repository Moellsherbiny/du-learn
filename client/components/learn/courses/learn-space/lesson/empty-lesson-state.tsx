
import { BookOpen } from "lucide-react";

export function EmptyLessonState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted">
          <BookOpen className="size-7 text-muted-foreground" />
        </div>

        <h2 className="mt-5 text-lg font-semibold">
          لا يوجد درس متاح حاليًا
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          اختر أحد الدروس المتاحة من قائمة محتوى الدورة.
        </p>
      </div>
    </div>
  );
}
