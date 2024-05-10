import prismadb from "@/lib/prismadb";

export const getResetPasswordTokenByToken = async (token: string) => {
  try {
    const resetPasswordToken = await prismadb.resetPasswordToken.findUnique({
      where: {
        token,
      },
    });
    return resetPasswordToken;
  } catch (error) {
    return null;
  }
};

export const getResetPasswordTokenByemail = async (email: string) => {
  try {
    const resetPasswordToken = await prismadb.resetPasswordToken.findFirst({
      where: {
        email,
      },
    });
    return resetPasswordToken;
  } catch (error) {
    return null;
  }
};
