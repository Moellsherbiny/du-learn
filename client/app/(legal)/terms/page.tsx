
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  LockKeyhole,
} from "lucide-react";

export default function TermsPage() {
  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-background"
    >
      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(180,83,9,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(15,76,76,0.07),transparent_30%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle,rgba(100,100,100,0.18)_1px,transparent_1px)] [background-size:22px_22px]"
      />

      {/* Header */}
      <header className="relative z-10 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-2.5"
          >
            <span className="flex size-9 items-center justify-center rounded-xl border border-border/70 bg-card shadow-sm">
              <LockKeyhole className="size-4 text-primary" />
            </span>

            <span className="text-base font-semibold tracking-tight">
              DU Learn
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowRight className="size-4" />
            العودة للرئيسية
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 py-12 sm:py-16">
        {/* Intro */}
        <div className="mb-10 max-w-3xl">
          <div className="mb-5 flex size-12 items-center justify-center rounded-2xl border border-border/70 bg-card shadow-sm">
            <BookOpen className="size-5 text-primary" />
          </div>

          <p className="mb-2 text-sm font-medium text-primary">
            DU Learn
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            الشروط والأحكام
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            توضح هذه الشروط القواعد المنظمة لاستخدام
            منصة DU Learn والخدمات التعليمية المتاحة
            من خلالها.
          </p>

          <p className="mt-3 text-xs text-muted-foreground">
            آخر تحديث: سبتمبر 2026
          </p>
        </div>

        {/* Terms */}
        <div className="space-y-4">
          <section className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold">
              1. قبول الشروط
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              باستخدامك لمنصة DU Learn أو إنشاء حساب
              عليها، فإنك تقر بأنك قرأت هذه الشروط
              ووافقت على الالتزام بها. إذا كنت لا توافق
              على أي من هذه الشروط، يرجى عدم استخدام
              المنصة.
            </p>
          </section>

          <section className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold">
              2. إنشاء الحساب
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              عند إنشاء حساب في DU Learn، يجب تقديم
              بيانات صحيحة ومحدثة. أنت مسؤول عن الحفاظ
              على سرية بيانات تسجيل الدخول الخاصة بك
              وعن جميع الأنشطة التي تتم من خلال حسابك.
            </p>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              يجب عدم استخدام حساب شخص آخر أو مشاركة
              بيانات حسابك مع الآخرين بطريقة قد تعرض
              الحساب أو المنصة للخطر.
            </p>
          </section>

          <section className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold">
              3. استخدام المنصة
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              تلتزم باستخدام DU Learn لأغراض تعليمية
              ومشروعة فقط، وعدم محاولة تعطيل المنصة
              أو الوصول إلى بيانات أو حسابات لا تملك
              صلاحية الوصول إليها.
            </p>

            <div className="mt-5 space-y-3">
              {[
                "عدم مشاركة بيانات تسجيل الدخول مع الآخرين.",
                "عدم محاولة تجاوز آليات الحماية أو الصلاحيات.",
                "عدم استخدام المنصة بطريقة تؤثر على تجربة المستخدمين الآخرين.",
                "عدم رفع أو إرسال محتوى مخالف للقوانين أو حقوق الآخرين.",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold">
              4. المحتوى التعليمي
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              المحتوى التعليمي المتاح على المنصة مخصص
              للاستخدام التعليمي من خلال DU Learn.
              لا يجوز نسخ أو إعادة نشر أو توزيع المحتوى
              أو استخدامه لأغراض تجارية دون الحصول على
              الإذن المناسب.
            </p>
          </section>

          <section className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold">
              5. حماية الحساب
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              نعمل على توفير آليات مناسبة لحماية حسابات
              المستخدمين وبياناتهم، إلا أن المستخدم يظل
              مسؤولًا عن اختيار كلمة مرور مناسبة وعدم
              مشاركتها مع أي شخص آخر.
            </p>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              في حال الاشتباه في استخدام غير مصرح به
              لحسابك، يجب اتخاذ الإجراءات اللازمة لتأمين
              الحساب وإبلاغ إدارة المنصة.
            </p>
          </section>

          <section className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold">
              6. تعليق أو إيقاف الحساب
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              تحتفظ إدارة DU Learn بالحق في تعليق أو
              إيقاف الحسابات التي تستخدم المنصة بطريقة
              تخالف هذه الشروط أو تهدد أمن المنصة أو
              حقوق المستخدمين الآخرين.
            </p>
          </section>

          <section className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold">
              7. التعديلات على الشروط
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              قد يتم تحديث هذه الشروط من وقت لآخر
              لتحسين المنصة أو توضيح سياسات استخدامها.
              سيتم نشر النسخة المحدثة على هذه الصفحة،
              ويُعد استمرار استخدام المنصة بعد التحديث
              موافقة على الشروط المعدلة.
            </p>
          </section>

          <section className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold">
              8. التواصل
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              إذا كان لديك أي استفسار يتعلق بهذه الشروط
              أو باستخدام منصة DU Learn، يمكنك التواصل
              مع إدارة المنصة من خلال وسائل التواصل
              المتاحة داخل النظام.
            </p>
          </section>
        </div>

        {/* Footer note */}
        <div className="mt-8 rounded-2xl border border-primary/15 bg-primary/5 p-5">
          <p className="text-center text-sm leading-6 text-muted-foreground">
            باستخدامك لمنصة DU Learn، فإنك تؤكد
            موافقتك على هذه الشروط والأحكام.
          </p>
        </div>
      </div>
    </main>
  );
}
