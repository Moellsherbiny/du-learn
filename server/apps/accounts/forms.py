from django.conf import settings

from dj_rest_auth.forms import AllAuthPasswordResetForm


def frontend_url_generator(request, user, temp_key):
    frontend_url = getattr(
        settings,
        "FRONTEND_URL",
        "http://localhost:3000",
    ).rstrip("/")

    return (
        f"{frontend_url}/reset-password/"
        f"{user_pk_to_url_str(user)}/{temp_key}"
    )


def user_pk_to_url_str(user):
    return str(user.pk)


class CustomPasswordResetForm(
    AllAuthPasswordResetForm
):
    def save(
        self,
        request,
        use_https=False,
        token_generator=None,
        from_email=None,
        email_template_name=None,
        subject_template_name=None,
        html_email_template_name=None,
        extra_email_context=None,
    ):
        from django.contrib.auth.forms import (
            PasswordResetForm,
        )

        return PasswordResetForm.save(
            self,
            request=request,
            use_https=use_https,
            token_generator=token_generator,
            from_email=from_email,
            email_template_name=email_template_name,
            subject_template_name=subject_template_name,
            html_email_template_name=html_email_template_name,
            extra_email_context=extra_email_context,
        )