from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter
from .views.assessment import AssessmentViewSet
from .views.choice import ChoiceViewSet
from .views.attempt import AssessmentAttemptViewSet
from .views.question import QuestionViewSet


router = DefaultRouter()

router.register(
    r"assessments",
    AssessmentViewSet,
    basename="assessment",
)

router.register(
    r"assessment-attempts",
    AssessmentAttemptViewSet,
    basename="assessment-attempt",
)


assessments_router = NestedDefaultRouter(
    router,
    r"assessments",
    lookup="assessment",
)

assessments_router.register(
    r"questions",
    QuestionViewSet,
    basename="assessment-questions",
)


questions_router = NestedDefaultRouter(
    assessments_router,
    r"questions",
    lookup="question",
)

questions_router.register(
    r"choices",
    ChoiceViewSet,
    basename="question-choices",
)


urlpatterns = [
    path(
        "",
        include(router.urls),
    ),

    path(
        "",
        include(assessments_router.urls),
    ),

    path(
        "",
        include(questions_router.urls),
    ),
]