
"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useForm,
  type FieldErrors,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Camera,
  Check,
  Loader2,
  Mail,
  Save,
  User,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import {
  updateProfile,
  type ProfileData,
} from "@/actions/profile/profile-actions";

const profileSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "الاسم الأول مطلوب.")
    .max(
      150,
      "الاسم الأول طويل جدًا.",
    ),

  last_name: z
    .string()
    .trim()
    .min(1, "اسم العائلة مطلوب.")
    .max(
      150,
      "اسم العائلة طويل جدًا.",
    ),

  phone: z
    .string()
    .trim()
    .max(
      30,
      "رقم الهاتف طويل جدًا.",
    ),

  date_of_birth: z
    .string()
    .optional(),

  school: z
    .string()
    .trim()
    .max(
      255,
      "اسم المدرسة طويل جدًا.",
    ),

  grade_level: z
    .string()
    .trim()
    .max(
      100,
      "الصف الدراسي طويل جدًا.",
    ),

  specialization: z
    .string()
    .trim()
    .max(
      255,
      "التخصص طويل جدًا.",
    ),

  qualification: z
    .string()
    .trim()
    .max(
      255,
      "المؤهل طويل جدًا.",
    ),

  years_of_experience: z
    .string()
    .optional(),

  city: z
    .string()
    .trim()
    .max(
      100,
      "اسم المدينة طويل جدًا.",
    ),

  country: z
    .string()
    .trim()
    .max(
      100,
      "اسم الدولة طويل جدًا.",
    ),

  bio: z
    .string()
    .trim()
    .max(
      1000,
      "النبذة طويلة جدًا.",
    ),
});

type ProfileFormValues =
  z.infer<typeof profileSchema>;

type ProfileClientProps = {
  initialProfile: ProfileData | null;
  initialError?: string;
};

export function ProfileClient({
  initialProfile,
  initialError,
}: ProfileClientProps) {
  const [profile, setProfile] =
    useState<ProfileData | null>(
      initialProfile,
    );

  const [isSaving, setIsSaving] =
    useState(false);

  const [saveSuccess, setSaveSuccess] =
    useState(false);

  const [error, setError] =
    useState<string | null>(
      initialError ?? null,
    );

  const [imagePreview, setImagePreview] =
    useState<string | null>(
      initialProfile?.image ?? null,
    );

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const role = profile?.role;

  const isStudent =
    role === "STUDENT";

  const isTeacher =
    role === "TEACHER";

  const currentProfile =
    profile?.profile;

  const defaultValues =
    useMemo<ProfileFormValues>(() => {
      const studentProfile =
        isStudent &&
        currentProfile
          ? currentProfile
          : null;

      const teacherProfile =
        isTeacher &&
        currentProfile
          ? currentProfile
          : null;

      return {
        first_name:
          profile?.first_name ?? "",

        last_name:
          profile?.last_name ?? "",

        phone:
          currentProfile?.phone ?? "",

        date_of_birth:
          studentProfile &&
          "date_of_birth" in
            studentProfile
            ? studentProfile.date_of_birth ??
              ""
            : "",

        school:
          studentProfile &&
          "school" in studentProfile
            ? studentProfile.school ?? ""
            : "",

        grade_level:
          studentProfile &&
          "grade_level" in studentProfile
            ? studentProfile.grade_level ??
              ""
            : "",

        specialization:
          teacherProfile &&
          "specialization" in
            teacherProfile
            ? teacherProfile.specialization ??
              ""
            : "",

        qualification:
          teacherProfile &&
          "qualification" in
            teacherProfile
            ? teacherProfile.qualification ??
              ""
            : "",

        years_of_experience:
          teacherProfile &&
          "years_of_experience" in
            teacherProfile
            ? String(
                teacherProfile.years_of_experience ??
                  0,
              )
            : "",

        city:
          currentProfile?.city ?? "",

        country:
          currentProfile?.country ?? "",

        bio:
          currentProfile?.bio ?? "",
      };
    }, [
      profile,
      currentProfile,
      isStudent,
      isTeacher,
    ]);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isDirty,
    },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError(
        "يرجى اختيار ملف صورة صالح.",
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "حجم الصورة يجب ألا يتجاوز 5 ميجابايت.",
      );
      return;
    }

    setError(null);
    setSaveSuccess(false);
    setImageFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  }

  async function onSubmit(
    values: ProfileFormValues,
  ) {
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const formData = new FormData();

      formData.append(
        "first_name",
        values.first_name,
      );

      formData.append(
        "last_name",
        values.last_name,
      );

      formData.append(
        "phone",
        values.phone,
      );

      formData.append(
        "city",
        values.city,
      );

      formData.append(
        "country",
        values.country,
      );

      formData.append(
        "bio",
        values.bio,
      );

      if (isStudent) {
        formData.append(
          "date_of_birth",
          values.date_of_birth ?? "",
        );

        formData.append(
          "school",
          values.school,
        );

        formData.append(
          "grade_level",
          values.grade_level,
        );
      }

      if (isTeacher) {
        formData.append(
          "specialization",
          values.specialization,
        );

        formData.append(
          "qualification",
          values.qualification,
        );

        formData.append(
          "years_of_experience",
          values.years_of_experience ||
            "0",
        );
      }

      if (imageFile) {
        formData.append(
          "image",
          imageFile,
        );
      }

      const result =
        await updateProfile(formData);

      if (!result.success) {
        setError(
          result.error ??
            "تعذر تحديث الملف الشخصي.",
        );

        return;
      }

      if (result.data) {
        setProfile(result.data);
        setImagePreview(
          result.data.image ?? null,
        );
      }

      setImageFile(null);
      setSaveSuccess(true);

      reset(values);
    } catch {
      setError(
        "حدث خطأ غير متوقع أثناء تحديث الملف الشخصي.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleReset() {
    reset(defaultValues);

    setImageFile(null);
    setImagePreview(
      profile?.image ?? null,
    );
    setError(null);
    setSaveSuccess(false);
  }

  if (!profile) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="flex min-h-48 items-center justify-center">
            <p className="text-sm text-destructive">
              {error ??
                "تعذر تحميل الملف الشخصي."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const initials =
    `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}` ||
    "U";

  return (
    <div
      dir="rtl"
      className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8"
    >
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          الملف الشخصي
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          إدارة بياناتك الشخصية ومعلومات حسابك.
        </p>
      </div>

      {/* Profile Header */}
      <Card className="mb-6 overflow-hidden">
        <div className="h-28 bg-muted/60" />

        <CardContent className="-mt-12 flex flex-col gap-5 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="relative shrink-0">
              <Avatar className="size-24 border-4 border-background shadow-sm">
                <AvatarImage
                  src={imagePreview ?? undefined}
                  alt={`${profile.first_name} ${profile.last_name}`}
                />

                <AvatarFallback className="text-xl font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="absolute bottom-0 left-0 flex size-8 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-colors hover:bg-muted"
                aria-label="تغيير الصورة الشخصية"
              >
                <Camera className="size-4" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            <div className="pb-1">
              <h2 className="text-lg font-semibold">
                {profile.first_name}{" "}
                {profile.last_name}
              </h2>

              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-4 shrink-0" />

                <span dir="ltr">
                  {profile.email}
                </span>
              </div>
            </div>
          </div>

          <span className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium">
            {profile.role === "STUDENT"
              ? "طالب"
              : profile.role === "TEACHER"
                ? "معلم"
                : "مدير"}
          </span>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {/* Success */}
      {saveSuccess && (
        <div
          role="status"
          className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400"
        >
          <Check className="size-4" />

          <span>
            تم تحديث الملف الشخصي بنجاح.
          </span>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>
              المعلومات الأساسية
            </CardTitle>

            <CardDescription>
              البيانات الأساسية الخاصة بحسابك.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="الاسم الأول"
                htmlFor="first_name"
                error={
                  errors.first_name?.message
                }
              >
                <Input
                  id="first_name"
                  placeholder="أدخل الاسم الأول"
                  {...register("first_name")}
                  aria-invalid={
                    !!errors.first_name
                  }
                />
              </FormField>

              <FormField
                label="اسم العائلة"
                htmlFor="last_name"
                error={
                  errors.last_name?.message
                }
              >
                <Input
                  id="last_name"
                  placeholder="أدخل اسم العائلة"
                  {...register("last_name")}
                  aria-invalid={
                    !!errors.last_name
                  }
                />
              </FormField>

              <FormField
                label="البريد الإلكتروني"
                htmlFor="email"
              >
                <div className="relative">
                  <Mail className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="email"
                    value={profile.email}
                    readOnly
                    className="pr-9"
                    dir="ltr"
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  لا يمكن تغيير البريد الإلكتروني من هنا.
                </p>
              </FormField>

              <FormField
                label="رقم الهاتف"
                htmlFor="phone"
                error={
                  errors.phone?.message
                }
              >
                <Input
                  id="phone"
                  placeholder="أدخل رقم الهاتف"
                  {...register("phone")}
                  aria-invalid={
                    !!errors.phone
                  }
                  dir="ltr"
                />
              </FormField>

              <FormField
                label="المدينة"
                htmlFor="city"
                error={
                  errors.city?.message
                }
              >
                <Input
                  id="city"
                  placeholder="أدخل المدينة"
                  {...register("city")}
                  aria-invalid={
                    !!errors.city
                  }
                />
              </FormField>

              <FormField
                label="الدولة"
                htmlFor="country"
                error={
                  errors.country?.message
                }
              >
                <Input
                  id="country"
                  placeholder="أدخل الدولة"
                  {...register("country")}
                  aria-invalid={
                    !!errors.country
                  }
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Student Information */}
        {isStudent && (
          <Card>
            <CardHeader>
              <CardTitle>
                المعلومات الدراسية
              </CardTitle>

              <CardDescription>
                المعلومات الخاصة بدراستك.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  label="المدرسة"
                  htmlFor="school"
                  error={
                    errors.school?.message
                  }
                >
                  <Input
                    id="school"
                    placeholder="اسم المدرسة"
                    {...register("school")}
                    aria-invalid={
                      !!errors.school
                    }
                  />
                </FormField>

                <FormField
                  label="الصف الدراسي"
                  htmlFor="grade_level"
                  error={
                    errors.grade_level?.message
                  }
                >
                  <Input
                    id="grade_level"
                    placeholder="مثال: الصف الثالث الإعدادي"
                    {...register(
                      "grade_level",
                    )}
                    aria-invalid={
                      !!errors.grade_level
                    }
                  />
                </FormField>

                <FormField
                  label="تاريخ الميلاد"
                  htmlFor="date_of_birth"
                  error={
                    errors.date_of_birth?.message
                  }
                >
                  <Input
                    id="date_of_birth"
                    type="date"
                    {...register(
                      "date_of_birth",
                    )}
                    aria-invalid={
                      !!errors.date_of_birth
                    }
                    dir="ltr"
                  />
                </FormField>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Teacher Information */}
        {isTeacher && (
          <Card>
            <CardHeader>
              <CardTitle>
                المعلومات المهنية
              </CardTitle>

              <CardDescription>
                المعلومات المهنية الخاصة بك.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  label="التخصص"
                  htmlFor="specialization"
                  error={
                    errors.specialization
                      ?.message
                  }
                >
                  <Input
                    id="specialization"
                    placeholder="أدخل التخصص"
                    {...register(
                      "specialization",
                    )}
                    aria-invalid={
                      !!errors.specialization
                    }
                  />
                </FormField>

                <FormField
                  label="المؤهل"
                  htmlFor="qualification"
                  error={
                    errors.qualification
                      ?.message
                  }
                >
                  <Input
                    id="qualification"
                    placeholder="أدخل المؤهل"
                    {...register(
                      "qualification",
                    )}
                    aria-invalid={
                      !!errors.qualification
                    }
                  />
                </FormField>

                <FormField
                  label="سنوات الخبرة"
                  htmlFor="years_of_experience"
                  error={
                    errors.years_of_experience
                      ?.message
                  }
                >
                  <Input
                    id="years_of_experience"
                    type="number"
                    min={0}
                    max={60}
                    placeholder="0"
                    {...register(
                      "years_of_experience",
                    )}
                    aria-invalid={
                      !!errors.years_of_experience
                    }
                    dir="ltr"
                  />
                </FormField>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bio */}
        <Card>
          <CardHeader>
            <CardTitle>
              نبذة شخصية
            </CardTitle>

            <CardDescription>
              اكتب نبذة مختصرة عنك.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <FormField
              label="النبذة"
              htmlFor="bio"
              error={errors.bio?.message}
            >
              <Textarea
                id="bio"
                placeholder="اكتب نبذة مختصرة عنك..."
                className="min-h-32 resize-y"
                {...register("bio")}
                aria-invalid={!!errors.bio}
              />
            </FormField>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={
              isSaving ||
              (!isDirty && !imageFile)
            }
          >
            إلغاء التغييرات
          </Button>

          <Button
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                جارٍ الحفظ...
              </>
            ) : (
              <>
                <Save className="size-4" />
                حفظ التغييرات
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Form Field                                                                 */
/* -------------------------------------------------------------------------- */

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
};

function FormField({
  label,
  htmlFor,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>
        {label}
      </Label>

      {children}

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
