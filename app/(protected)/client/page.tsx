"use client";
import { useSession } from "next-auth/react";
import React from "react";
import UserInfo from "../_components/user-info";

//todo: Lấy thông tin user bằng session tại client component
const ClientPage = () => {
  const session = useSession();

  return (
    <div className="w-[95%] m-auto">
      {JSON.stringify(session)}
      <UserInfo user={session.data?.user} />
    </div>
  );
};

export default ClientPage;
