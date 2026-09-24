import os
import django

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "config.settings.development",
)

django.setup()

from django.core.files.base import ContentFile
from django.db import transaction

from apps.courses.models import Course, CourseSection
from apps.lessons.models import Lesson, LessonContent


# =========================================================
# LESSONS DATA
# =========================================================

LESSONS = {

    # =====================================================
    # 1. COMPUTER SCIENCE FUNDAMENTALS
    # =====================================================

    "computer-science-fundamentals": {

        1: [
            {
                "title": "ما هي علوم الحاسب؟",
                "description": "مقدمة إلى مفهوم علوم الحاسب ومجالاته.",
                "type": "TEXT",
                "text": """
علوم الحاسب هو المجال الذي يهتم بدراسة الحاسوب
والبيانات والخوارزميات والبرمجيات وطرق معالجة المعلومات.

في هذا الدرس سنتعرف على مفهوم علوم الحاسب
وأهم المجالات التي يعتمد عليها في حياتنا اليومية.
""",
            },
            {
                "title": "تطور الحاسوب",
                "description": "التعرف على مراحل تطور أجهزة الحاسوب.",
                "type": "VIDEO",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                "title": "مجموعة صور مكونات الحاسوب",
                "description": "صور توضيحية لأهم مكونات الحاسوب.",
                "type": "MEDIA",
                "media_name": "computer-components-demo.svg",
            },
        ],

        2: [
            {
                "title": "المكونات المادية Hardware",
                "description": "التعرف على مفهوم Hardware ومكوناته.",
                "type": "TEXT",
                "text": """
المكونات المادية Hardware هي الأجزاء الفيزيائية
التي يمكن لمسها داخل جهاز الحاسوب.

من أمثلتها:
- CPU
- RAM
- Motherboard
- Storage
- Power Supply
""",
            },
            {
                "title": "المكونات الداخلية للحاسوب",
                "description": "التعرف على المكونات الداخلية الأساسية.",
                "type": "VIDEO",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                "title": "البرمجيات Software",
                "description": "التعرف على مفهوم Software.",
                "type": "TEXT",
                "text": """
البرمجيات هي مجموعة البرامج والتعليمات
التي يتم تنفيذها بواسطة الحاسوب.

ومن أمثلتها أنظمة التشغيل والتطبيقات وبرامج الخدمات.
""",
            },
        ],

        3: [
            {
                "title": "ما هو نظام التشغيل؟",
                "description": "مقدمة إلى أنظمة التشغيل ووظائفها.",
                "type": "TEXT",
                "text": """
نظام التشغيل هو البرنامج الأساسي الذي يدير موارد
الحاسوب ويوفر بيئة لتشغيل التطبيقات.

من أمثلة أنظمة التشغيل:
Windows وLinux وmacOS وAndroid.
""",
            },
            {
                "title": "إدارة الملفات والبرامج",
                "description": "التعرف على كيفية إدارة الملفات والبرامج.",
                "type": "VIDEO",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                "title": "ملخص أساسيات علوم الحاسب",
                "description": "ملف تعليمي يحتوي على ملخص أهم المفاهيم.",
                "type": "MATERIAL",
                "material_name": "computer-science-summary.pdf",
            },
        ],

        4: [
            {
                "title": "مفهوم الشبكات",
                "description": "مقدمة إلى شبكات الحاسوب.",
                "type": "TEXT",
                "text": """
شبكة الحاسوب هي مجموعة من الأجهزة المتصلة معًا
بهدف مشاركة البيانات والموارد والخدمات.
""",
            },
            {
                "title": "الإنترنت",
                "description": "التعرف على مفهوم الإنترنت وطريقة عمله.",
                "type": "VIDEO",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                "title": "أجهزة الشبكات الأساسية",
                "description": "التعرف على Router وSwitch وغيرها.",
                "type": "TEXT",
                "text": """
من أهم أجهزة الشبكات:

- Router
- Switch
- Access Point
- Modem

تساعد هذه الأجهزة في ربط الحواسيب وتبادل البيانات.
""",
            },
        ],
    },

    # =====================================================
    # 2. PYTHON PROGRAMMING
    # =====================================================

    "python-programming-fundamentals": {

        1: [
            {
                "title": "مقدمة إلى Python",
                "description": "التعرف على لغة Python ومميزاتها.",
                "type": "TEXT",
                "text": """
Python هي لغة برمجة عالية المستوى وسهلة القراءة
وتستخدم في تطوير التطبيقات وتحليل البيانات والذكاء الاصطناعي
وتطوير الويب وغيرها من المجالات.
""",
            },
            {
                "title": "تثبيت Python وبيئة التطوير",
                "description": "التعرف على الأدوات المستخدمة لكتابة Python.",
                "type": "VIDEO",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                "title": "Python Programming Diagram",
                "description": "رسم توضيحي لمكونات برنامج Python.",
                "type": "MEDIA",
                "media_name": "python-programming-demo.svg",
            },
        ],

        2: [
            {
                "title": "المتغيرات",
                "description": "التعرف على المتغيرات في Python.",
                "type": "TEXT",
                "text": """
المتغير يستخدم لتخزين البيانات داخل البرنامج.

مثال:

name = "Ahmed"
age = 20
""",
            },
            {
                "title": "أنواع البيانات",
                "description": "التعرف على أنواع البيانات الأساسية.",
                "type": "VIDEO",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                "title": "العمليات الأساسية",
                "description": "التعامل مع العمليات الحسابية والمنطقية.",
                "type": "TEXT",
                "text": """
يمكن استخدام Python لإجراء العمليات الحسابية
مثل الجمع والطرح والضرب والقسمة.

كما يمكن استخدام العمليات المنطقية للمقارنة بين القيم.
""",
            },
        ],

        3: [
            {
                "title": "الشروط في Python",
                "description": "استخدام if وelse.",
                "type": "TEXT",
                "text": """
تستخدم الجمل الشرطية لتنفيذ تعليمات معينة
بناءً على تحقق شرط محدد.

مثال:

if age >= 18:
    print("Adult")
""",
            },
            {
                "title": "الحلقات التكرارية",
                "description": "استخدام for وwhile.",
                "type": "VIDEO",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                "title": "تطبيق عملي على الشروط والحلقات",
                "description": "تطبيق المفاهيم السابقة في برنامج بسيط.",
                "type": "TEXT",
                "text": """
يمكن دمج الشروط والحلقات لبناء برامج تقوم
بتكرار العمليات واتخاذ القرارات حسب البيانات.
""",
            },
        ],

        4: [
            {
                "title": "الدوال Functions",
                "description": "التعرف على الدوال وكيفية استخدامها.",
                "type": "TEXT",
                "text": """
الدالة هي مجموعة من التعليمات التي يمكن إعادة استخدامها
في أكثر من مكان داخل البرنامج.

مثال:

def hello():
    print("Hello")
""",
            },
            {
                "title": "مقدمة إلى OOP",
                "description": "التعرف على مفهوم البرمجة الكائنية.",
                "type": "VIDEO",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                "title": "Classes وObjects",
                "description": "التعرف على Classes وObjects في Python.",
                "type": "MATERIAL",
                "material_name": "python-oop-summary.pdf",
            },
        ],
    },

    # =====================================================
    # 3. WEB DEVELOPMENT
    # =====================================================

    "web-development": {

        1: [
            {
                "title": "مقدمة إلى HTML",
                "description": "التعرف على HTML وبنية صفحات الويب.",
                "type": "TEXT",
                "text": """
HTML هي اللغة الأساسية المستخدمة لبناء هيكل صفحات الويب.

تستخدم العناصر مثل:

h1
p
a
img
div

لبناء محتوى الصفحة.
""",
            },
            {
                "title": "العناصر الأساسية في HTML",
                "description": "التعرف على أهم عناصر HTML.",
                "type": "VIDEO",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                "title": "HTML Structure",
                "description": "رسم توضيحي لبنية صفحة HTML.",
                "type": "MEDIA",
                "media_name": "html-structure-demo.svg",
            },
        ],

        2: [
            {
                "title": "مقدمة إلى CSS",
                "description": "التعرف على CSS وتنسيق صفحات الويب.",
                "type": "TEXT",
                "text": """
CSS تستخدم للتحكم في مظهر صفحات HTML.

يمكن من خلالها تحديد:

- الألوان
- الخطوط
- الأحجام
- المسافات
- التخطيط
""",
            },
            {
                "title": "Flexbox وGrid",
                "description": "بناء تخطيطات حديثة باستخدام CSS.",
                "type": "VIDEO",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                "title": "Responsive Design",
                "description": "إنشاء صفحات متجاوبة مع مختلف الشاشات.",
                "type": "TEXT",
                "text": """
التصميم المتجاوب يجعل الموقع يعمل بشكل مناسب
على أجهزة الكمبيوتر والهواتف والأجهزة اللوحية.
""",
            },
        ],

        3: [
            {
                "title": "مقدمة إلى JavaScript",
                "description": "التعرف على JavaScript ودورها في الويب.",
                "type": "TEXT",
                "text": """
JavaScript لغة برمجة تستخدم لإضافة التفاعل
والسلوك الديناميكي إلى صفحات الويب.
""",
            },
            {
                "title": "Variables وData Types",
                "description": "التعامل مع المتغيرات وأنواع البيانات.",
                "type": "VIDEO",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                "title": "Conditions وLoops",
                "description": "استخدام الشروط والحلقات في JavaScript.",
                "type": "TEXT",
                "text": """
يمكن استخدام if وelse والحلقات لتنفيذ منطق
البرنامج والتعامل مع البيانات.
""",
            },
        ],

        4: [
            {
                "title": "ما هو DOM؟",
                "description": "التعرف على Document Object Model.",
                "type": "TEXT",
                "text": """
DOM هو تمثيل لصفحة HTML يسمح لـ JavaScript
بالوصول إلى عناصر الصفحة وتعديلها.
""",
            },
            {
                "title": "Events",
                "description": "التعامل مع أحداث المستخدم.",
                "type": "VIDEO",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                "title": "ملخص تطوير واجهات الويب",
                "description": "ملف مرجعي للمفاهيم الأساسية في Web Development.",
                "type": "MATERIAL",
                "material_name": "web-development-summary.pdf",
            },
        ],
    },

    # =====================================================
    # 4. DJANGO & DRF
    # =====================================================

    "django-drf-backend": {

        1: [
            {
                "title": "مقدمة إلى Django",
                "description": "التعرف على Django وبنية المشاريع.",
                "type": "TEXT",
                "text": """
Django هو إطار عمل Python يستخدم لبناء تطبيقات الويب.

يوفر Django العديد من الأدوات الجاهزة مثل:

Models
Views
URLs
Admin
""",
            },
            {
                "title": "إنشاء مشروع Django",
                "description": "إنشاء أول مشروع وتطبيق Django.",
                "type": "VIDEO",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                "title": "Django Architecture",
                "description": "رسم توضيحي لبنية Django.",
                "type": "MEDIA",
                "media_name": "django-architecture-demo.svg",
            },
        ],

        2: [
            {
                "title": "Django Models",
                "description": "إنشاء Models وربطها بقاعدة البيانات.",
                "type": "TEXT",
                "text": """
Models تستخدم لتعريف البيانات التي سيتم تخزينها
في قاعدة البيانات.

كل Model يمثل عادة جدولًا في قاعدة البيانات.
""",
            },
            {
                "title": "Django ORM",
                "description": "التعامل مع قاعدة البيانات باستخدام ORM.",
                "type": "VIDEO",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                "title": "Relationships",
                "description": "التعامل مع العلاقات بين Models.",
                "type": "TEXT",
                "text": """
يمكن إنشاء علاقات بين البيانات باستخدام:

ForeignKey
OneToOneField
ManyToManyField
""",
            },
        ],

        3: [
            {
                "title": "مقدمة إلى REST API",
                "description": "فهم REST وHTTP وAPI.",
                "type": "TEXT",
                "text": """
REST API تسمح للتطبيقات المختلفة بالتواصل
وتبادل البيانات باستخدام HTTP.

من أشهر العمليات:

GET
POST
PUT
PATCH
DELETE
""",
            },
            {
                "title": "Serializers",
                "description": "تحويل البيانات والتحقق منها.",
                "type": "VIDEO",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                "title": "ViewSets وRouters",
                "description": "إنشاء وتنظيم API endpoints.",
                "type": "TEXT",
                "text": """
يوفر Django REST Framework أدوات لبناء APIs
بشكل منظم باستخدام ViewSets وRouters.
""",
            },
        ],

        4: [
            {
                "title": "Authentication",
                "description": "التعرف على Authentication في API.",
                "type": "TEXT",
                "text": """
Authentication تستخدم للتحقق من هوية المستخدم
قبل السماح له بالوصول إلى الموارد المحمية.
""",
            },
            {
                "title": "JWT Authentication",
                "description": "التعرف على JWT واستخدامه مع REST API.",
                "type": "VIDEO",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                "title": "ملخص Django REST Framework",
                "description": "ملف مرجعي للمفاهيم الأساسية في DRF.",
                "type": "MATERIAL",
                "material_name": "django-rest-framework-summary.pdf",
            },
        ],
    },

    # =====================================================
    # 5. FULL STACK
    # =====================================================

    "nextjs-django-full-stack": {

        1: [
            {
                "title": "ما هو Full Stack؟",
                "description": "التعرف على مكونات تطبيقات Full Stack.",
                "type": "TEXT",
                "text": """
تطبيق Full Stack يتكون عادة من:

Frontend
Backend
Database

ويتعاون كل جزء مع الأجزاء الأخرى لبناء التطبيق الكامل.
""",
            },
            {
                "title": "Full Stack Architecture",
                "description": "فهم العلاقة بين أجزاء النظام.",
                "type": "VIDEO",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                "title": "Full Stack Architecture Diagram",
                "description": "رسم توضيحي لمعمارية تطبيق Full Stack.",
                "type": "MEDIA",
                "media_name": "full-stack-architecture-demo.svg",
            },
        ],

        2: [
            {
                "title": "مقدمة إلى Next.js",
                "description": "التعرف على Next.js وبنية التطبيق.",
                "type": "TEXT",
                "text": """
Next.js إطار عمل مبني على React
ويستخدم لبناء تطبيقات ويب حديثة.
""",
            },
            {
                "title": "App Router",
                "description": "التعامل مع المسارات في Next.js.",
                "type": "VIDEO",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                "title": "Server وClient Components",
                "description": "فهم الفرق بين أنواع المكونات.",
                "type": "TEXT",
                "text": """
Next.js يوفر Server Components وClient Components
ويمكن استخدام كل نوع حسب احتياجات التطبيق.
""",
            },
        ],

        3: [
            {
                "title": "ربط Next.js مع API",
                "description": "التعامل مع REST API من الواجهة.",
                "type": "TEXT",
                "text": """
يمكن لتطبيق Next.js إرسال requests
إلى Django REST API للحصول على البيانات أو تعديلها.
""",
            },
            {
                "title": "Authentication Flow",
                "description": "تنفيذ تدفق تسجيل الدخول.",
                "type": "VIDEO",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                "title": "Forms وValidation",
                "description": "إنشاء النماذج والتحقق من البيانات.",
                "type": "TEXT",
                "text": """
يجب التحقق من البيانات في الواجهة
ثم إرسالها إلى Backend للتحقق النهائي ومعالجتها.
""",
            },
        ],

        4: [
            {
                "title": "PostgreSQL",
                "description": "التعرف على PostgreSQL كقاعدة بيانات.",
                "type": "TEXT",
                "text": """
PostgreSQL نظام إدارة قواعد بيانات علائقية
مفتوح المصدر ويدعم التطبيقات الكبيرة.
""",
            },
            {
                "title": "ربط Django مع PostgreSQL",
                "description": "إعداد Django للعمل مع PostgreSQL.",
                "type": "VIDEO",
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            {
                "title": "Full Stack Project Guide",
                "description": "ملف مرجعي لبناء مشروع Full Stack.",
                "type": "MATERIAL",
                "material_name": "full-stack-project-guide.pdf",
            },
        ],
    },
}


# =========================================================
# DEMO FILE GENERATORS
# =========================================================

def create_demo_svg(lesson_title):
    """
    Creates a simple SVG file for MEDIA lessons.
    """

    svg = f"""<?xml version="1.0" encoding="UTF-8"?>

<svg
    xmlns="http://www.w3.org/2000/svg"
    width="1200"
    height="675"
    viewBox="0 0 1200 675"
>
    <rect
        width="1200"
        height="675"
        fill="#f3f4f6"
    />

    <rect
        x="80"
        y="80"
        width="1040"
        height="515"
        rx="24"
        fill="#ffffff"
        stroke="#d1d5db"
        stroke-width="3"
    />

    <text
        x="600"
        y="290"
        text-anchor="middle"
        font-family="Arial"
        font-size="42"
        font-weight="bold"
        fill="#111827"
    >
        {lesson_title}
    </text>

    <text
        x="600"
        y="350"
        text-anchor="middle"
        font-family="Arial"
        font-size="26"
        fill="#6b7280"
    >
        Demo Media Content
    </text>

    <text
        x="600"
        y="400"
        text-anchor="middle"
        font-family="Arial"
        font-size="20"
        fill="#9ca3af"
    >
        Adaptive Learning Platform
    </text>
</svg>
"""

    return svg.encode("utf-8")


def create_demo_pdf(lesson_title):
    """
    Creates a minimal valid PDF file for MATERIAL lessons.
    """

    content = (
        f"BT\n"
        f"/F1 20 Tf\n"
        f"100 700 Td\n"
        f"({lesson_title}) Tj\n"
        f"0 -40 Td\n"
        f"/F1 12 Tf\n"
        f"(Demo Learning Material) Tj\n"
        f"ET\n"
    )

    objects = []

    objects.append(
        "<< /Type /Catalog /Pages 2 0 R >>"
    )

    objects.append(
        "<< /Type /Pages /Kids [3 0 R] /Count 1 >>"
    )

    objects.append(
        """
<<
    /Type /Page
    /Parent 2 0 R
    /MediaBox [0 0 595 842]
    /Resources <<
        /Font <<
            /F1 5 0 R
        >>
    >>
    /Contents 4 0 R
>>
""".strip()
    )

    objects.append(
        f"<< /Length {len(content.encode('latin-1', 'replace'))} >>\n"
        f"stream\n"
        f"{content}"
        f"endstream"
    )

    objects.append(
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
    )

    pdf = "%PDF-1.4\n"

    offsets = [0]

    for index, obj in enumerate(objects, start=1):

        offsets.append(
            len(pdf.encode("latin-1", "replace"))
        )

        pdf += f"{index} 0 obj\n"
        pdf += obj
        pdf += "\nendobj\n"

    xref_offset = len(
        pdf.encode("latin-1", "replace")
    )

    pdf += "xref\n"
    pdf += f"0 {len(objects) + 1}\n"
    pdf += "0000000000 65535 f \n"

    for offset in offsets[1:]:
        pdf += f"{offset:010d} 00000 n \n"

    pdf += "trailer\n"
    pdf += f"<< /Size {len(objects) + 1} /Root 1 0 R >>\n"
    pdf += "startxref\n"
    pdf += f"{xref_offset}\n"
    pdf += "%%EOF\n"

    return pdf.encode("latin-1", "replace")


# =========================================================
# SEED FUNCTION
# =========================================================

@transaction.atomic
def seed_lessons():

    lessons_created = 0
    contents_created = 0

    print("=" * 70)
    print("STARTING LESSONS SEED")
    print("=" * 70)

    for course_slug, sections in LESSONS.items():

        try:
            course = Course.objects.get(
                slug=course_slug
            )

        except Course.DoesNotExist:

            print(
                f"\nERROR: Course not found: "
                f"{course_slug}"
            )

            continue

        print()
        print("=" * 60)
        print(f"COURSE: {course.title}")
        print("=" * 60)

        for section_order, lessons in sections.items():

            try:
                section = CourseSection.objects.get(
                    course=course,
                    order=section_order,
                )

            except CourseSection.DoesNotExist:

                print(
                    f"ERROR: Section {section_order} "
                    f"not found in {course.title}"
                )

                continue

            print()
            print(
                f"Section {section_order}: "
                f"{section.title}"
            )

            for lesson_order, lesson_data in enumerate(
                lessons,
                start=1,
            ):

                # =========================================
                # CREATE LESSON
                # =========================================

                lesson, lesson_created = (
                    Lesson.objects.get_or_create(
                        section=section,
                        order=lesson_order,
                        defaults={
                            "title": lesson_data["title"],
                            "description": lesson_data[
                                "description"
                            ],
                            "type": lesson_data["type"],
                            "duration_seconds": (
                                lesson_data.get(
                                    "duration_seconds"
                                )
                            ),
                        },
                    )
                )

                if lesson_created:

                    lessons_created += 1

                    print(
                        f"   ✓ Lesson {lesson_order}: "
                        f"{lesson.title}"
                    )

                else:

                    print(
                        f"   → Lesson {lesson_order} موجود: "
                        f"{lesson.title}"
                    )

                # =========================================
                # CONTENT DEFAULTS
                # =========================================

                content_defaults = {
                    "video_url": "",
                    "text": "",
                }

                # =========================================
                # VIDEO
                # =========================================

                if lesson.type == Lesson.LessonType.VIDEO:

                    content_defaults["video_url"] = (
                        lesson_data.get(
                            "video_url",
                            "",
                        )
                    )

                # =========================================
                # TEXT
                # =========================================

                elif lesson.type == Lesson.LessonType.TEXT:

                    content_defaults["text"] = (
                        lesson_data.get(
                            "text",
                            "",
                        )
                    )

                # =========================================
                # MEDIA
                # =========================================

                elif lesson.type == Lesson.LessonType.MEDIA:

                    media_name = lesson_data.get(
                        "media_name",
                        f"lesson-{lesson.id}.svg",
                    )

                    svg_content = create_demo_svg(
                        lesson.title
                    )

                    content_defaults["media_file"] = (
                        ContentFile(
                            svg_content,
                            name=media_name,
                        )
                    )

                # =========================================
                # MATERIAL
                # =========================================

                elif lesson.type == Lesson.LessonType.MATERIAL:

                    material_name = lesson_data.get(
                        "material_name",
                        f"lesson-{lesson.id}.pdf",
                    )

                    pdf_content = create_demo_pdf(
                        lesson.title
                    )

                    content_defaults["material_file"] = (
                        ContentFile(
                            pdf_content,
                            name=material_name,
                        )
                    )

                # =========================================
                # CREATE CONTENT
                # =========================================

                content, content_created = (
                    LessonContent.objects.get_or_create(
                        lesson=lesson,
                        defaults=content_defaults,
                    )
                )

                if content_created:

                    contents_created += 1

                    print(
                        f"      ✓ Content: "
                        f"{lesson.type}"
                    )

                else:

                    print(
                        f"      → Content موجود: "
                        f"{lesson.type}"
                    )

    # =====================================================
    # FINAL RESULT
    # =====================================================

    print()
    print("=" * 70)
    print("LESSONS SEED COMPLETED")
    print("=" * 70)
    print(
        f"Lessons created:  {lessons_created}"
    )
    print(
        f"Contents created: {contents_created}"
    )
    print("=" * 70)


# =========================================================
# RUN
# =========================================================

if __name__ == "__main__":
    seed_lessons()