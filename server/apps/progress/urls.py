
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    CourseProgressViewSet,
    LearningViewSet,
)


router = DefaultRouter()

router.register(
    r"course-progress",
    CourseProgressViewSet,
    basename="course-progress",
)

router.register(
    r"learning",
    LearningViewSet,
    basename="learning",
)


urlpatterns = [
    path(
        "",
        include(router.urls),
    ),
]
