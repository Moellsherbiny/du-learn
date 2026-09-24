import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")
django.setup()

from django.contrib.auth import get_user_model
from django.db import transaction

from apps.courses.models import Course, CourseSection


User = get_user_model()


COURSES = [
    # =========================================================
    # 1. COMPUTER SCIENCE FUNDAMENTALS
    # =========================================================

    {
        "title": "أساسيات علوم الحاسب",
        "slug": "computer-science-fundamentals",
        "category": Course.Category.FOUNDATION,
        "description": (
            "تعلم أساسيات علوم الحاسب ومكونات الحاسوب وأنظمة التشغيل "
            "والشبكات ومفاهيم التكنولوجيا الأساسية."
        ),
        "sections": [
            {
                "title": "مقدمة إلى علوم الحاسب",
                "description": (
                    "التعرف على مفهوم علوم الحاسب وتطور الحاسوب "
                    "ومجالات استخدام التكنولوجيا."
                ),
            },
            {
                "title": "مكونات الحاسوب",
                "description": (
                    "التعرف على المكونات المادية والبرمجية للحاسوب "
                    "ووظيفة كل مكون."
                ),
            },
            {
                "title": "أنظمة التشغيل والبرمجيات",
                "description": (
                    "فهم أنظمة التشغيل والبرامج والتطبيقات "
                    "وكيفية تعاملها مع مكونات الحاسوب."
                ),
            },
            {
                "title": "أساسيات الشبكات والإنترنت",
                "description": (
                    "مقدمة إلى الشبكات والإنترنت وكيفية اتصال الأجهزة "
                    "وتبادل البيانات."
                ),
            },
        ],
    },

    # =========================================================
    # 2. PYTHON PROGRAMMING
    # =========================================================

    {
        "title": "أساسيات البرمجة باستخدام Python",
        "slug": "python-programming-fundamentals",
        "category": Course.Category.BACKEND,
        "description": (
            "تعلم أساسيات لغة Python والتفكير البرمجي "
            "وكتابة برامج بسيطة ومنظمة."
        ),
        "sections": [
            {
                "title": "مقدمة إلى Python",
                "description": (
                    "التعرف على Python وطريقة كتابة البرامج "
                    "وتنفيذ أول برنامج."
                ),
            },
            {
                "title": "المتغيرات وأنواع البيانات",
                "description": (
                    "التعامل مع المتغيرات وأنواع البيانات "
                    "والعمليات الأساسية في Python."
                ),
            },
            {
                "title": "الشروط والحلقات",
                "description": (
                    "استخدام if وelse والحلقات التكرارية "
                    "لبناء منطق البرامج."
                ),
            },
            {
                "title": "الدوال والبرمجة الكائنية",
                "description": (
                    "تنظيم الكود باستخدام Functions "
                    "والتعرف على أساسيات OOP."
                ),
            },
        ],
    },

    # =========================================================
    # 3. WEB DEVELOPMENT
    # =========================================================

    {
        "title": "تطوير واجهات الويب",
        "slug": "web-development",
        "category": Course.Category.FRONTEND,
        "description": (
            "تعلم بناء واجهات ويب حديثة باستخدام HTML وCSS "
            "وJavaScript."
        ),
        "sections": [
            {
                "title": "أساسيات HTML",
                "description": (
                    "التعرف على بنية صفحات الويب "
                    "والعناصر الأساسية في HTML."
                ),
            },
            {
                "title": "CSS وتنسيق الصفحات",
                "description": (
                    "تنسيق صفحات الويب باستخدام CSS "
                    "والتعامل مع الألوان والخطوط والتخطيط."
                ),
            },
            {
                "title": "JavaScript Fundamentals",
                "description": (
                    "التعرف على المتغيرات والشروط والحلقات "
                    "والدوال في JavaScript."
                ),
            },
            {
                "title": "DOM والتفاعل مع المستخدم",
                "description": (
                    "التعامل مع عناصر الصفحة والأحداث "
                    "وبناء صفحات ويب تفاعلية."
                ),
            },
        ],
    },

    # =========================================================
    # 4. DJANGO & DRF
    # =========================================================

    {
        "title": "تطوير Backend باستخدام Django وDRF",
        "slug": "django-drf-backend",
        "category": Course.Category.BACKEND,
        "description": (
            "تعلم بناء تطبيقات Backend وREST APIs باستخدام "
            "Django وDjango REST Framework."
        ),
        "sections": [
            {
                "title": "مقدمة إلى Django",
                "description": (
                    "التعرف على Django وبنية المشروع "
                    "وإنشاء أول تطبيق."
                ),
            },
            {
                "title": "Models وقواعد البيانات",
                "description": (
                    "إنشاء Models والتعامل مع قاعدة البيانات "
                    "والعلاقات باستخدام Django ORM."
                ),
            },
            {
                "title": "Django REST Framework",
                "description": (
                    "بناء REST APIs باستخدام Serializers "
                    "وViews وViewSets وRouters."
                ),
            },
            {
                "title": "Authentication والصلاحيات",
                "description": (
                    "إضافة تسجيل الدخول وحماية API "
                    "وإدارة صلاحيات المستخدمين."
                ),
            },
        ],
    },

    # =========================================================
    # 5. FULL STACK
    # =========================================================

    {
        "title": "Full Stack باستخدام Next.js وDjango",
        "slug": "nextjs-django-full-stack",
        "category": Course.Category.FULLSTACK,
        "description": (
            "تعلم بناء تطبيق Full Stack متكامل باستخدام "
            "Next.js في الواجهة وDjango REST Framework في Backend."
        ),
        "sections": [
            {
                "title": "بنية تطبيق Full Stack",
                "description": (
                    "فهم العلاقة بين Frontend وBackend "
                    "وقاعدة البيانات وكيفية بناء النظام."
                ),
            },
            {
                "title": "Next.js Frontend",
                "description": (
                    "بناء واجهة المستخدم باستخدام Next.js "
                    "وReact والتعامل مع الصفحات والمكونات."
                ),
            },
            {
                "title": "ربط Next.js مع Django API",
                "description": (
                    "ربط الواجهة مع Django REST API "
                    "وجلب وإرسال البيانات."
                ),
            },
            {
                "title": "PostgreSQL وDeployment",
                "description": (
                    "ربط التطبيق بقاعدة PostgreSQL "
                    "وتجهيز المشروع للنشر."
                ),
            },
        ],
    },
]


# =========================================================
# SEED COURSES
# =========================================================

@transaction.atomic
def seed_courses():

    teacher = (
        User.objects
        .filter(role=User.Role.TEACHER)
        .order_by("id")
        .first()
    )

    if not teacher:
        print("ERROR: لا يوجد Teacher في قاعدة البيانات.")
        print("أنشئ Teacher أولًا ثم شغل السكريبت مرة أخرى.")
        return

    print("=" * 60)
    print(f"Teacher: {teacher.email}")
    print("=" * 60)

    courses_created = 0
    sections_created = 0

    for course_data in COURSES:

        course, created = Course.objects.get_or_create(
            slug=course_data["slug"],
            defaults={
                "teacher": teacher,
                "title": course_data["title"],
                "description": course_data["description"],
                "category": course_data["category"],
                "visibility": Course.Visibility.PUBLIC,
            },
        )

        if created:
            courses_created += 1
            print(f"\n✓ Course: {course.title}")
        else:
            print(f"\n→ موجود بالفعل: {course.title}")

        for order, section_data in enumerate(
            course_data["sections"],
            start=1,
        ):

            section, created = CourseSection.objects.get_or_create(
                course=course,
                order=order,
                defaults={
                    "title": section_data["title"],
                    "description": section_data["description"],
                },
            )

            if created:
                sections_created += 1
                print(
                    f"   ✓ Section {order}: "
                    f"{section.title}"
                )
            else:
                print(
                    f"   → Section {order} موجود: "
                    f"{section.title}"
                )

    print()
    print("=" * 60)
    print("SEED COMPLETED")
    print("=" * 60)
    print(f"Courses created:  {courses_created}")
    print(f"Sections created: {sections_created}")
    print("=" * 60)


if __name__ == "__main__":
    seed_courses()