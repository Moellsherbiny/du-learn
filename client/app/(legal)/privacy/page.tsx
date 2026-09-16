
import Link from "next/link";
import {
  ArrowRight,
  Database,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

export default function PrivacyPage() {
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
            <ShieldCheck className="size-5 text-primary" />
          </div>

          <p className="mb-2 text-sm font-medium text-primary">
            DU Learn
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            سياسة الخصوصية
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            توضح هذه السياسة كيفية تعامل منصة DU Learn
            مع البيانات التي يتم تقديمها أو إنشاؤها
            أثناء استخدام المنصة.
          </p>

          <p className="mt-3 text-xs text-muted-foreground">
            آخر تحديث: سبتمبر 2026
          </p>
        </div>

        {/* Privacy sections */}
        <div className="space-y-4">
          {/* 1 */}
          <section className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Database className="size-4 text-primary" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  1. البيانات التي نجمعها
                </h2>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  عند استخدام DU Learn، قد يتم جمع
                  البيانات التي تقدمها عند إنشاء الحساب
                  أو استخدام الخدمات التعليمية داخل
                  المنصة.
                </p>

                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li>
                    • الاسم الأول واسم العائلة.
                  </li>
                  <li>
                    • عنوان البريد الإلكتروني.
                  </li>
                  <li>
                    • بيانات الحساب اللازمة لتسجيل
                    الدخول وإدارة الحساب.
                  </li>
                  <li>
                    • بيانات مرتبطة باستخدام الخدمات
                    التعليمية والتقدم داخل المنصة.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 2 */}
          <section className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold">
              2. كيفية استخدام البيانات
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              يتم استخدام البيانات اللازمة لتوفير
              خدمات DU Learn وتشغيل الحساب وتحسين
              تجربة التعلم داخل المنصة.
            </p>

            <div className="mt-4 space-y-3">
              <p className="text-sm leading-7 text-muted-foreground">
                <span className="font-medium text-foreground">
                  إدارة الحساب:
                </span>{" "}
                استخدام بيانات الحساب لتسجيل الدخول
                وإدارة الحساب والعمليات المرتبطة به.
              </p>

              <p className="text-sm leading-7 text-muted-foreground">
                <span className="font-medium text-foreground">
                  الخدمات التعليمية:
                </span>{" "}
                استخدام البيانات المرتبطة بالنشاط
                التعليمي لتوفير محتوى وتجربة تعليمية
                مناسبة.
              </p>

              <p className="text-sm leading-7 text-muted-foreground">
                <span className="font-medium text-foreground">
                  التواصل:
                </span>{" "}
                استخدام البريد الإلكتروني لإرسال
                الرسائل الضرورية المتعلقة بالحساب،
                مثل تأكيد البريد الإلكتروني أو إعادة
                تعيين كلمة المرور.
              </p>
            </div>
          </section>

          {/* 3 */}
          <section className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold">
              3. حماية البيانات
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              نعمل على تطبيق إجراءات مناسبة للمساعدة
              في حماية بيانات المستخدمين ومنع الوصول
              غير المصرح به إليها.
            </p>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              كما يجب على المستخدم الحفاظ على سرية
              بيانات تسجيل الدخول الخاصة به وعدم
              مشاركتها مع الآخرين.
            </p>
          </section>

          {/* 4 */}
          <section className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold">
              4. مشاركة البيانات
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              لا يتم مشاركة بيانات المستخدمين بشكل
              عشوائي. قد يتم التعامل مع البيانات فقط
              بالقدر اللازم لتشغيل الخدمات أو تنفيذ
              الوظائف المطلوبة داخل المنصة، أو عندما
              يكون ذلك مطلوبًا بموجب القانون.
            </p>
          </section>

          {/* 5 */}
          <section className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold">
              5. ملفات تعريف الارتباط والتخزين
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              قد تستخدم DU Learn تقنيات التخزين
              الضرورية للحفاظ على حالة تسجيل الدخول
              وتشغيل وظائف المنصة بشكل صحيح.
            </p>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              يتم استخدام هذه التقنيات بما يتناسب
              مع الوظائف التي تحتاج إليها المنصة
              لتقديم الخدمة.
            </p>
          </section>

          {/* 6 */}
          <section className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold">
              6. الاحتفاظ بالبيانات
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              يتم الاحتفاظ ببيانات الحساب والبيانات
              المرتبطة باستخدام المنصة طالما كانت
              هناك حاجة إليها لتوفير الخدمات وإدارة
              الحساب، أو وفقًا للمتطلبات المعمول بها.
            </p>
          </section>

          {/* 7 */}
          <section className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold">
              7. حقوق المستخدم
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              يمكنك مراجعة البيانات الأساسية المرتبطة
              بحسابك وتحديث المعلومات التي تسمح المنصة
              بتعديلها من خلال حسابك.
            </p>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              إذا كان لديك طلب متعلق ببيانات حسابك أو
              ترغب في الاستفسار عن كيفية التعامل معها،
              يمكنك التواصل مع إدارة المنصة من خلال
              وسائل التواصل المتاحة داخل النظام.
            </p>
          </section>

          {/* 8 */}
          <section className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold">
              8. تحديث سياسة الخصوصية
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              قد يتم تحديث سياسة الخصوصية من وقت لآخر
              لمواكبة التغييرات في المنصة أو الخدمات
              المقدمة. سيتم نشر النسخة المحدثة على هذه
              الصفحة مع توضيح تاريخ آخر تحديث.
            </p>
          </section>

          {/* 9 */}
          <section className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold">
              9. التواصل معنا
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              إذا كانت لديك أي أسئلة أو استفسارات حول
              سياسة الخصوصية أو بيانات حسابك، يمكنك
              التواصل مع إدارة DU Learn من خلال وسائل
              التواصل المتاحة داخل المنصة.
            </p>
          </section>
        </div>

        {/* Footer note */}
        <div className="mt-8 rounded-2xl border border-primary/15 bg-primary/5 p-5">
          <p className="text-center text-sm leading-6 text-muted-foreground">
            نحرص في DU Learn على التعامل مع بيانات
            المستخدمين بطريقة مسؤولة واستخدامها في
            حدود ما يلزم لتقديم خدمات المنصة.
          </p>
        </div>
      </div>
    </main>
  );
}
