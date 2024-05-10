"use client";

import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface LoginButtonProps {
  children: React.ReactNode;
  mod?: "" | "";
  asChild?: boolean;
  className?: string;
}
const LoginButton = ({
  children,
  mod,
  asChild,
  className,
}: LoginButtonProps) => {
  const submitLogin = () => {
    console.log("Submit Login");
  };
  return (
    <Button
      className={cn("w-full cursor-pointer my-3", className)}
      variant="default"
      onClick={submitLogin}
    >
      {children}
    </Button>
  );
};

export default LoginButton;
