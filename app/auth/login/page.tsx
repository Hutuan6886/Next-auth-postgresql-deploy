"use client";
import React from "react";
import LoginForm from "@/components/auth/login-form";

const page = () => {
  return (
    <div className="w-full h-full bg-[url('/images/backgroundLogin_1.jpg')] bg-no-repeat bg-cover bg-center bg-fixed flex flex-row items-center justify-center">
      <LoginForm />
    </div>
  );
};

export default page;
