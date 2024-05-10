"use server";
import { z } from "zod";
import { InputNewPasswordFormSchema } from "@/formSchema";
import { getUserByEmail } from "@/getData/getUser";
import { getResetPasswordTokenByToken } from "@/getData/getResetPasswordToken";
import bcrypt from "bcryptjs";
import prismadb from "@/lib/prismadb";

//todo: Nhận vào 1 ResetPasswordToken và 1 InputNewPasswordForm, trong ResetPasswordToken có chứa email cần thay đổi mật khẩu và trong InputNewPassửodForm chứa mật khẩu mới
export const changePassword = async (
  token: string,
  valuesForm: z.infer<typeof InputNewPasswordFormSchema>
) => {
  //todo: check inputNewPassword validation
  const validCheck = InputNewPasswordFormSchema.safeParse(valuesForm);
  if (!validCheck.success) return { error: "Validation error !" };
  const { currentPassword, newPassword } = validCheck.data;

  //todo: check existingToken để lấy email từ token đó
  const existingToken = await getResetPasswordTokenByToken(token);
  if (!existingToken)
    return { error: "Đã có lỗi xảy ra, token không tồn tại !" };

  //todo: check expires
  if (new Date(existingToken.expires) < new Date())
    return { error: "Xác thực đã hết hạn, vui lòng thử lại !" };

  //todo: lấy được email từ token, sử dụng nó check existingUser để lấy currentPassword của user
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser || !existingUser.password)
    return { error: "Đã có lỗi xảy ra, người dùng không hợp lệ !" };

  //todo: check đúng currentPassword input và existingUser.password Database
  if (!bcrypt.compareSync(currentPassword, existingUser.password))
    return { error: "Nhập mật khẩu hiện tại không đúng, vui lòng thử lại !" };

  await prismadb.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: bcrypt.hashSync(newPassword, 10),
    },
  });

  await prismadb.resetPasswordToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "Đã thay đổi mật khẩu thành công !" };
};
