"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();
  return (
    <div className="w-full flex flex-row justify-between items-center px-3 py-2">
      <h1 className="text-sm font-bold">NEXT_AUTH_APP_BY_HUU_TUAN</h1>
      <div className="flex flex-row justify-between items-center gap-3">
        <Button
          variant="ghost"
          onClick={() => {
            router.push("/auth/register");
          }}
        >
          Đăng Kí
        </Button>
        <Button
          variant="default"
          onClick={() => {
            router.push("/auth/login");
          }}
        >
          Đăng Nhập
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
