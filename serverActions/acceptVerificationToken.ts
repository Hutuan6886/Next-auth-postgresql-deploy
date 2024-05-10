"use server";

import { getUserByEmail } from "@/getData/getUser";
import { getVerificationTokenByToken } from "@/getData/getVerificationToken";
import prismadb from "@/lib/prismadb";

//todo: sử dụng như 1 api thực hiện xác thực token, server component này được gọi trong NewVerificationForm

export const acceptVerificationToken = async (token: string) => {
  //todo: nhận vào 1 token mới, token mới có nhiệm vụ  check existing token
  const existingVerificationToken = await getVerificationTokenByToken(token);
  if (!existingVerificationToken) {
    return { error: "Xác thực không tồn tại, vui lòng thử lại !" };
  }
  //todo: check verificationToken hasExpired
  if (new Date(existingVerificationToken.expires) < new Date()) {
    return { error: "Xác thực đã hết hạn, vui lòng thử lại !" };
  }

  //todo: check existing user from verificationToken
  const existingUser = await getUserByEmail(existingVerificationToken.email);
  if (!existingUser) {
    return { error: "Email không tồn tại, vui lòng thử lại !" };
  }

  //todo: Nếu tồn tại user từ email của verificationToken, thực hiện xác thực cho user đó bằng cách thay đổi emailVerification
  await prismadb.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(), //* Thực hiện xác thực người dùng
    },
  });

  //todo: Sau khi verificationToken thực hiện xác thực user xong, thì xoá verificationToken đi
  await prismadb.verificationToken.delete({
    where: {
      id: existingVerificationToken.id,
    },
  });

  return { success: "Xác thực email thành công !" };
};
