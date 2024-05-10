import prismadb from "@/lib/prismadb";

export const getUpdateTokenByEmail = async (email: string) => {
  try {
    const updateToken = await prismadb.updateToken.findFirst({
      where: {
        email,
      },
    });
    return updateToken;
  } catch (error) {
    return null;
  }
};
