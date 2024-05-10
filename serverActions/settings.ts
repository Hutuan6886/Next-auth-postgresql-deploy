"use server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { UpdateInfoFormSchema } from "@/formSchema";
import { auth } from "@/auth";
import { sendUpdateToken } from "@/lib/resend";
import { getUpdateTokenByEmail } from "@/getData/getUpdateToken";
import prismadb from "@/lib/prismadb";
import { UserRole } from "@prisma/client";
import { getUserByEmail } from "@/getData/getUser";

export const settings = async (
  values: z.infer<typeof UpdateInfoFormSchema>
) => {
  //todo: Check currentUser bằng email của session hiện tại
  const session = await auth();
  const currentUser = session?.user;

  if (!currentUser) {
    return { error: "Người dùng không tồn tại!" };
  }

  //todo: Check user là Credentials hay là OAuth
  //todo: Check nếu user là OAuth, thì sẽ chỉ cho chỉnh sử name, phone, role, sau đó update, còn nếu không thì user là credentials
  if (session.user.isOAuth === "oauth") {
    values.isEnabledTwoFactorAuth === undefined;
    values.currentPassword === undefined;
    values.newPassword === undefined;
    values.confirmNewPassword === undefined;

    await prismadb.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: values.name,
        phone: values.phone,
        role: values.role as UserRole,
      },
    });
    return { success: "Chỉnh sửa thông tin thành công" };
  }

  //todo: User là credentials
  //todo: check valid form
  const validCheck = UpdateInfoFormSchema.safeParse(values);
  if (!validCheck && values.newPassword === values.confirmNewPassword) {
    return { error: "Giá trị thay đổi không hợp lệ!" };
  }

  //todo: thay đổi Credential là phải bắt buộc điền password
  if (!values.currentPassword) {
    return { error: "Bắt buộc điền mật khẩu hiện tại!" };
  }

  //todo: Check newPassword với currentPassword
  const passwordMatch = bcrypt.compareSync(
    values.currentPassword,
    currentUser.password
  );
  if (!passwordMatch) {
    return { error: "Sai mật khẩu, vui lòng nhập lại!" };
  }

  //todo: Check form có thông tin nào bị thay đổi không, nếu không thì không send email để update
  if (
    values.email === currentUser?.email &&
    values.name === currentUser?.name &&
    values.phone === currentUser?.phone &&
    values.role === currentUser?.role &&
    !!values.isEnabledTwoFactorAuth === currentUser.isEnabledTwoFactorAuth &&
    values.newPassword === "" &&
    values.confirmNewPassword === ""
  ) {
    console.log("yes");

    return { error: "Không có thông tin nào thay đổi!" };
  }

  //todo: Check email, để thay đổi email hợp lệ
  if (values.email && values.email !== currentUser.email) {
    //*: Check không được thay đổi email
    const existingUser = await getUserByEmail(values.email); //* Check email thay đổi có trùng với các email đã tồn tại hay chưa
    if (existingUser) {
      return { error: "Email này đã tồn tại!" };
    }
  }

  //todo: Check. nếu form gửi lên, field 2FAToken rỗng thì send 2FA code to email. Nếu field 2FAToken đúng giá trị token thì update info user
  if (!values.code) {
    await sendUpdateToken(values.email);
    return {
      isCodeField: true,
      successSendToken: "Gửi mã xác thực thành công.",
    };
  } else {
    //todo: Check code correction
    const existingUpdateToken = await getUpdateTokenByEmail(values.email);
    if (!existingUpdateToken) {
      return { error: "Mã xác thực không tồn tại!" };
    }
    if (values.code !== existingUpdateToken.token) {
      return { error: "Mã xác thực không chính xác!" };
    }

    //todo: delete updateToken
    await prismadb.updateToken.delete({
      where: {
        id: existingUpdateToken.id,
      },
    });
  }

  //todo: Cho phép update thông tin user
  if (values.newPassword) {
    //* update khi thay đổi password, nghĩa là newPassword có giá trị
    await prismadb.user.update({
      where: { id: currentUser.id },
      data: {
        password: bcrypt.hashSync(values.newPassword, 10),
      },
    });
  }

  //*update không thay đổi password
  await prismadb.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      name: values.name,
      email: values.email,
      phone: values.phone,
      role: values.role as UserRole,
      isEnabledTwoFactorAuth: values.isEnabledTwoFactorAuth,
    },
  });
  return { successUpdate: "Thay đổi thông tin thành công." };
};
