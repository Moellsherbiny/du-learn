from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CourseProgressViewSet


router = DefaultRouter()

router.register(
    "course-progress",
    CourseProgressViewSet,
    basename="course-progress",
)

urlpatterns = [
    path("", include(router.urls)),
]