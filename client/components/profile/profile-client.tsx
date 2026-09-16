"use client";

import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  UserRound,
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
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { apiRequest } from "@/lib/api/client";
import { useAuthStore } from "@/stores/auth-store";

type ProfileUser = {
  first_name: string;
  last_name: string;
  image: string | null;
  phone: string;
  date_of_birth: string | null;
  city: string;
  country: string;
};

type StudentProfile = {
  bio: string;
  school: string;
  grade_level: string;
};

type ProfileResponse = {
  user: ProfileUser;
  profile: StudentProfile;
};

type ProfileForm = {
  first_name: string;
  last_name: string;
  phone: string;
  date_of_birth: string;
  city: string;
  country: string;
  bio: string;
  school: string;
  grade_level: string;
};

const EMPTY_FORM: ProfileForm = {
  first_name: "",
  last_name: "",
  phone: "",
  date_of_birth: "",
  city: "",
  country: "",
  bio: "",
  school: "",
  grade_level: "",
};

export function ProfileClient() {
  const authUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] =
    useState<ProfileResponse | null>(null);

  const [form, setForm] =
    useState<ProfileForm>(EMPTY_FORM);

  const [imagePreview, setImagePreview] =
    useState<string | null>(
      authUser?.image ?? null,
    );

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const data =
          await apiRequest<ProfileResponse>({
            path: "/api/auth/profile/",
            method: "GET",
          });

        if (!mounted) return;

        setProfile(data);

        setForm({
          first_name: data.user.first_name ?? "",
          last_name: data.user.last_name ?? "",
          phone: data.user.phone ?? "",
          date_of_birth:
            data.user.date_of_birth ?? "",
          city: data.user.city ?? "",
          country: data.user.country ?? "",
          bio: data.profile.bio ?? "",
          school: data.profile.school ?? "",
          grade_level:
            data.profile.grade_level ?? "",
        });

        setImagePreview(
          data.user.image ?? null,
        );
      } catch (error) {
        if (!mounted) return;

        toast.error(
          error instanceof Error
            ? error.message
            : "فشل تحميل بيانات الملف الشخصي",
        );
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  function updateField(
    field: keyof ProfileForm,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("من فضلك اختر صورة صحيحة.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "حجم الصورة يجب ألا يتجاوز 5MB.",
      );
      event.target.value = "";
      return;
    }

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    const preview =
      URL.createObjectURL(file);

    setImageFile(file);
    setImagePreview(preview);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isSaving) return;

    setIsSaving(true);

    try {
      const body = new FormData();

      body.append(
        "first_name",
        form.first_name.trim(),
      );

      body.append(
        "last_name",
        form.last_name.trim(),
      );

      body.append(
        "phone",
        form.phone.trim(),
      );

      /*
       * Don't send an invalid empty date value.
       */
      if (form.date_of_birth) {
        body.append(
          "date_of_birth",
          form.date_of_birth,
        );
      }

      body.append(
        "city",
        form.city.trim(),
      );

      body.append(
        "country",
        form.country.trim(),
      );

      body.append(
        "bio",
        form.bio.trim(),
      );

      body.append(
        "school",
        form.school.trim(),
      );

      body.append(
        "grade_level",
        form.grade_level.trim(),
      );

      if (imageFile) {
        body.append(
          "image",
          imageFile,
        );
      }

      const data =
        await apiRequest<ProfileResponse>({
          path: "/api/auth/profile/",
          method: "PATCH",
          body,
        });

      setProfile(data);

      setForm({
        first_name:
          data.user.first_name ?? "",
        last_name:
          data.user.last_name ?? "",
        phone: data.user.phone ?? "",
        date_of_birth:
          data.user.date_of_birth ?? "",
        city: data.user.city ?? "",
        country: data.user.country ?? "",
        bio: data.profile.bio ?? "",
        school: data.profile.school ?? "",
        grade_level:
          data.profile.grade_level ?? "",
      });

      setImageFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }

      setImagePreview(
        data.user.image ?? null,
      );

      /*
       * Keep the global auth user synchronized
       * with the updated profile.
       */
      if (authUser) {
        setUser({
          ...authUser,
          first_name:
            data.user.first_name,
          last_name:
            data.user.last_name,
          image:
            data.user.image ?? "",
        });
      }

      toast.success(
        "تم تحديث الملف الشخصي بنجاح.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء حفظ التغييرات.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex min-h-100 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="flex min-h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">
              تعذر تحميل الملف الشخصي.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fullName =
    `${form.first_name} ${form.last_name}`.trim() ||
    "المستخدم";

  const initials =
    `${form.first_name.charAt(0)}${form.last_name.charAt(0)}`
      .trim()
      .toUpperCase() || "U";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-12 pt-4 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          الملف الشخصي
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          إدارة معلوماتك الشخصية وبياناتك التعليمية
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Profile summary */}
          <Card className="h-fit overflow-hidden">
            <CardContent className="flex flex-col items-center px-6 py-8 text-center">
              <div className="relative">
                <Avatar className="size-28 border-4 border-background shadow-md ring-1 ring-border">
                  <AvatarImage
                    src={
                      imagePreview ?? undefined
                    }
                    alt={fullName}
                    className="object-cover"
                  />

                  <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="absolute bottom-0 left-0 flex size-9 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="تغيير الصورة"
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

              <h2 className="mt-4 text-lg font-semibold">
                {fullName}
              </h2>

              <p className="mt-1 max-w-full truncate text-sm text-muted-foreground">
                {authUser?.email}
              </p>

              <div className="mt-5 w-full rounded-lg bg-muted/50 px-4 py-3 text-right">
                <p className="text-xs text-muted-foreground">
                  نوع الحساب
                </p>

                <p className="mt-1 text-sm font-medium">
                  طالب
                </p>
              </div>

              <p className="mt-4 text-xs leading-5 text-muted-foreground">
                اضغط على أيقونة الكاميرا لتغيير
                صورة الملف الشخصي. الحد الأقصى
                لحجم الصورة 5MB.
              </p>
            </CardContent>
          </Card>

          {/* Form */}
          <div className="space-y-6">
            {/* Personal information */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <UserRound className="size-4" />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      المعلومات الشخصية
                    </h2>

                    <p className="text-sm text-muted-foreground">
                      معلوماتك الأساسية
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">
                      الاسم الأول
                    </Label>

                    <Input
                      id="first_name"
                      value={form.first_name}
                      onChange={(event) =>
                        updateField(
                          "first_name",
                          event.target.value,
                        )
                      }
                      placeholder="الاسم الأول"
                      autoComplete="given-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_name">
                      اسم العائلة
                    </Label>

                    <Input
                      id="last_name"
                      value={form.last_name}
                      onChange={(event) =>
                        updateField(
                          "last_name",
                          event.target.value,
                        )
                      }
                      placeholder="اسم العائلة"
                      autoComplete="family-name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    البريد الإلكتروني
                  </Label>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="email"
                      value={authUser?.email ?? ""}
                      disabled
                      className="pr-10"
                    />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    لا يمكن تغيير البريد الإلكتروني
                    من هنا.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      رقم الهاتف
                    </Label>

                    <div className="relative">
                      <Phone className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                      <Input
                        id="phone"
                        type="tel"
                        dir="ltr"
                        value={form.phone}
                        onChange={(event) =>
                          updateField(
                            "phone",
                            event.target.value,
                          )
                        }
                        placeholder="01xxxxxxxxx"
                        className="pr-10"
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">
                      تاريخ الميلاد
                    </Label>

                    <Input
                      id="date_of_birth"
                      type="date"
                      value={form.date_of_birth}
                      onChange={(event) =>
                        updateField(
                          "date_of_birth",
                          event.target.value,
                        )
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      المدينة
                    </Label>

                    <div className="relative">
                      <MapPin className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                      <Input
                        id="city"
                        value={form.city}
                        onChange={(event) =>
                          updateField(
                            "city",
                            event.target.value,
                          )
                        }
                        placeholder="المدينة"
                        className="pr-10"
                        autoComplete="address-level2"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">
                      الدولة
                    </Label>

                    <Input
                      id="country"
                      value={form.country}
                      onChange={(event) =>
                        updateField(
                          "country",
                          event.target.value,
                        )
                      }
                      placeholder="الدولة"
                      autoComplete="country-name"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <div>
                  <h2 className="font-semibold">
                    المعلومات التعليمية
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    معلوماتك الدراسية
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="school">
                      المدرسة
                    </Label>

                    <Input
                      id="school"
                      value={form.school}
                      onChange={(event) =>
                        updateField(
                          "school",
                          event.target.value,
                        )
                      }
                      placeholder="اسم المدرسة"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grade_level">
                      الصف الدراسي
                    </Label>

                    <Input
                      id="grade_level"
                      value={form.grade_level}
                      onChange={(event) =>
                        updateField(
                          "grade_level",
                          event.target.value,
                        )
                      }
                      placeholder="مثال: الصف الثالث الثانوي"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">
                    نبذة عني
                  </Label>

                  <Textarea
                    id="bio"
                    value={form.bio}
                    onChange={(event) =>
                      updateField(
                        "bio",
                        event.target.value,
                      )
                    }
                    placeholder="اكتب نبذة قصيرة عنك..."
                    rows={5}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSaving}
                className="min-w-36"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    حفظ التغييرات
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}