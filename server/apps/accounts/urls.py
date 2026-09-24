
from django.urls import include, path

from .views.settings import ChangePasswordView

from .views.auth import (
    CurrentUserView,
    LoginView,
    LogoutView,
    RefreshTokenView,
)
from .views.profile import ProfileView
from .views.verification import (
    ResendVerificationOTPView,
    VerifyEmailView,
)
from .views.password_reset import( PasswordResetRequestView,PasswordResetConfirmView,  PasswordResetVerifyView)

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

    # Profile
    path(
        "profile/",
        ProfileView.as_view(),
        name="profile",
    ),

    # Password reset
path(
    "password-reset/request/",
    PasswordResetRequestView.as_view(),
    name="password-reset-request",
),
path(
    "password-reset/verify/",
    PasswordResetVerifyView.as_view(),
    name="password-reset-verify",
),
path(
    "password-reset/confirm/",
    PasswordResetConfirmView.as_view(),
    name="password-reset-confirm",
),
    path("settings/password/", ChangePasswordView.as_view(), name="change-password"),
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
]
