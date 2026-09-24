import { z } from "zod";

export const passwordSchema = z
  .object({
    current_password: z
      .string()
      .min(1, "يرجى إدخال كلمة المرور الحالية."),

    new_password: z
      .string()
      .min(
        8,
        "كلمة المرور يجب أن تكون 8 أحرف على الأقل.",
      ),

    confirm_password: z
      .string()
      .min(
        1,
        "يرجى تأكيد كلمة المرور الجديدة.",
      ),
  })
  .refine(
    (data) =>
      data.new_password === data.confirm_password,
    {
      message: "كلمتا المرور غير متطابقتين.",
      path: ["confirm_password"],
    },
  );

export type PasswordFormValues = z.infer<
  typeof passwordSchema
>;