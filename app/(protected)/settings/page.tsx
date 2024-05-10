"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import UserInfo from "../_components/user-info";
import UpdateInfo from "../_components/update-info";
import useStoreSettings from "@/hooks/useStoreSettings";

const SettingsPage = () => {
  const storeSettings = useStoreSettings();
  const session = useSession();

  if (storeSettings.isOpenUpdateInfoForm) {
    return <UpdateInfo />;
  }

  return (
    <div className="w-[95%] m-auto flex flex-col gap-3">
      <UserInfo user={session?.data?.user} />
      <div className="m-auto w-[50%] flex flex-row justify-end">
        <Button onClick={storeSettings.openUpdateInfoForm}>
          Cập Nhật Thông Tin
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
