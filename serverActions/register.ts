"use server";
import { z } from "zod";
import { RegisterFormSchema } from "@/formSchema";
import prismadb from "@/lib/prismadb";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/getData/getUser";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationToken } from "@/lib/resend";

//todo: Nhận vào form values - check validation - create user - return thông báo về client

export const register = async (values: z.infer<typeof RegisterFormSchema>) => {
  //todo: Check validation back-end
  const validCheck = RegisterFormSchema.safeParse(values);

  if (!validCheck.success) {
    return {
      error: "Validation Error!",
    };
  }

  //todo: CREATE USER
  //todo: check user với email đăng kí đã tồn tại trong db hay chưa
  //todo: Check user với email đăng kí
  const userByEmail = await getUserByEmail(validCheck.data.email);
  //todo: Nếu tồn tại thì error
  if (userByEmail) {
    return { error: "Email này đã tồn tại!" };
  }

  //todo: Nếu chưa tồn tại thì tạo mới user
  await prismadb.user.create({
    data: {
      name: validCheck.data.name,
      phone: validCheck.data.phone,
      email: validCheck.data.email,
      password: bcrypt.hashSync(validCheck.data.password, 10), //* hash password, hashSync() là async func, hash() default func
    },
  });

  //todo: VERIFICATIONTOKEN
  const verificationToken = await generateVerificationToken(
    //* Tạo verificationToken
    validCheck.data.email
  );
  //todo: Send the verification token to email
  await sendVerificationToken(verificationToken.email, verificationToken.token); //* sử dụng email và thuộc verificationToken vừa tạo

  return { success: "Đã gửi xác thực email !" };
};
