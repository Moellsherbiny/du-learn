from rest_framework import status, viewsets
from rest_framework.exceptions import NotFound,PermissionDenied
from rest_framework.filters import OrderingFilter,SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from apps.assessments.models import Assessment,Question
from ..permissions import QuestionPermission
from ..serializers import QuestionCreateSerializer, QuestionListSerializer
   
class QuestionViewSet(viewsets.ModelViewSet):
    permission_classes = [
        IsAuthenticated,
        QuestionPermission,
    ]

    filter_backends = [
        OrderingFilter,
        SearchFilter,
    ]

    search_fields = [
        "text",
        "explanation",
    ]

    ordering_fields = [
        "order",
        "points",
    ]

    ordering = [
        "order",
        "id",
    ]

    def get_assessment(self):
        try:
            return (
                Assessment.objects
                .select_related(
                    "course",
                    "course__teacher",
                )
                .get(
                    pk=self.kwargs["assessment_pk"],
                )
            )
        except Assessment.DoesNotExist:
            raise NotFound(
                "Assessment does not exist."
            )

    def get_queryset(self):
        assessment = self.get_assessment()

        return (
            Question.objects
            .filter(
                assessment=assessment,
            )
            .prefetch_related(
                "choices",
            )
        )

    def get_serializer_class(self):
        if self.action in [
            "create",
            "update",
            "partial_update",
        ]:
            return QuestionCreateSerializer

        return QuestionListSerializer

    def check_teacher_permission(self):
        user = self.request.user
        assessment = self.get_assessment()

        if user.role == "ADMIN":
            return

        if (
            user.role != "TEACHER"
            or assessment.course.teacher_id != user.id
        ):
            raise PermissionDenied(
                "You do not have permission to manage "
                "this assessment."
            )

    def create(self, request, *args, **kwargs):
        self.check_teacher_permission()

        assessment = self.get_assessment()

        serializer = self.get_serializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        question = serializer.save(
            assessment=assessment,
        )

        response_serializer = QuestionListSerializer(
            question,
            context=self.get_serializer_context(),
        )

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED,
        )

    def perform_update(self, serializer):
        self.check_teacher_permission()

        serializer.save()

    def perform_destroy(self, instance):
        self.check_teacher_permission()

        instance.delete()
