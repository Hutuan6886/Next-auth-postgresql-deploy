"use server";
import { z } from "zod";
import { ForgotPassWordFormSchema } from "@/formSchema";
import { getUserByEmail } from "@/getData/getUser";
import { generateResetPasswordToken } from "@/lib/tokens";
import { sendResetPasswordToken } from "@/lib/resend";

export const sendResetPasswordToEmail = async (
  values: z.infer<typeof ForgotPassWordFormSchema>
) => {
  //todo: check valid email
  const validCheck = await ForgotPassWordFormSchema.safeParse(values);
  if (!validCheck.success) {
    return { error: "Email không hợp lệ, vui lòng thử lại !" };
  }

  const { email } = validCheck.data;
  //todo: check tài khoản user tồn tại bằng check user by email
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Người dùng không tồn tại" };
  }

  //todoL Tạo token cho email
  const resetPasswordToken = await generateResetPasswordToken(email);
  //todo: send tokenUrl cho email vừa tạo
  await sendResetPasswordToken(
    resetPasswordToken.email,
    resetPasswordToken.token
  );

  return { success: "Đã gửi xác thực email !" };
};
