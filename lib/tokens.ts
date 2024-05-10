import { v4 as uuidv4 } from "uuid";
import prismadb from "./prismadb";
import { getVerificationTokenByEmail } from "@/getData/getVerificationToken";
import { getResetPasswordTokenByemail } from "@/getData/getResetPasswordToken";
import crypto from "crypto";
import { getTwoFactorTokenByEmail } from "@/getData/getTwoFactorToken";
import { getUpdateTokenByEmail } from "@/getData/getUpdateToken";

//todo: Tạo VerificationToken (remove VerificationToken cũ của email này và tạo mới VerificationToken cho email này)
//todo: Sử dụng function generateVerificationToken này tại nơi như register action (sau khi tạo tài khoản thì sẽ tạo mới VerificationToken), login action (sau khi đăng nhập thì tạo mới VerificationToken), hoặc tại những button gửi request action xác thực thông tin,...
export const generateVerificationToken = async (email: string) => {
  const expires = new Date(new Date().getTime() + 60 * 60 * 1000); //* new Date(miliseconds) currentTime cộng thêm 60 phút (1h biểu diễn bằng miliseconds)
  const token = uuidv4(); //* Tạo token mới

  //todo: Kiểm tra VerificationToken của email này có tồn tại trước đó không, nếu có thì xoá đi để tạo VerificationToken mới bởi vì VerificationToken cũ chứa token cũ
  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await prismadb.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  //todo: Sau khi xoá cũ, tạo mới verificationToken với token mới
  const verificationToken = await prismadb.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};

//todo: Tạo ResetPasswordToken cho 1 email
export const generateResetPasswordToken = async (email: string) => {
  //todo: Nếu resetPasswordToken đã tồn tại thì xoá đi cái cũ, tạo resetPasswordToken mới
  const existingToken = await getResetPasswordTokenByemail(email);
  if (existingToken) {
    await prismadb.resetPasswordToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const resetPasswordToken = await prismadb.resetPasswordToken.create({
    data: {
      email,
      token: uuidv4(),
      expires: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
    },
  });

  return resetPasswordToken;
};

//todo: Tạo TwoFactorToken cho 1 email nào đó
export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(99999, 1000000).toString(); //* Tạo number 6 số trong khoảng 9999-100000
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000); //* 5 phút

  const existingToken = await getTwoFactorTokenByEmail(email);
  if (existingToken) {
    await prismadb.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const twoFactorToken = await prismadb.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return twoFactorToken;
};

export const generateUpdateToken = async (email: string) => {
  const token = await crypto.randomInt(99999, 1000000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingToken = await getUpdateTokenByEmail(email);

  if (existingToken) {
    await prismadb.updateToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }
  const updateToken = await prismadb.updateToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  return updateToken;
};
