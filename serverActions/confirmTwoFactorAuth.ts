import { getTwoFactorConfirmationByUserId } from "@/getData/getTwoFactorConfirmation";
import { getTwoFactorTokenByEmail } from "@/getData/getTwoFactorToken";
import prismadb from "@/lib/prismadb";

export const confirmTwoFactorAuth = async (
  userId: string,
  email: string,
  token: string
) => {
  //todo: Kiểm tra tồn tại twoFactoToken không
  const existingTwoFactorToken = await getTwoFactorTokenByEmail(email);
  if (!existingTwoFactorToken) {
    return { error: "Xác thực không tồn tại !" };
  }

  //todo: Nếu tồn tại twoFactoToken, thì check twoFactorToken.token và token lấy từ input field
  if (existingTwoFactorToken.token !== token) {
    return { error: "Mã xác thực không đúng !" };
  }

  //todo: Check hasExpired
  const hasExprired = new Date(existingTwoFactorToken.expires) < new Date();
  if (hasExprired) {
    return { error: "Xác thực đã hết hạn !" };
  }

  //todo: Xoá sendTwoFactorToken
  //* khi login(email,password) -> sendTwoFactorToken() thực hiện tạo mới 1 sendTwoFactorToken và gửi token vừa tạo về email -> sử dụng token đó để login(email,pasword,code) -> vì vậy cần xoá đi twoFactorToken trước đó đã tạo ra
  await prismadb.twoFactorToken.delete({
    where: {
      id: existingTwoFactorToken.id,
    },
  });

  //todo: Tạo twoFactorTokenConfirmation bằng userId để cho phép đăng nhập tại signIn callback ở @/auth.ts
  const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(userId);
  if (twoFactorConfirmation) {
    await prismadb.twoFactorConfirmation.delete({
      where: {
        id: twoFactorConfirmation.id,
      },
    });
  }

  await prismadb.twoFactorConfirmation.create({
    data: {
      userId,
    },
  });
};
