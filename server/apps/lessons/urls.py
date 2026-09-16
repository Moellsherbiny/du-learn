from django.urls import include, path

from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter

from apps.courses.views import CourseViewSet
from apps.courses.views import CourseSectionViewSet

from .views import (
    LessonContentViewSet,
    LessonViewSet,
)


router = DefaultRouter()

router.register(
    r"courses",
    CourseViewSet,
    basename="course",
)

courses_router = NestedDefaultRouter(
    router,
    r"courses",
    lookup="course",
)

courses_router.register(
    r"sections",
    CourseSectionViewSet,
    basename="course-sections",
)


sections_router = NestedDefaultRouter(
    courses_router,
    r"sections",
    lookup="section",
)

sections_router.register(
    r"lessons",
    LessonViewSet,
    basename="section-lessons",
)


lessons_router = NestedDefaultRouter(
    sections_router,
    r"lessons",
    lookup="lesson",
)

lessons_router.register(
    r"content",
    LessonContentViewSet,
    basename="lesson-content",
)


urlpatterns = [
    path(
        "",
        include(router.urls),
    ),

    path(
        "",
        include(courses_router.urls),
    ),

    path(
        "",
        include(sections_router.urls),
    ),

    path(
        "",
        include(lessons_router.urls),
    ),
]