
import { notFound, redirect } from "next/navigation";

import { getCourseLearnAction } from "@/actions/courses/get-course-learn";
import { LearnClient } from "@/components/learn/courses/learn-space/learn-client";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function LearnPage({ params }: Props) {
  const { slug } = await params;

  const result = await getCourseLearnAction(slug);

  if (!result.success) {
    if (result.status === 401) {
      redirect(`/login?next=/courses/${slug}/learn`);
    }

    if (result.status === 403) {
      redirect(`/courses/${slug}`);
    }

    if (result.status === 404) {
      notFound();
    }

    return (
      <main
        dir="rtl"
        className="flex min-h-[60vh] items-center justify-center p-6"
      >
        <div className="text-center">
          <h1 className="text-lg font-semibold">
            تعذر تحميل الدورة
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {result.message || "حدث خطأ أثناء تحميل محتوى الدورة."}
          </p>
        </div>
      </main>
    );
  }

  return <LearnClient data={result.data} />;
}
