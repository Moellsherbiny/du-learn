from django.conf import settings
from django.core.mail import send_mail


def send_verification_otp_email(user, otp):
    send_mail(
        subject="DU Learn - تأكيد البريد الإلكتروني",
        message=(
            f"مرحبًا {user.first_name or user.email},\n\n"
            "شكرًا لإنشاء حسابك في DU Learn.\n\n"
            "رمز تأكيد البريد الإلكتروني الخاص بك هو:\n\n"
            f"{otp}\n\n"
            "الرمز صالح لمدة 10 دقائق.\n"
            "يمكن استخدام الرمز مرة واحدة فقط.\n\n"
            "إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذه الرسالة.\n\n"
            "DU Learn"
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )


def send_password_reset_otp_email(user, otp):
    send_mail(
        subject="DU Learn - إعادة تعيين كلمة المرور",
        message=(
            f"مرحبًا {user.first_name or user.email},\n\n"
            "تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بحسابك "
            "في DU Learn.\n\n"
            "رمز إعادة تعيين كلمة المرور الخاص بك هو:\n\n"
            f"{otp}\n\n"
            "الرمز صالح لمدة 10 دقائق.\n"
            "يمكن استخدام الرمز مرة واحدة فقط.\n\n"
            "إذا لم تطلب إعادة تعيين كلمة المرور، "
            "يمكنك تجاهل هذه الرسالة.\n\n"
            "DU Learn"
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )