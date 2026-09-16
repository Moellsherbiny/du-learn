from django.urls import include, path

from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter

from .views import CourseSectionViewSet, CourseViewSet


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


urlpatterns = [
    path(
        "",
        include(router.urls),
    ),

    path(
        "",
        include(courses_router.urls),
    ),
]