from rest_framework import status, viewsets
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from apps.assessments.models import Choice, Question
from ..serializers import ChoiceSerializer
   


class ChoiceViewSet(viewsets.ModelViewSet):
    serializer_class = ChoiceSerializer

    permission_classes = [
        IsAuthenticated,
    ]

    ordering = [
        "order",
        "id",
    ]

    def get_question(self):
        try:
            return (
                Question.objects
                .select_related(
                    "assessment",
                    "assessment__course",
                )
                .get(
                    pk=self.kwargs["question_pk"],
                    assessment_id=self.kwargs[
                        "assessment_pk"
                    ],
                )
            )
        except Question.DoesNotExist:
            raise NotFound(
                "Question does not exist."
            )

    def get_queryset(self):
        question = self.get_question()

        return Choice.objects.filter(
            question=question,
        )

    def check_teacher_permission(self):
        user = self.request.user
        question = self.get_question()

        if user.role == "ADMIN":
            return

        if (
            user.role != "TEACHER"
            or question.assessment.course.teacher_id
            != user.id
        ):
            raise PermissionDenied(
                "You do not have permission "
                "to manage this question."
            )

    def create(self, request, *args, **kwargs):
        self.check_teacher_permission()

        question = self.get_question()

        serializer = self.get_serializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        choice = serializer.save(
            question=question,
        )

        return Response(
            self.get_serializer(choice).data,
            status=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        self.check_teacher_permission()

        return super().update(
            request,
            *args,
            **kwargs,
        )

    def partial_update(
        self,
        request,
        *args,
        **kwargs,
    ):
        self.check_teacher_permission()

        return super().partial_update(
            request,
            *args,
            **kwargs,
        )

    def destroy(self, request, *args, **kwargs):
        self.check_teacher_permission()

        return super().destroy(
            request,
            *args,
            **kwargs,
        )


