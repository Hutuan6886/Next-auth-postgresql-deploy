import NextAuth, { DefaultSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { JWT } from "next-auth/jwt";

//todo: Định nghĩa thêm thuộc tính mở rộng cho session được mở rộng tại auth.ts
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      //* định nghĩa thêm thuộc tính cho session tại đây
      role: UserRole;
      isEnabledTwoFactorAuth: boolean;
      phone: string;
      password: string;
      isOAuth: string;
    } & DefaultSession["user"];
  }
}

//todo: Định nghĩa thuộc tính mở rộng cho Jwt token
declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    role?: UserRole;
    isEnabledTwoFactorAuth: boolean;
    phone: string;
    password: string;
    isOAuth: string;
  }
}
