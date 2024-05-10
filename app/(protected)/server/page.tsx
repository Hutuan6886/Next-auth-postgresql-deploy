"use server";
import { auth } from "@/auth";
import React from "react";
import UserInfo from "../_components/user-info";

//todo: Lấy thông tin user bằng session tại server component
const ServerPage = async () => {
  const session = await auth();
  return (
    <div className="w-[95%] m-auto">
      {JSON.stringify(session)}
      <UserInfo user={session?.user} />
    </div>
  );
};

export default ServerPage;
