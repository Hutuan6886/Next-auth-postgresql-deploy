"use server";

//todo: "use server" tương tự như api routes, values input chính là các req:Request của api routes
import { z } from "zod";
import { LoginFormSchema } from "@/formSchema";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/getData/getUser";
import { generateVerificationToken } from "@/lib/tokens";
import { sendTwoFactorToken, sendVerificationToken } from "@/lib/resend";
import { confirmTwoFactorAuth } from "./confirmTwoFactorAuth";

//todo: Nhận vào form values - check validation - check user - check password - create signIn() auth - return thông báo về client

export const login = async (values: z.infer<typeof LoginFormSchema>) => {
  //todo: Check validation back-end
  const validCheck = LoginFormSchema.safeParse(values);
  if (!validCheck.success) {
    return { error: "Validation Error!" };
  }
  const { email, password, code } = validCheck.data;

  //todo: VERIFICATIONTOKEN: Xác thực verificationToken trước khi thực hiện signIn credentials
  const existingUser = await getUserByEmail(email); //* check user không phải là OAuth user
  if (!existingUser || !existingUser.email) {
    return { error: "Người dùng không tồn tại !" }; //* check user tồn tại
  }
  if (!existingUser.password) {
    return { error: "Người dùng không hợp lệ !" }; //* check user không phải là OAuth
  }
  if (!existingUser.emailVerified) {
    //todo: kiểm tra user chưa xác thực email, thực hiện xác thực, nếu xác thực rồi thì k cần xác thực lại
    const verificationToken = await generateVerificationToken(email); //* Tạo lại verificationToken trước khi gửi xác thực
    //todo: Gửi Resend xác thực
    await sendVerificationToken(
      //* sử dụng email và thuộc verificationToken vừa tạo
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Đã gửi xác thực email !" };
  }

  //todo: Add 2FA credentials check, OAuth sẽ không cần bởi vì nó có 2FA của chính nó
  if (existingUser.isEnabledTwoFactorAuth) {
    //todo: Check có input token code được gửi từ loginForm(emai,password,code) không, nếu không có thì thực hiện send code to email, nếu có thì thực hiện confirmTwoFactorAuth
    if (!code) {
      await sendTwoFactorToken(existingUser.email); //* send 2FA code to email
      return { isShowCodeInput: true }; //* Sau khi gửi return isShowCodeInput true để hiển thị code input field ở client
    } else {
      await confirmTwoFactorAuth(existingUser.id, existingUser.email, code); //*: Thực hiện xác thực 2FA. Nếu không return error sẽ thoát vòng if và tiếp tục chạy xuống try{}catch
    }
  }

  try {
    //todo: sử dụng đăng nhập bằng signIn function của ./auth
    await signIn("credentials", {
      //* Nếu đăng nhập OAuth tại server component thì sử dụng đăng nhâp bằng signIn ./auth ở đây, chỉ cần thay đổi 'credentials' thành 'github' hoặc 'google'. Ngoài ra để sử dụng OAuth(github hoặc google) đăng nhập tại client components thì sử dụng signIn from 'next-auth/react' (đăng nhập OAuth sử dụng signIn tại client component trong Social.tsx)
      email,
      password,
      code,
      redirectTo: DEFAULT_LOGIN_REDIRECT, //* signIn được import từ @/auth, nó là từ server -> chỉ cần redirectTo:..., còn nếu tại client component thì sử dụng callbackUrl:...
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return { error: "Tài khoản hoặc mật khẩu không hợp lệ !" };
        }
        default: {
          return { error: "Đã xảy ra lỗi xác thực !" };
        }
      }
    }
    throw error;
  }
};
