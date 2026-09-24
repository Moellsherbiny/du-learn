import os
import django

os.environ.setdefault(
"DJANGO_SETTINGS_MODULE",
"config.settings.development",
)

django.setup()

from django.db import transaction

from apps.courses.models import Course
from apps.lessons.models import Lesson
from apps.assessments.models import (
Assessment,
Question,
Choice,
)

# =========================================================

# ASSESSMENTS DATA

# =========================================================

ASSESSMENTS = {
# =====================================================
# 1. COMPUTER SCIENCE FUNDAMENTALS
# =====================================================

"computer-science-fundamentals": {
    1: {
        "title": "اختبار مقدمة إلى علوم الحاسب",
        "description": (
            "اختبار قصير لقياس فهم المفاهيم الأساسية "
            "في علوم الحاسب."
        ),
        "type": Assessment.AssessmentType.QUIZ,
        "time_limit_minutes": 10,
        "passing_score": 50,
        "max_attempts": 3,
        "questions": [
            {
                "text": "ما المجال الذي يهتم بدراسة الحاسوب والبيانات والخوارزميات؟",
                "type": Question.QuestionType.SINGLE_CHOICE,
                "points": 1,
                "order": 1,
                "choices": [
                    {
                        "text": "علوم الحاسب",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "التصميم الجرافيكي",
                        "is_correct": False,
                        "order": 2,
                    },
                    {
                        "text": "إدارة الأعمال",
                        "is_correct": False,
                        "order": 3,
                    },
                    {
                        "text": "المحاسبة",
                        "is_correct": False,
                        "order": 4,
                    },
                ],
            },
            {
                "text": "أي من العناصر التالية ترتبط بعلوم الحاسب؟",
                "type": Question.QuestionType.MULTIPLE_CHOICE,
                "points": 2,
                "order": 2,
                "choices": [
                    {
                        "text": "الخوارزميات",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "البيانات",
                        "is_correct": True,
                        "order": 2,
                    },
                    {
                        "text": "معالجة المعلومات",
                        "is_correct": True,
                        "order": 3,
                    },
                    {
                        "text": "الزراعة فقط",
                        "is_correct": False,
                        "order": 4,
                    },
                ],
            },
            {
                "text": "علوم الحاسب تدرس طرق معالجة المعلومات.",
                "type": Question.QuestionType.TRUE_FALSE,
                "points": 1,
                "order": 3,
                "choices": [
                    {
                        "text": "صحيح",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "خطأ",
                        "is_correct": False,
                        "order": 2,
                    },
                ],
            },
        ],
    },

    2: {
        "title": "اختبار مكونات الحاسوب",
        "description": (
            "اختبار للتحقق من فهم المكونات المادية "
            "والبرمجية للحاسوب."
        ),
        "type": Assessment.AssessmentType.QUIZ,
        "time_limit_minutes": 12,
        "passing_score": 60,
        "max_attempts": 3,
        "questions": [
            {
                "text": "ماذا يعني Hardware؟",
                "type": Question.QuestionType.SINGLE_CHOICE,
                "points": 1,
                "order": 1,
                "choices": [
                    {
                        "text": "المكونات المادية للحاسوب",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "البرامج",
                        "is_correct": False,
                        "order": 2,
                    },
                    {
                        "text": "نظام التشغيل فقط",
                        "is_correct": False,
                        "order": 3,
                    },
                    {
                        "text": "الشبكة",
                        "is_correct": False,
                        "order": 4,
                    },
                ],
            },
            {
                "text": "أي من التالي يعتبر من Hardware؟",
                "type": Question.QuestionType.MULTIPLE_CHOICE,
                "points": 2,
                "order": 2,
                "choices": [
                    {
                        "text": "CPU",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "RAM",
                        "is_correct": True,
                        "order": 2,
                    },
                    {
                        "text": "Motherboard",
                        "is_correct": True,
                        "order": 3,
                    },
                    {
                        "text": "Operating System",
                        "is_correct": False,
                        "order": 4,
                    },
                ],
            },
            {
                "text": "Software هي الأجزاء الفيزيائية التي يمكن لمسها.",
                "type": Question.QuestionType.TRUE_FALSE,
                "points": 1,
                "order": 3,
                "choices": [
                    {
                        "text": "صحيح",
                        "is_correct": False,
                        "order": 1,
                    },
                    {
                        "text": "خطأ",
                        "is_correct": True,
                        "order": 2,
                    },
                ],
            },
        ],
    },

    3: {
        "title": "تقييم أنظمة التشغيل",
        "description": (
            "تقييم قصير حول مفهوم أنظمة التشغيل "
            "ووظائفها الأساسية."
        ),
        "type": Assessment.AssessmentType.PRACTICE,
        "time_limit_minutes": 15,
        "passing_score": 50,
        "max_attempts": None,
        "questions": [
            {
                "text": "ما الوظيفة الأساسية لنظام التشغيل؟",
                "type": Question.QuestionType.SINGLE_CHOICE,
                "points": 1,
                "order": 1,
                "choices": [
                    {
                        "text": "إدارة موارد الحاسوب وتشغيل التطبيقات",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "تصميم الصور فقط",
                        "is_correct": False,
                        "order": 2,
                    },
                    {
                        "text": "إنتاج الكهرباء",
                        "is_correct": False,
                        "order": 3,
                    },
                ],
            },
            {
                "text": "أي من التالي يعتبر نظام تشغيل؟",
                "type": Question.QuestionType.MULTIPLE_CHOICE,
                "points": 2,
                "order": 2,
                "choices": [
                    {
                        "text": "Windows",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "Linux",
                        "is_correct": True,
                        "order": 2,
                    },
                    {
                        "text": "macOS",
                        "is_correct": True,
                        "order": 3,
                    },
                    {
                        "text": "HTML",
                        "is_correct": False,
                        "order": 4,
                    },
                ],
            },
        ],
    },

    4: {
        "title": "اختبار أساسيات الشبكات والإنترنت",
        "description": (
            "اختبار نهائي بسيط حول أساسيات الشبكات "
            "والإنترنت وأجهزة الشبكات."
        ),
        "type": Assessment.AssessmentType.EXAM,
        "time_limit_minutes": 20,
        "passing_score": 60,
        "max_attempts": 2,
        "questions": [
            {
                "text": "ما الهدف الأساسي من شبكة الحاسوب؟",
                "type": Question.QuestionType.SINGLE_CHOICE,
                "points": 1,
                "order": 1,
                "choices": [
                    {
                        "text": "مشاركة البيانات والموارد والخدمات",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "تشغيل الشاشة فقط",
                        "is_correct": False,
                        "order": 2,
                    },
                    {
                        "text": "زيادة حجم الجهاز",
                        "is_correct": False,
                        "order": 3,
                    },
                ],
            },
            {
                "text": "أي من التالي من أجهزة الشبكات؟",
                "type": Question.QuestionType.MULTIPLE_CHOICE,
                "points": 2,
                "order": 2,
                "choices": [
                    {
                        "text": "Router",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "Switch",
                        "is_correct": True,
                        "order": 2,
                    },
                    {
                        "text": "Access Point",
                        "is_correct": True,
                        "order": 3,
                    },
                    {
                        "text": "CPU",
                        "is_correct": False,
                        "order": 4,
                    },
                ],
            },
        ],
    },
},

# =====================================================
# 2. PYTHON
# =====================================================

"python-programming-fundamentals": {
    1: {
        "title": "اختبار مقدمة Python",
        "description": "اختبار حول أساسيات لغة Python.",
        "type": Assessment.AssessmentType.QUIZ,
        "time_limit_minutes": 10,
        "passing_score": 50,
        "max_attempts": 3,
        "questions": [
            {
                "text": "ما هي Python؟",
                "type": Question.QuestionType.SINGLE_CHOICE,
                "points": 1,
                "order": 1,
                "choices": [
                    {
                        "text": "لغة برمجة عالية المستوى",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "نظام تشغيل",
                        "is_correct": False,
                        "order": 2,
                    },
                    {
                        "text": "قاعدة بيانات",
                        "is_correct": False,
                        "order": 3,
                    },
                ],
            },
            {
                "text": "يمكن استخدام Python في تطوير الويب وتحليل البيانات.",
                "type": Question.QuestionType.TRUE_FALSE,
                "points": 1,
                "order": 2,
                "choices": [
                    {
                        "text": "صحيح",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "خطأ",
                        "is_correct": False,
                        "order": 2,
                    },
                ],
            },
        ],
    },

    2: {
        "title": "اختبار المتغيرات وأنواع البيانات",
        "description": "اختبار حول المتغيرات وأنواع البيانات في Python.",
        "type": Assessment.AssessmentType.QUIZ,
        "time_limit_minutes": 12,
        "passing_score": 60,
        "max_attempts": 3,
        "questions": [
            {
                "text": "ما الغرض من المتغير؟",
                "type": Question.QuestionType.SINGLE_CHOICE,
                "points": 1,
                "order": 1,
                "choices": [
                    {
                        "text": "تخزين البيانات",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "إغلاق البرنامج",
                        "is_correct": False,
                        "order": 2,
                    },
                    {
                        "text": "حذف نظام التشغيل",
                        "is_correct": False,
                        "order": 3,
                    },
                ],
            },
            {
                "text": "أي من التالي يمكن تخزينه في متغير؟",
                "type": Question.QuestionType.MULTIPLE_CHOICE,
                "points": 2,
                "order": 2,
                "choices": [
                    {
                        "text": "نص",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "رقم",
                        "is_correct": True,
                        "order": 2,
                    },
                    {
                        "text": "قيمة منطقية",
                        "is_correct": True,
                        "order": 3,
                    },
                    {
                        "text": "شاشة الحاسوب نفسها",
                        "is_correct": False,
                        "order": 4,
                    },
                ],
            },
        ],
    },

    3: {
        "title": "تدريب الشروط والحلقات",
        "description": "تدريب على استخدام الشروط والحلقات في Python.",
        "type": Assessment.AssessmentType.PRACTICE,
        "time_limit_minutes": 15,
        "passing_score": 50,
        "max_attempts": None,
        "questions": [
            {
                "text": "أي كلمة تستخدم لكتابة شرط في Python؟",
                "type": Question.QuestionType.SINGLE_CHOICE,
                "points": 1,
                "order": 1,
                "choices": [
                    {
                        "text": "if",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "loop",
                        "is_correct": False,
                        "order": 2,
                    },
                    {
                        "text": "condition",
                        "is_correct": False,
                        "order": 3,
                    },
                ],
            },
            {
                "text": "يمكن استخدام for وwhile لإنشاء حلقات تكرارية.",
                "type": Question.QuestionType.TRUE_FALSE,
                "points": 1,
                "order": 2,
                "choices": [
                    {
                        "text": "صحيح",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "خطأ",
                        "is_correct": False,
                        "order": 2,
                    },
                ],
            },
        ],
    },

    4: {
        "title": "امتحان الدوال والبرمجة الكائنية",
        "description": "اختبار شامل حول Functions وOOP.",
        "type": Assessment.AssessmentType.EXAM,
        "time_limit_minutes": 20,
        "passing_score": 60,
        "max_attempts": 2,
        "questions": [
            {
                "text": "ما الكلمة المستخدمة لتعريف Function في Python؟",
                "type": Question.QuestionType.SINGLE_CHOICE,
                "points": 1,
                "order": 1,
                "choices": [
                    {
                        "text": "def",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "function",
                        "is_correct": False,
                        "order": 2,
                    },
                    {
                        "text": "func",
                        "is_correct": False,
                        "order": 3,
                    },
                ],
            },
            {
                "text": "أي من التالي يرتبط بالبرمجة الكائنية؟",
                "type": Question.QuestionType.MULTIPLE_CHOICE,
                "points": 2,
                "order": 2,
                "choices": [
                    {
                        "text": "Classes",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "Objects",
                        "is_correct": True,
                        "order": 2,
                    },
                    {
                        "text": "Methods",
                        "is_correct": True,
                        "order": 3,
                    },
                    {
                        "text": "HTML Tags",
                        "is_correct": False,
                        "order": 4,
                    },
                ],
            },
        ],
    },
},

# =====================================================
# 3. WEB DEVELOPMENT
# =====================================================

"web-development": {
    1: {
        "title": "اختبار أساسيات HTML",
        "description": "اختبار حول HTML وبنية صفحات الويب.",
        "type": Assessment.AssessmentType.QUIZ,
        "time_limit_minutes": 10,
        "passing_score": 50,
        "max_attempts": 3,
        "questions": [
            {
                "text": "ما الاستخدام الأساسي لـ HTML؟",
                "type": Question.QuestionType.SINGLE_CHOICE,
                "points": 1,
                "order": 1,
                "choices": [
                    {
                        "text": "بناء هيكل صفحة الويب",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "إدارة قاعدة البيانات",
                        "is_correct": False,
                        "order": 2,
                    },
                    {
                        "text": "تشغيل نظام التشغيل",
                        "is_correct": False,
                        "order": 3,
                    },
                ],
            },
            {
                "text": "أي من التالي عناصر HTML؟",
                "type": Question.QuestionType.MULTIPLE_CHOICE,
                "points": 2,
                "order": 2,
                "choices": [
                    {
                        "text": "h1",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "p",
                        "is_correct": True,
                        "order": 2,
                    },
                    {
                        "text": "a",
                        "is_correct": True,
                        "order": 3,
                    },
                    {
                        "text": "SELECTOR",
                        "is_correct": False,
                        "order": 4,
                    },
                ],
            },
        ],
    },

    2: {
        "title": "تدريب CSS والتنسيق",
        "description": "تدريب على أساسيات CSS والتصميم المتجاوب.",
        "type": Assessment.AssessmentType.PRACTICE,
        "time_limit_minutes": 15,
        "passing_score": 50,
        "max_attempts": None,
        "questions": [
            {
                "text": "ما الاستخدام الأساسي لـ CSS؟",
                "type": Question.QuestionType.SINGLE_CHOICE,
                "points": 1,
                "order": 1,
                "choices": [
                    {
                        "text": "تنسيق مظهر صفحات الويب",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "إنشاء قاعدة بيانات",
                        "is_correct": False,
                        "order": 2,
                    },
                    {
                        "text": "إدارة الخادم",
                        "is_correct": False,
                        "order": 3,
                    },
                ],
            },
            {
                "text": "يمكن استخدام CSS للتحكم في الألوان والخطوط والمسافات.",
                "type": Question.QuestionType.TRUE_FALSE,
                "points": 1,
                "order": 2,
                "choices": [
                    {
                        "text": "صحيح",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "خطأ",
                        "is_correct": False,
                        "order": 2,
                    },
                ],
            },
        ],
    },

    3: {
        "title": "اختبار JavaScript Fundamentals",
        "description": "اختبار حول أساسيات JavaScript.",
        "type": Assessment.AssessmentType.QUIZ,
        "time_limit_minutes": 12,
        "passing_score": 60,
        "max_attempts": 3,
        "questions": [
            {
                "text": "ما الدور الأساسي لـ JavaScript في صفحات الويب؟",
                "type": Question.QuestionType.SINGLE_CHOICE,
                "points": 1,
                "order": 1,
                "choices": [
                    {
                        "text": "إضافة التفاعل والسلوك الديناميكي",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "بناء قاعدة البيانات",
                        "is_correct": False,
                        "order": 2,
                    },
                    {
                        "text": "استبدال نظام التشغيل",
                        "is_correct": False,
                        "order": 3,
                    },
                ],
            },
            {
                "text": "JavaScript يمكنها التعامل مع المتغيرات والشروط والحلقات.",
                "type": Question.QuestionType.TRUE_FALSE,
                "points": 1,
                "order": 2,
                "choices": [
                    {
                        "text": "صحيح",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "خطأ",
                        "is_correct": False,
                        "order": 2,
                    },
                ],
            },
        ],
    },

    4: {
        "title": "امتحان DOM والتفاعل مع المستخدم",
        "description": "اختبار نهائي حول DOM والأحداث والتفاعل.",
        "type": Assessment.AssessmentType.EXAM,
        "time_limit_minutes": 20,
        "passing_score": 60,
        "max_attempts": 2,
        "questions": [
            {
                "text": "ما هو DOM؟",
                "type": Question.QuestionType.SINGLE_CHOICE,
                "points": 1,
                "order": 1,
                "choices": [
                    {
                        "text": "تمثيل لصفحة HTML يمكن لـ JavaScript التعامل معه",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "لغة برمجة",
                        "is_correct": False,
                        "order": 2,
                    },
                    {
                        "text": "قاعدة بيانات",
                        "is_correct": False,
                        "order": 3,
                    },
                ],
            },
            {
                "text": "أي من التالي يمكن التعامل معه باستخدام JavaScript وDOM؟",
                "type": Question.QuestionType.MULTIPLE_CHOICE,
                "points": 2,
                "order": 2,
                "choices": [
                    {
                        "text": "عناصر الصفحة",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "الأحداث",
                        "is_correct": True,
                        "order": 2,
                    },
                    {
                        "text": "محتوى الصفحة",
                        "is_correct": True,
                        "order": 3,
                    },
                    {
                        "text": "مزود الطاقة Hardware",
                        "is_correct": False,
                        "order": 4,
                    },
                ],
            },
        ],
    },
},

# =====================================================
# 4. DJANGO & DRF
# =====================================================

"django-drf-backend": {
    1: {
        "title": "اختبار مقدمة Django",
        "description": "اختبار حول Django وبنية المشاريع.",
        "type": Assessment.AssessmentType.QUIZ,
        "time_limit_minutes": 10,
        "passing_score": 50,
        "max_attempts": 3,
        "questions": [
            {
                "text": "ما هو Django؟",
                "type": Question.QuestionType.SINGLE_CHOICE,
                "points": 1,
                "order": 1,
                "choices": [
                    {
                        "text": "إطار عمل Python لتطوير الويب",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "قاعدة بيانات",
                        "is_correct": False,
                        "order": 2,
                    },
                    {
                        "text": "لغة برمجة",
                        "is_correct": False,
                        "order": 3,
                    },
                ],
            },
            {
                "text": "Django يوفر أدوات مثل Models وViews وURLs.",
                "type": Question.QuestionType.TRUE_FALSE,
                "points": 1,
                "order": 2,
                "choices": [
                    {
                        "text": "صحيح",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "خطأ",
                        "is_correct": False,
                        "order": 2,
                    },
                ],
            },
        ],
    },

    2: {
        "title": "اختبار Django Models وORM",
        "description": "اختبار حول Models وقواعد البيانات وORM.",
        "type": Assessment.AssessmentType.QUIZ,
        "time_limit_minutes": 15,
        "passing_score": 60,
        "max_attempts": 3,
        "questions": [
            {
                "text": "ما وظيفة Model في Django؟",
                "type": Question.QuestionType.SINGLE_CHOICE,
                "points": 1,
                "order": 1,
                "choices": [
                    {
                        "text": "تعريف البيانات التي يتم تخزينها في قاعدة البيانات",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "عرض الصور فقط",
                        "is_correct": False,
                        "order": 2,
                    },
                    {
                        "text": "تشغيل JavaScript",
                        "is_correct": False,
                        "order": 3,
                    },
                ],
            },
            {
                "text": "أي من التالي يستخدم لإنشاء العلاقات بين Models؟",
                "type": Question.QuestionType.MULTIPLE_CHOICE,
                "points": 2,
                "order": 2,
                "choices": [
                    {
                        "text": "ForeignKey",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "OneToOneField",
                        "is_correct": True,
                        "order": 2,
                    },
                    {
                        "text": "ManyToManyField",
                        "is_correct": True,
                        "order": 3,
                    },
                    {
                        "text": "TextField فقط",
                        "is_correct": False,
                        "order": 4,
                    },
                ],
            },
        ],
    },

    3: {
        "title": "تقييم REST API وDRF",
        "description": "تقييم حول REST API وDjango REST Framework.",
        "type": Assessment.AssessmentType.PRACTICE,
        "time_limit_minutes": 15,
        "passing_score": 50,
        "max_attempts": None,
        "questions": [
            {
                "text": "ما الهدف من REST API؟",
                "type": Question.QuestionType.SINGLE_CHOICE,
                "points": 1,
                "order": 1,
                "choices": [
                    {
                        "text": "السماح للتطبيقات بالتواصل وتبادل البيانات",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "تصميم الصور",
                        "is_correct": False,
                        "order": 2,
                    },
                    {
                        "text": "تشغيل الجهاز",
                        "is_correct": False,
                        "order": 3,
                    },
                ],
            },
            {
                "text": "أي من العمليات التالية من HTTP methods؟",
                "type": Question.QuestionType.MULTIPLE_CHOICE,
                "points": 2,
                "order": 2,
                "choices": [
                    {
                        "text": "GET",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "POST",
                        "is_correct": True,
                        "order": 2,
                    },
                    {
                        "text": "PUT",
                        "is_correct": True,
                        "order": 3,
                    },
                    {
                        "text": "RENDER",
                        "is_correct": False,
                        "order": 4,
                    },
                ],
            },
        ],
    },

    4: {
        "title": "امتحان Authentication وJWT",
        "description": "اختبار نهائي حول Authentication وJWT.",
        "type": Assessment.AssessmentType.EXAM,
        "time_limit_minutes": 20,
        "passing_score": 60,
        "max_attempts": 2,
        "questions": [
            {
                "text": "ما الهدف من Authentication؟",
                "type": Question.QuestionType.SINGLE_CHOICE,
                "points": 1,
                "order": 1,
                "choices": [
                    {
                        "text": "التحقق من هوية المستخدم",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "إنشاء CSS",
                        "is_correct": False,
                        "order": 2,
                    },
                    {
                        "text": "تغيير تصميم الموقع",
                        "is_correct": False,
                        "order": 3,
                    },
                ],
            },
            {
                "text": "JWT يمكن استخدامه في Authentication للـ APIs.",
                "type": Question.QuestionType.TRUE_FALSE,
                "points": 1,
                "order": 2,
                "choices": [
                    {
                        "text": "صحيح",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "خطأ",
                        "is_correct": False,
                        "order": 2,
                    },
                ],
            },
        ],
    },
},

# =====================================================
# 5. FULL STACK
# =====================================================

"nextjs-django-full-stack": {
    1: {
        "title": "اختبار Full Stack Architecture",
        "description": "اختبار حول مكونات تطبيقات Full Stack.",
        "type": Assessment.AssessmentType.QUIZ,
        "time_limit_minutes": 10,
        "passing_score": 50,
        "max_attempts": 3,
        "questions": [
            {
                "text": "ما المكونات الأساسية لتطبيق Full Stack؟",
                "type": Question.QuestionType.MULTIPLE_CHOICE,
                "points": 2,
                "order": 1,
                "choices": [
                    {
                        "text": "Frontend",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "Backend",
                        "is_correct": True,
                        "order": 2,
                    },
                    {
                        "text": "Database",
                        "is_correct": True,
                        "order": 3,
                    },
                    {
                        "text": "Monitor فقط",
                        "is_correct": False,
                        "order": 4,
                    },
                ],
            },
            {
                "text": "Frontend وBackend يمكن أن يتعاونا لبناء تطبيق متكامل.",
                "type": Question.QuestionType.TRUE_FALSE,
                "points": 1,
                "order": 2,
                "choices": [
                    {
                        "text": "صحيح",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "خطأ",
                        "is_correct": False,
                        "order": 2,
                    },
                ],
            },
        ],
    },

    2: {
        "title": "اختبار Next.js",
        "description": "اختبار حول Next.js وApp Router.",
        "type": Assessment.AssessmentType.QUIZ,
        "time_limit_minutes": 12,
        "passing_score": 60,
        "max_attempts": 3,
        "questions": [
            {
                "text": "Next.js مبني على أي مكتبة؟",
                "type": Question.QuestionType.SINGLE_CHOICE,
                "points": 1,
                "order": 1,
                "choices": [
                    {
                        "text": "React",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "Django",
                        "is_correct": False,
                        "order": 2,
                    },
                    {
                        "text": "Vue فقط",
                        "is_correct": False,
                        "order": 3,
                    },
                ],
            },
            {
                "text": "ما الذي يوفره Next.js؟",
                "type": Question.QuestionType.MULTIPLE_CHOICE,
                "points": 2,
                "order": 2,
                "choices": [
                    {
                        "text": "App Router",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "Server Components",
                        "is_correct": True,
                        "order": 2,
                    },
                    {
                        "text": "Client Components",
                        "is_correct": True,
                        "order": 3,
                    },
                    {
                        "text": "Django ORM",
                        "is_correct": False,
                        "order": 4,
                    },
                ],
            },
        ],
    },

    3: {
        "title": "تدريب ربط Next.js مع Django API",
        "description": "تدريب على التواصل بين Frontend وBackend.",
        "type": Assessment.AssessmentType.PRACTICE,
        "time_limit_minutes": 15,
        "passing_score": 50,
        "max_attempts": None,
        "questions": [
            {
                "text": "كيف يتواصل Next.js مع Django REST API؟",
                "type": Question.QuestionType.SINGLE_CHOICE,
                "points": 1,
                "order": 1,
                "choices": [
                    {
                        "text": "من خلال HTTP requests",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "من خلال CSS فقط",
                        "is_correct": False,
                        "order": 2,
                    },
                    {
                        "text": "من خلال HTML فقط",
                        "is_correct": False,
                        "order": 3,
                    },
                ],
            },
            {
                "text": "يمكن للواجهة إرسال GET وPOST requests إلى REST API.",
                "type": Question.QuestionType.TRUE_FALSE,
                "points": 1,
                "order": 2,
                "choices": [
                    {
                        "text": "صحيح",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "خطأ",
                        "is_correct": False,
                        "order": 2,
                    },
                ],
            },
        ],
    },

    4: {
        "title": "امتحان Full Stack النهائي",
        "description": "اختبار شامل لمفاهيم Full Stack باستخدام Next.js وDjango.",
        "type": Assessment.AssessmentType.EXAM,
        "time_limit_minutes": 25,
        "passing_score": 60,
        "max_attempts": 2,
        "questions": [
            {
                "text": "أي مكون مسؤول عن تخزين البيانات في النظام؟",
                "type": Question.QuestionType.SINGLE_CHOICE,
                "points": 1,
                "order": 1,
                "choices": [
                    {
                        "text": "Database",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "CSS",
                        "is_correct": False,
                        "order": 2,
                    },
                    {
                        "text": "HTML",
                        "is_correct": False,
                        "order": 3,
                    },
                ],
            },
            {
                "text": "أي من التالي يمكن أن يكون جزءًا من Full Stack application؟",
                "type": Question.QuestionType.MULTIPLE_CHOICE,
                "points": 2,
                "order": 2,
                "choices": [
                    {
                        "text": "Next.js",
                        "is_correct": True,
                        "order": 1,
                    },
                    {
                        "text": "Django",
                        "is_correct": True,
                        "order": 2,
                    },
                    {
                        "text": "PostgreSQL",
                        "is_correct": True,
                        "order": 3,
                    },
                    {
                        "text": "Power Supply",
                        "is_correct": False,
                        "order": 4,
                    },
                ],
            },
        ],
    },
},


}

# =========================================================

# HELPERS

# =========================================================

def create_question(assessment, question_data):
    question, created = Question.objects.get_or_create(
    assessment=assessment,
    order=question_data["order"],
    defaults={
    "text": question_data["text"],
    "type": question_data["type"],
    "points": question_data["points"],
    "explanation": question_data.get(
    "explanation",
    "",
    ),
    },
    )

    if not created:
        question.text = question_data["text"]
        question.type = question_data["type"]
        question.points = question_data["points"]
        question.explanation = question_data.get(
            "explanation",
            "",
        )

        question.save(
            update_fields=[
                "text",
                "type",
                "points",
                "explanation",
            ]
        )

    # Remove old choices for this question.
    # This keeps the seed deterministic.
    question.choices.all().delete()

    for choice_data in question_data.get(
        "choices",
        [],
    ):
        Choice.objects.create(
            question=question,
            text=choice_data["text"],
            is_correct=choice_data["is_correct"],
            order=choice_data["order"],
        )

    return question, created

def create_assessment(course, lesson, data):
    assessment, created = Assessment.objects.get_or_create(
    course=course,
    lesson=lesson,
    title=data["title"],
    defaults={
    "description": data["description"],
    "type": data["type"],
    "time_limit_minutes": data[
    "time_limit_minutes"
    ],
    "passing_score": data["passing_score"],
    "max_attempts": data["max_attempts"],
    "shuffle_questions": False,
    "shuffle_choices": False,
    "is_published": True,
    },
    )
    if not created:
        assessment.description = data["description"]
        assessment.type = data["type"]
        assessment.time_limit_minutes = data[
            "time_limit_minutes"
        ]
        assessment.passing_score = data["passing_score"]
        assessment.max_attempts = data["max_attempts"]
        assessment.shuffle_questions = False
        assessment.shuffle_choices = False
        assessment.is_published = True

        assessment.save()

    questions_created = 0

    for question_data in data["questions"]:
        _, question_created = create_question(
            assessment=assessment,
            question_data=question_data,
        )

        if question_created:
            questions_created += 1

    return assessment, created, questions_created

# =========================================================

# SEED

# =========================================================

@transaction.atomic
def seed_assessments():
    print("=" * 70)
    print("STARTING ASSESSMENTS SEED")
    print("=" * 70)

assessments_created = 0
assessments_updated = 0
questions_created = 0

for course_slug, sections_data in ASSESSMENTS.items():

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

    for section_order, assessment_data in sections_data.items():

        try:
            section = course.sections.get(
                order=section_order
            )

        except course.sections.model.DoesNotExist:
            print(
                f"\nERROR: Section {section_order} "
                f"not found in {course.title}"
            )
            continue

        lessons = Lesson.objects.filter(
            section=section
        ).order_by(
            "order",
            "id",
        )

        if not lessons.exists():
            print(
                f"\nWARNING: No lessons found in "
                f"Section {section_order}"
            )
            continue

        # -------------------------------------------------
        # Attach the assessment to the first lesson
        # in the section.
        #
        # You can change this to lessons.last()
        # if you want the assessment at the end.
        # -------------------------------------------------

        lesson = lessons.first()

        print()
        print(
            f"Section {section_order}: "
            f"{section.title}"
        )

        print(
            f"   Lesson: {lesson.title}"
        )

        assessment, created, created_questions = (
            create_assessment(
                course=course,
                lesson=lesson,
                data=assessment_data,
            )
        )

        if created:
            assessments_created += 1
            print(
                f"   ✓ Assessment created: "
                f"{assessment.title}"
            )
        else:
            assessments_updated += 1
            print(
                f"   → Assessment updated: "
                f"{assessment.title}"
            )

        questions_created += created_questions

        print(
            f"   Questions: "
            f"{assessment.questions.count()}"
        )

        print(
            f"   Published: "
            f"{assessment.is_published}"
        )

print()
print("=" * 70)
print("ASSESSMENTS SEED COMPLETED")
print("=" * 70)
print(
    f"Assessments created: "
    f"{assessments_created}"
)
print(
    f"Assessments updated: "
    f"{assessments_updated}"
)
print(
    f"Questions created: "
    f"{questions_created}"
)
print("=" * 70)

seed_assessments()
