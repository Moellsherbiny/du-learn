import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("البريد الإلكتروني غير صحيح"),

  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    first_name: z.string().trim().min(2, "الاسم الأول مطلوب"),
    last_name: z.string().trim().min(2, "الاسم العائلة مطلوب"),
    email: z.email("البريد الإلكتروني غير صحيح"),

    password1: z
      .string()
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
      .regex(/[A-Z]/, "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل")
      .regex(/[a-z]/, "يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل")
      .regex(/\d/, "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل")
      .regex(
        /[^A-Za-z0-9]/,
        "يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل",
      ),

    password2: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.password1 === data.password2, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["password2"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
