import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { LoginFormSchema } from "@/formSchema";
import { getUserByEmail } from "@/getData/getUser";
import bcrypt from "bcryptjs";

//todo: Cấu hình các Provider (GitHub,Google,...), auth.config.ts sẽ sử dụng trong middleware
//todo: Tại auth.ts sẽ định nghĩa PrismaAdapter

//todo: provider Github, google hoặc Credentials
export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        //todo: check validation, bởi vì validation check ở serverComponent login có thể bypass
        const validatedFields = LoginFormSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          //todo: check user email này có tồn tại trong db hay chưa
          const user = await getUserByEmail(email);
          if (!user || !user.password) {
            //* Nếu user không tồn tại trong email hoặc user đó không có password(đăng nhập bằng Github hoặc Google) thì kết thúc tại đây
            return null;
          }
          //todo: check correct password
          const isCorrectPassword = await bcrypt.compare(
            password,
            user.password
          );
          if (isCorrectPassword) {
            return user; //* return user -> tại middleware: req.auth=true
          }
          //   await bcrypt.compare(password, user.password).then((result) => {
          //     if (result) user;
          //   });
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
