
from django.contrib.auth import update_session_auth_hash

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..serializers import ChangePasswordSerializer


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={
                "request": request,
            },
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = request.user

        user.set_password(
            serializer.validated_data[
                "new_password"
            ]
        )

        user.save(
            update_fields=["password"]
        )

        # Keep Django's current session authenticated.
        update_session_auth_hash(
            request,
            user,
        )

        return Response(
            {
                "detail": (
                    "تم تغيير كلمة المرور بنجاح."
                )
            },
            status=status.HTTP_200_OK,
        )

