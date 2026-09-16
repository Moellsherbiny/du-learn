from django.urls import include, path

from .views.profile import ProfileView

from .views.auth import (
    CurrentUserView,
    LoginView,
    LogoutView,
    RefreshTokenView,
)
from .views.verification import ResendVerificationOTPView, VerifyEmailView
urlpatterns = [
    # Custom authentication
    path(
        "login/",
        LoginView.as_view(),
        name="login",
    ),

    path(
        "logout/",
        LogoutView.as_view(),
        name="logout",
    ),

    path(
        "user/",
        CurrentUserView.as_view(),
        name="current-user",
    ),

    path(
        "token/refresh/",
        RefreshTokenView.as_view(),
        name="token-refresh",
    ),

    # dj-rest-auth
    path(
        "",
        include("dj_rest_auth.urls"),
    ),

    # Registration
    path(
        "registration/",
        include("dj_rest_auth.registration.urls"),
    ),

    # Email verification
    path(
        "email/verify/",
        VerifyEmailView.as_view(),
        name="verify-email",
    ),

    path(
        "email/resend/",
        ResendVerificationOTPView.as_view(),
        name="resend-verification-otp",
    ),

    path("profile/", ProfileView.as_view() , name="profile")
]