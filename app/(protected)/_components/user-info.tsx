import React from "react";
import { Session } from "next-auth";
import { Badge } from "@/components/ui/badge";

interface UserInfoProps {
  user: Session["user"] | undefined; //* Session["user"] là user được định nghĩa tại next-auth.d.ts
}

//todo: userInfo là server component hay client component phụ thuộc vào parent chứa nó
const UserInfo = ({ user }: UserInfoProps) => {
  return (
    <div className="w-full md:w-[50%] h-full flex flex-col gap-5 m-auto my-5">
      <h1 className="font-bold text-2xl">Thông Tin Tài Khoản</h1>

      <div className="w-full flex flex-col items-center gap-2">
        <div className="w-full flex flex-row justify-between border px-3 py-2 rounded-md">
          <h2 className="font-semibold">ID:</h2>
          <p>{user?.id}</p>
        </div>
        <div className="w-full flex flex-row justify-between border px-3 py-2 rounded-md">
          <h2 className="font-semibold">Họ và tên:</h2>
          <p>{user?.name}</p>
        </div>
        <div className="w-full flex flex-row justify-between border px-3 py-2 rounded-md">
          <h2 className="font-semibold">Email:</h2>
          <p>{user?.email}</p>
        </div>
        <div className="w-full flex flex-row justify-between border px-3 py-2 rounded-md">
          <h2 className="font-semibold">Role:</h2>
          <p>{user?.role}</p>
        </div>
        <div className="w-full flex flex-row justify-between border px-3 py-2 rounded-md">
          <h2 className="font-semibold">Bảo Mật 2 Lớp:</h2>
          <Badge className="rounded-md" variant={user?.isEnabledTwoFactorAuth ? 'on':'outline'}>
            {user?.isEnabledTwoFactorAuth ? "ON" : "OFF"}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
