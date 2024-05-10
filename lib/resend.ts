import EmailContent from "@/components/auth/email-content";
import { getUserByEmail } from "@/getData/getUser";
import { Resend } from "resend";
import { generateTwoFactorToken, generateUpdateToken } from "./tokens";

//todo: Khởi tạo Resend
const resend = new Resend(`${process.env.RESEND_API_KEY}`);

//todo: docs(https://resend.com/docs/api-reference/emails/send-email)
//todo: Tạo function sendVerificationToken nhiệm vụ tương tự fetch api POST request tới Resend, sử dụng function sendVerificationToken tại những nơi cần POST req RESEND để RESEND send verification token to email
export const sendVerificationToken = async (email: string, token: string) => {
  const user = await getUserByEmail(email);
  if (!user) {
    return;
  }
  const name = user.name;

  //todo: Tạo url của page xác thực mà email sẽ gửi tới
  const urlVerification: string = `${process.env.NEXT_PUBLIC_APP_URL}/auth/newVerificationToken?token=${token}`; //* phải có http ở đầu url để nội dung email mới tự động nhận dạng là href

  await resend.emails.send({
    from: "Resend <onboarding@resend.dev>",
    to: email, //* email người dùng nhập vào form
    subject: "Xác Thực Next-Auth",
    //todo: sử dụng html hoặc react để tạo nội dung email
    // html: `<div>
    //     <h1> Xin Chào ${user?.name}.</h1>
    //     <p>Email: ${email}</p>
    //     <p>Bấm vào <a href="${urlVerification}">đây</a> để hoàn tất xác thực người dùng.</p>
    // </div>`,
    react: EmailContent({ name, email, urlVerification }),
  });
};

export const sendResetPasswordToken = async (email: string, token: string) => {
  const user = await getUserByEmail(email); //* get thông tin user để hiển thị lên email
  if (!user) {
    return;
  }
  const resetPasswordUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/newResetPasswordToken?token=${token}`;

  await resend.emails.send({
    from: "Resend <onboarding@resend.dev>",
    to: email,
    subject: "Thay đổi mật khẩu Next-Auth",
    html: `<div>
        <h1> Xin Chào ${user?.name}.</h1>
        <p>Email: ${email}</p>
        <p>Bấm vào <a href="${resetPasswordUrl}">đây</a> để thay đổi mật khẩu.</p>
    </div>`,
  });
};

//todo: Resend two factor auth
export const sendTwoFactorToken = async (email: string) => {
  const twoFactorToken = await generateTwoFactorToken(email);
  await resend.emails.send({
    from: "Resend <onboarding@resend.dev>",
    to: email,
    subject: "Mã xác thực đăng nhập Next-Auth",
    html: `<div>
        <h1> Xin Chào.</h1>
        <p>Email: ${email}</p>
        <p>Mã code: ${twoFactorToken.token}</p>
    </div>`,
  });
};

export const sendUpdateToken = async (email: string) => {
  const updateToken = await generateUpdateToken(email);
  await resend.emails.send({
    from: "Resend <onboarding@resend.dev>",
    to: email,
    subject: "Mã xác thực Next-Auth",
    html: `<div>
        <h1> Xin Chào.</h1>
        <p>Email: ${email}</p>
        <p>Mã code: ${updateToken.token}</p>
    </div>`,
  });
};
