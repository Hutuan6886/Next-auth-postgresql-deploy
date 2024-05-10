"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";
import AdminTest from "../_components/admin-test";
import { UserRole } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { adminRole } from "@/serverActions/adminRole";
//todo: ví dụ về cách protected admin with call server action hoặc call api
const AdminPage = () => {
  const { toast } = useToast();
  const adminServerAction = () => {
    adminRole()
      .then((res) => {
        if (res.success) {
          toast({
            variant: "default",
            description: "Allowed.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Forbidden.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Forbidden.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      });
  };
  const adminFetchingApi = () => {
    fetch("/api/admin")
      .then((res) => {
        if (res.ok) {
          toast({
            variant: "default",
            description: "Allowed.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Forbidden.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      });
  };
  return (
    <div className="w-[95%] m-auto">
      <Card>
        <CardHeader className="font-semibold">Thông Tin Bảo Mật</CardHeader>
        <CardContent>
          <AdminTest roleAllow={UserRole.ADMIN}>
            <div className="w-full flex flex-row items-center justify-between px-4 py-3 border rounded-xl">
              Test dữ liệu bằng Server Action
              <Button onClick={adminServerAction}>Test</Button>
            </div>
            <div className="w-full flex flex-row items-center justify-between px-4 py-3 border rounded-xl">
              Test dữ liệu bằng Fetching API Data
              <Button onClick={adminFetchingApi}>Test</Button>
            </div>
          </AdminTest>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
