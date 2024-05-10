"use client";

import FormError from "@/components/auth/FormAnnounce/FormError";
import FormSuccess from "@/components/auth/FormAnnounce/FormSuccess";
import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import React from "react";

interface AdminTestProps {
  roleAllow: UserRole; 
  children: React.ReactNode;
}
//todo: Đây là 1 RoleGate commponent
const AdminTest = ({ roleAllow, children }: AdminTestProps) => {
  const session = useSession();

  if (session.data?.user.role !== roleAllow) {      //* RoleGate commponent để protected layout
    return (
      <FormError message="Người dùng hiện tại không có quyền truy cập thông tin này !" />
    );
  }
  return (
    <div className="flex flex-col items-start gap-3">
      <FormSuccess message="Truy cập thông tin thành công !" />
      {children}
    </div>
  );
};

export default AdminTest;
