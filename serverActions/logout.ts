"use server";
import { signOut } from "@/auth";

//todo: call logout method auth server, logout action có thể sử dụng được tại client component và server component
export const logout = async () => {
  await signOut();
};
