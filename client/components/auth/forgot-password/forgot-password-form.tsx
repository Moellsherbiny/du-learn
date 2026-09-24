"use client";

import { useState } from "react";

import { ForgotPasswordEmail } from "./forgot-password-email";
import { ForgotPasswordOtp } from "./forgot-password-otp";
import { ForgotPasswordNewPassword } from "./forgot-password-new-password";

type ForgotPasswordStep = "email" | "otp" | "password";

export function ForgotPasswordForm() {
  const [step, setStep] =
    useState<ForgotPasswordStep>("email");

  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  function handleEmailSuccess(email: string) {
    setEmail(email);
    setStep("otp");
  }

  function handleOtpSuccess(resetToken: string) {
    setResetToken(resetToken);
    setStep("password");
  }

  function handleResetSuccess() {
    // بعد نجاح تغيير كلمة المرور
    // نرجع لصفحة تسجيل الدخول
    window.location.href = "/login";
  }

  function handleBackToEmail() {
    setStep("email");
    setResetToken("");
  }

  function handleBackToOtp() {
    setStep("otp");
    setResetToken("");
  }

  return (
    <div className="w-full">
      {step === "email" && (
        <ForgotPasswordEmail
          onSuccess={handleEmailSuccess}
        />
      )}

      {step === "otp" && (
        <ForgotPasswordOtp
          email={email}
          onSuccess={handleOtpSuccess}
          onBack={handleBackToEmail}
        />
      )}

      {step === "password" && (
        <ForgotPasswordNewPassword
          resetToken={resetToken}
          onSuccess={handleResetSuccess}
        />
      )}
    </div>
  );
}