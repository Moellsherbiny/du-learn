const API_URL =
  typeof window === "undefined"
    ? process.env.API_URL?.replace(/\/+$/, "")
    : process.env.NEXT_PUBLIC_API_URL?.replace(
        /\/+$/,
        "",
      );


if (!API_URL) {
  throw new Error("API_URL is not configured");
}

export type ApiErrorData = Record<
  string,
  string[] | string
>;

function translateApiError(message: string): string {
  const normalized = message
    .toLowerCase()
    .trim();

  // البريد الإلكتروني
  if (
    normalized.includes(
      "a user is already registered with this email",
    ) ||
    normalized.includes(
      "a user is already registered",
    ) ||
    normalized.includes(
      "user with this email already exists",
    ) ||
    normalized.includes(
      "email already exists",
    )
  ) {
    return "يوجد حساب مسجل بالفعل بهذا البريد الإلكتروني.";
  }

  if (
    normalized.includes("enter a valid email") ||
    normalized.includes("valid email address") ||
    normalized.includes("valid email")
  ) {
    return "يرجى إدخال بريد إلكتروني صحيح.";
  }

  if (
    normalized.includes("email is required") ||
    normalized === "this field is required."
  ) {
    return "البريد الإلكتروني مطلوب.";
  }

  // OTP
  if (
    normalized.includes(
      "verification code is required",
    ) ||
    normalized.includes(
      "otp is required",
    )
  ) {
    return "رمز التأكيد مطلوب.";
  }

  if (
    normalized.includes(
      "verification code must be 6 digits",
    ) ||
    normalized.includes(
      "otp must be 6 digits",
    )
  ) {
    return "رمز التأكيد يجب أن يتكون من 6 أرقام.";
  }

  if (
    normalized.includes(
      "verification code is incorrect",
    ) ||
    normalized.includes(
      "invalid verification code",
    ) ||
    normalized.includes(
      "otp is incorrect",
    )
  ) {
    return "رمز التأكيد غير صحيح.";
  }

  if (
    normalized.includes(
      "verification code has expired",
    ) ||
    normalized.includes(
      "otp has expired",
    ) ||
    normalized.includes(
      "otp is expired",
    )
  ) {
    return "رمز التأكيد منتهي الصلاحية. اطلب رمزًا جديدًا.";
  }

  if (
    normalized.includes(
      "you can request a new code after",
    ) ||
    normalized.includes(
      "request a new code later",
    )
  ) {
    return "انتظر قليلًا قبل طلب رمز تأكيد جديد.";
  }

  // كلمة المرور
  if (
    normalized.includes("password is too short") ||
    normalized.includes("at least 8 characters")
  ) {
    return "كلمة المرور قصيرة جدًا. يجب أن تحتوي على 8 أحرف على الأقل.";
  }

  if (
    normalized.includes("password is too common")
  ) {
    return "كلمة المرور شائعة جدًا. اختر كلمة مرور أكثر أمانًا.";
  }

  if (
    normalized.includes(
      "password is entirely numeric",
    )
  ) {
    return "كلمة المرور لا يمكن أن تكون أرقامًا فقط.";
  }

  if (
    normalized.includes(
      "password is too similar",
    )
  ) {
    return "كلمة المرور مشابهة جدًا لبياناتك الشخصية.";
  }

  if (
    normalized.includes(
      "password fields didn't match",
    ) ||
    normalized.includes(
      "passwords do not match",
    ) ||
    normalized.includes(
      "password1 and password2",
    )
  ) {
    return "كلمتا المرور غير متطابقتين.";
  }

  // تسجيل الدخول
  if (
    normalized.includes(
      "unable to log in with provided credentials",
    )
  ) {
    return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
  }

  if (
    normalized.includes(
      "authentication credentials were not provided",
    )
  ) {
    return "يرجى تسجيل الدخول أولًا.";
  }

  // الصلاحيات
  if (normalized === "permission denied.") {
    return "ليس لديك صلاحية لتنفيذ هذا الإجراء.";
  }

  if (normalized === "not found.") {
    return "العنصر المطلوب غير موجود.";
  }

  if (normalized === "method not allowed.") {
    return "هذه العملية غير مسموحة.";
  }

  // أخطاء عامة
  if (
    normalized.includes(
      "unable to connect to the server",
    )
  ) {
    return "تعذر الاتصال بالخادم. تحقق من اتصالك وحاول مرة أخرى.";
  }

  if (
    normalized.includes(
      "internal server error",
    )
  ) {
    return "حدث خطأ في الخادم. حاول مرة أخرى لاحقًا.";
  }

  return message;
}

export class ApiError extends Error {
  status: number;
  data: ApiErrorData;

  constructor(
    message: string,
    status: number,
    data: ApiErrorData = {},
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

type ApiRequestOptions = RequestInit & {
  path: string;
};

async function refreshAccessToken(): Promise<void> {
  let response: Response;

  try {
    response = await fetch(
      `${API_URL}/api/auth/token/refresh/`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );
  } catch {
    throw new ApiError(
      "Unable to connect to the server.",
      0,
      {
        non_field_errors: [
          "تعذر الاتصال بالخادم.",
        ],
      },
    );
  }

  if (!response.ok) {
    let data: unknown = null;

    const contentType =
      response.headers.get("content-type");

    if (
      contentType?.includes(
        "application/json",
      )
    ) {
      data = await response.json();
    } else {
      const text = await response.text();

      data = text
        ? {
            detail: text,
          }
        : null;
    }

    const errorData =
      normalizeErrorData(data);

    throw new ApiError(
      getErrorMessage(errorData),
      response.status,
      errorData,
    );
  }
}

export async function apiRequest<T>(
  {
    path,
    ...options
  }: ApiRequestOptions,
  allowRefresh = true,
): Promise<T> {
  const normalizedPath = `/${path.replace(
    /^\/+/,
    "",
  )}`;

  /*
   * Build headers without forcing Content-Type.
   *
   * For FormData, the browser MUST set:
   * multipart/form-data; boundary=...
   *
   * For JSON, we set application/json.
   */
  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set(
      "Content-Type",
      "application/json",
    );
  }

  let response: Response;

  try {
    response = await fetch(
      `${API_URL}${normalizedPath}`,
      {
        ...options,
        credentials: "include",
        headers,
        cache: "no-store",
      },
    );
  } catch {
    throw new ApiError(
      "Unable to connect to the server.",
      0,
      {
        non_field_errors: [
          "تعذر الاتصال بالخادم.",
        ],
      },
    );
  }

  /*
   * Access token expired.
   *
   * Refresh the access token once,
   * then retry the original request.
   */
  if (
    response.status === 401 &&
    allowRefresh &&
    normalizedPath !==
      "/api/auth/token/refresh/"
  ) {
    try {
      await refreshAccessToken();

      return apiRequest<T>(
        {
          path,
          ...options,
        },
        false,
      );
    } catch {
      /*
       * Refresh failed.
       * Continue and throw the original 401.
       */
    }
  }

  /*
   * Parse response.
   */
  const contentType =
    response.headers.get("content-type");

  let data: unknown = null;

  if (
    contentType?.includes(
      "application/json",
    )
  ) {
    data = await response.json();
  } else {
    const text = await response.text();

    data = text
      ? {
          detail: text,
        }
      : null;
  }

  /*
   * Handle API errors.
   */
  if (!response.ok) {
    const errorData =
      normalizeErrorData(data);

    throw new ApiError(
      getErrorMessage(errorData),
      response.status,
      errorData,
    );
  }

  return data as T;
}
function normalizeErrorData(
  data: unknown,
): ApiErrorData {
  if (
    typeof data !== "object" ||
    data === null ||
    Array.isArray(data)
  ) {
    return {
      non_field_errors: [
        "حدث خطأ أثناء تنفيذ الطلب.",
      ],
    };
  }

  const result: ApiErrorData = {};

  for (
    const [key, value] of Object.entries(data)
  ) {
    if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        translateApiError(String(item)),
      );

      continue;
    }

    if (
      typeof value === "string" ||
      typeof value === "number"
    ) {
      result[key] =
        translateApiError(
          String(value),
        );

      continue;
    }

    result[key] =
      "حدث خطأ غير متوقع.";
  }

  return result;
}

function getErrorMessage(
  data: ApiErrorData,
): string {
  const detail = data.detail;

  if (typeof detail === "string") {
    return detail;
  }

  const message = data.message;

  if (typeof message === "string") {
    return message;
  }

  const nonFieldErrors =
    data.non_field_errors;

  if (Array.isArray(nonFieldErrors)) {
    return (
      nonFieldErrors[0] ??
      "حدث خطأ أثناء تنفيذ الطلب."
    );
  }

  if (
    typeof nonFieldErrors === "string"
  ) {
    return nonFieldErrors;
  }

  return "حدث خطأ أثناء تنفيذ الطلب.";
}