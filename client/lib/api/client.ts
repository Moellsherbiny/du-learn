
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

/**
 * Translate known backend messages.
 *
 * IMPORTANT:
 * If the message is not recognized,
 * return the ORIGINAL backend message.
 */
function translateApiError(message: string): string {
  const original = message.trim();

  const normalized = original.toLowerCase();

  // =========================
  // Email
  // =========================

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

  // =========================
  // OTP
  // =========================

  if (
    normalized.includes(
      "verification code is required",
    ) ||
    normalized.includes("otp is required")
  ) {
    return "رمز التأكيد مطلوب.";
  }

  if (
    normalized.includes(
      "verification code must be 6 digits",
    ) ||
    normalized.includes("otp must be 6 digits")
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
    normalized.includes("otp is incorrect")
  ) {
    return "رمز التأكيد غير صحيح.";
  }

  if (
    normalized.includes(
      "verification code has expired",
    ) ||
    normalized.includes("otp has expired") ||
    normalized.includes("otp is expired")
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

  // =========================
  // Password
  // =========================

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
    normalized.includes("password is too similar")
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

  // =========================
  // Authentication
  // =========================

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

  // =========================
  // Permissions
  // =========================

  if (normalized === "permission denied.") {
    return "ليس لديك صلاحية لتنفيذ هذا الإجراء.";
  }

  if (normalized === "not found.") {
    return "العنصر المطلوب غير موجود.";
  }

  if (normalized === "method not allowed.") {
    return "هذه العملية غير مسموحة.";
  }

  // =========================
  // General errors
  // =========================

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

  /**
   * IMPORTANT:
   * No translation found.
   * Return the ORIGINAL backend message.
   */
  return original;
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
  skipRefresh?: boolean;
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
      "تعذر الاتصال بالخادم.",
      0,
      {
        non_field_errors: [
          "تعذر الاتصال بالخادم.",
        ],
      },
    );
  }

  if (!response.ok) {
    const data = await parseResponseData(response);

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
    skipRefresh = false,
    ...options
  }: ApiRequestOptions,
  allowRefresh = true,
): Promise<T> {
  const normalizedPath = `/${path.replace(
    /^\/+/,
    "",
  )}`;

  const headers = new Headers(options.headers);

  headers.set(
    "Accept",
    "application/json",
  );

  /**
   * Don't manually set Content-Type for FormData.
   * The browser will set:
   *
   * multipart/form-data; boundary=...
   */
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
      "تعذر الاتصال بالخادم.",
      0,
      {
        non_field_errors: [
          "تعذر الاتصال بالخادم.",
        ],
      },
    );
  }

  /**
   * Access token expired.
   */
  if (
    response.status === 401 &&
    allowRefresh &&
    !skipRefresh &&
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
      /**
       * Refresh failed.
       * Continue with the original response
       * so the ORIGINAL backend error is preserved.
       */
    }
  }

  const data =
    await parseResponseData(response);

  /**
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

/**
 * Parse JSON responses and fallback to text.
 */
async function parseResponseData(
  response: Response,
): Promise<unknown> {
  const contentType =
    response.headers.get("content-type");

  if (
    contentType?.includes(
      "application/json",
    )
  ) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  const text = await response.text();

  return text
    ? {
        detail: text,
      }
    : null;
}

/**
 * Normalize every possible DRF error format.
 *
 * Examples:
 *
 * {
 *   "detail": "..."
 * }
 *
 * {
 *   "message": "..."
 * }
 *
 * {
 *   "current_password": ["..."]
 * }
 *
 * {
 *   "non_field_errors": ["..."]
 * }
 */
function normalizeErrorData(
  data: unknown,
): ApiErrorData {
  /**
   * Backend returned a plain string.
   */
  if (typeof data === "string") {
    return {
      detail: translateApiError(data),
    };
  }

  /**
   * Backend returned something unexpected.
   */
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

  for (const [key, value] of Object.entries(data)) {
    /**
     * DRF usually returns:
     *
     * field: ["error 1", "error 2"]
     */
    if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        translateApiError(String(item)),
      );

      continue;
    }

    /**
     * detail / message / string field
     */
    if (
      typeof value === "string" ||
      typeof value === "number"
    ) {
      result[key] =
        translateApiError(String(value));

      continue;
    }

    /**
     * Unknown object value.
     *
     * We don't invent a backend message here.
     */
    result[key] =
      "حدث خطأ غير متوقع.";
  }

  return result;
}

/**
 * Extract the most useful error message.
 *
 * Priority:
 *
 * detail
 * ↓
 * message
 * ↓
 * non_field_errors
 * ↓
 * first field error
 * ↓
 * generic fallback
 */
function getErrorMessage(
  data: ApiErrorData,
): string {
  /**
   * 1. detail
   */
  const detail = data.detail;

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    const message = detail[0];

    if (message) {
      return message;
    }
  }

  /**
   * 2. message
   */
  const message = data.message;

  if (typeof message === "string") {
    return message;
  }

  if (Array.isArray(message)) {
    const first = message[0];

    if (first) {
      return first;
    }
  }

  /**
   * 3. non_field_errors
   */
  const nonFieldErrors =
    data.non_field_errors;

  if (Array.isArray(nonFieldErrors)) {
    const first = nonFieldErrors[0];

    if (first) {
      return first;
    }
  }

  if (
    typeof nonFieldErrors === "string"
  ) {
    return nonFieldErrors;
  }

  /**
   * 4. Any field error
   *
   * Example:
   *
   * {
   *   current_password: [
   *     "كلمة المرور الحالية غير صحيحة."
   *   ]
   * }
   */
  for (const [key, value] of Object.entries(
    data,
  )) {
    if (key === "detail") continue;
    if (key === "message") continue;
    if (key === "non_field_errors") continue;

    if (Array.isArray(value)) {
      const first = value[0];

      if (first) {
        return first;
      }
    }

    if (typeof value === "string") {
      return value;
    }
  }

  /**
   * 5. Final fallback
   */
  return "حدث خطأ أثناء تنفيذ الطلب.";
}
