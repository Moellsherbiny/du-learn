import { apiRequest } from "./client";

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  first_name: string;
  last_name: string;
  email: string;
  password1: string;
  password2: string;
};

export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  email_verified: boolean;
};

export type LoginResponse = {
  access: string;
  refresh: string;
  user: User;
};

export async function login(input: LoginInput) {
  return apiRequest<LoginResponse>({
    path: "/api/auth/login/",
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function register(input: RegisterInput) {
  return apiRequest<{
    user: User;
  }>({
    path: "/api/auth/registration/",
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function logout() {
  return apiRequest({
    path: "/api/auth/logout/",
    method: "POST",
  });
}

export async function getMe(cookie?: string) {
  return apiRequest<User>({
    path: "/api/auth/user/",
    method: "GET",
    headers: cookie
      ? {
          Cookie: cookie,
        }
      : undefined,
  });
}

/*
|--------------------------------------------------------------------------
| Email Verification OTP
|--------------------------------------------------------------------------
*/

export async function verifyEmail(
  email: string,
  otp: string,
) {
  return apiRequest<{ detail: string }>({
    path: "/api/auth/email/verify/",
    method: "POST",
    body: JSON.stringify({
      email,
      otp,
    }),
  });
}

export async function resendVerificationOtp(
  email: string,
) {
  return apiRequest<{ detail: string }>({
    path: "/api/auth/email/resend/",
    method: "POST",
    body: JSON.stringify({
      email,
    }),
  });
}

/*
|--------------------------------------------------------------------------
| Password Reset OTP
|--------------------------------------------------------------------------
*/

export async function requestPasswordReset(
  email: string,
) {
  return apiRequest<{ detail: string }>({
    path: "/api/auth/password-reset/request/",
    method: "POST",
    body: JSON.stringify({
      email,
    }),
  });
}

export type VerifyPasswordResetOtpInput = {
  email: string;
  otp: string;
};

export type VerifyPasswordResetOtpResponse = {
  reset_token: string;
};

export async function verifyPasswordResetOtp(
  input: VerifyPasswordResetOtpInput,
) {
  return apiRequest<VerifyPasswordResetOtpResponse>({
    path: "/api/auth/password-reset/verify/",
    method: "POST",
    body: JSON.stringify(input),
  });
}

export type ConfirmPasswordResetInput = {
  reset_token: string;
  new_password1: string;
  new_password2: string;
};

export async function confirmPasswordReset(
  input: ConfirmPasswordResetInput,
) {
  return apiRequest<{ detail: string }>({
    path: "/api/auth/password-reset/confirm/",
    method: "POST",
    body: JSON.stringify(input),
  });
}


export type RefreshTokenResponse = {
  access: string;
};

export async function refreshToken(refresh: string) {
  return apiRequest<RefreshTokenResponse>({
    path: "/api/auth/token/refresh/",
    method: "POST",
    body: JSON.stringify({
      refresh,
    }),
  });
}