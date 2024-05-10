"use client";
import React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

const Social = () => {
  const loginOAuth = (provider: "github" | "google") => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT, //* signIn được import from 'next-auth/react' tại client component thì sử dụng callbackUrl:..., tại server nếu sử dụng signIn from '@/auth' thì khai báo redirectTo:...
    });
  };
  return (
    <div className="w-full h-full flex flex-row items-center justify-center gap-x-4">
      <Button
        className="w-full cursor-pointer rounded-md"
        variant="outline"
        size="lg"
        onClick={() => loginOAuth("github")}
      >
        <FaGithub size={30} />
      </Button>
      <Button
        className="w-full cursor-pointer rounded-md"
        variant="outline"
        size="lg"
        onClick={() => loginOAuth("google")}
      >
        <FcGoogle size={30} />
      </Button>
    </div>
  );
};

export default Social;
