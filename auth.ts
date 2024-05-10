//todo: (Để khắc phục vấn đề lưu các tuỳ chọn cấu hình vào 1 tệp riêng và gọi nó khắp application giống như authOptions. Nên trong phiên bản next-auth v5 để file cấu hình vào bên trong root application file và export the auth function tại những nơi nào cần sử dụng nó trong application)
import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prismadb from "@/lib/prismadb";
import { getUserById } from "@/getData/getUser";
import { getTwoFactorConfirmationByUserId } from "./getData/getTwoFactorConfirmation";

export const {
  handlers: { GET, POST },
  auth,
  //todo Khai báo signIn và signOut function của next-auth
  signIn,
  signOut,
} = NextAuth({
  pages: {
    //todo: Khi sigIn bị error, sẽ tự động redirect qua route api/auth/signIn hoặc error khác của next-auth tạo ra. Vì vậy, Cấu hình route của mình muốn redirect tới nếu signIn bị error
    signIn: "/auth/login", //* -> khi xảy ra error sẽ redirect về /auth/login (ví dụ: route next-auth tạo ra http://localhost:3000/api/auth/signIn?error=OAuthAccountNotLinked -> redirect về http://localhost:3000/auth/login?error=OAuthAccountNotLinked)
    error: "/auth/error", //* -> Khi đăng nhập hoàn tất, nếu có error thì redirect qua /auth/error là 1 authRoutes được định nghĩa tại routes.ts
  },
  events: {
    //todo: event sử dụng để nếu đăng nhập thành công bằng OAuth sẽ lấy user đó thực thi một vấn đề gì đó bên trong chính nó, nhằm thay đổi giá trị emailVerified của user khi đăng nhập OAuth, để user đăng nhập bằng OAuth không cần bước xác thực email nữa, mà nó đã thực hiện tự động
    async linkAccount({ user, account, profile }) {
      await prismadb.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    //todo: Khai báo callback
    async signIn({ user, account }) {
      console.log("signIn callback", { User: user, Account: account });

      //* signIn callback protect signIn sẽ return true hoặc false để cho phép hoặc không cho phép signIn (tại đây check các điều điện thoả mãn để signIn)
      //todo: Cho phép OAuth đăng nhập khi không có emailVerification
      if (account?.provider !== "credentials") return true; //* sử dụng .provider hoặc .type đều được

      //todo:  Credentials đăng nhập nhưng user không emailVerification=null thì block
      const existingUser = await getUserById(user.id); //* user bên trên không đủ thông tin, nên sử dụng user.id để lấy existingUser từ db về
      if (!existingUser?.emailVerified) return false; //* Nếu chưa xác thực thì không được đăng nhập

      //todo: Thực hiện check có xác thực 2 lớp two factor authentication hay không
      if (existingUser.isEnabledTwoFactorAuth) {
        const twoFactorConfirmation = getTwoFactorConfirmationByUserId(
          existingUser.id
        );
        if (!twoFactorConfirmation) {
          return false; //* Nếu user có 2FA mà không có twoFactorConfirmation thì block
        }

        await prismadb.twoFactorConfirmation.delete({
          //* Nếu user có 2FA mà có tồn tại twoFactorConfirmation thì xoá twoFactorConfirmation và tiếp tục cho phép login return true
          where: {
            userId: existingUser.id,
          },
        });
      }

      return true;
    },
    //todo: sử dụng id user lấy từ token trong jwt để get user từ database trong callback, sau đó lấy giá trị từ đó để đưa vào final session
    async session({ session, user, token }) {
      //* token của session callback giống(is identical) với {token} đều là orginal tokne, chỉ khác, session token hiển thị custom token từ {token}

      if (session.user) {
        //* Các thuộc tính của user bên trong {session} chính là các giá trị được hiển thị tại client, vì vậy muốn extend giá trị của user ở client thì add nó tại đây
        if (token.sub) {
          //* Đây là custom field khi đã có sẵn giá trị sub trong token
          session.user.id = token.sub;
        }
        //* Các giá trị session được sử dụng hiển thị trên browser như name,email,phone,... vẫn phải định nghĩa token và gán cho session để tự động update render theo database sau khi database cập nhật giá trị
        if (token.name) session.user.name = token.name;
        if (token.email) session.user.email = token.email;
        if (token.phone) session.user.phone = token.phone;
        if (token.role) {
          //* Đây là custom field tự custom token tại jwt (role là thuộc tính của user được định nghĩa trong schema)
          session.user.role = token.role;
        }
        if (token.password) session.user.password = token.password;

        if (token.isOAuth) session.user.isOAuth = token.isOAuth;

        session.user.isEnabledTwoFactorAuth = token.isEnabledTwoFactorAuth; //* gán isEnabledTwoFactorAuth vừa định nghĩa ở token vào session.user
      }
      console.log("session callback", {
        Session: session,
        User: user,
        Token: token,
      });
      return session; //* giá trị session được return tại đây, sẽ được sử dụng ở tất cả server component hoặc client components khi gọi session
    },

    //todo: callback sử dụng để mở rộng giá trị của session đang đăng nhập từ user hiện tại được lấy từ auth() tại client, giá trị session mà Session callback trả về sẽ được lấy để sử dụng tại client, bởi vì nó thiếu vài giá trị quan trọng nên cần mở rộng session để sử dụng
    async jwt({ token, user, account, profile, trigger, session }) {
      //* token: user: User | AdapterUser; account: Account | null; profile?: Profile | undefined; trigger?: "signIn" | "update" | "signUp" | undefined; isNewUser?: boolean | undefined; session?: any; đây là những thứ có thể extend của user
      //*: This callback is called whenever a JSON Web Token is created (i.e. at sign in) or updated (i.e whenever a session is accessed in the client). Its content is forwarded to the session callback, where you can control what should be returned to the client. Anything else will be kept from your front-end.
      console.log("jwt callback", {
        Token: token,
        User: user,
        Account: account,
        Profile: profile,
        Trigger: trigger,
        Session: session,
      });
      //todo: Tại đây có thể định nghĩa thêm các field cho token
      token.customToken = "test custom token";
      if (account) token.isOAuth = account.type;

      //todo: Sử dụng userId, get giá trị user từ database để extend giá trị cho session
      if (!token.sub) {
        return token;
      }
      const existingUser = await getUserById(token.sub);
      console.log("existingUser", existingUser);

      if (existingUser) {
        if (existingUser.phone) token.phone = existingUser.phone;
        //* Các giá trị session được sử dụng hiển thị trên browser vẫn phải định nghĩa lại tại token và gán cho session để tự động update render theo database sau khi database cập nhật giá trị
        token.name = existingUser.name;
        token.email = existingUser.email;
        token.role = existingUser.role;
        if (existingUser.password) token.password = existingUser.password;

        token.isEnabledTwoFactorAuth = existingUser.isEnabledTwoFactorAuth; //* Định nghĩa isEnabledTwoFactorAuth cho token
        return token;
      }
      return token; //* token sau khi được return có thể được truy cập tại middleware trong qua Request
    },
  },
  adapter: PrismaAdapter(prismadb), //*add cấu hình auth và database-adapter tại đây (PrismaAdapter), bởi vì by default prisma not work on the Edge - Nên auth.ts khai báo PrismaAdapter, auth.config.ts sẽ sử dụng trong middleware, nên đó là lý do tách 2 file
  //* use non-edge supported prisma adapter
  session: { strategy: "jwt" },
  ...authConfig,
});
