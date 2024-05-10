"use client";
import RegisterForm from "@/components/auth/register-form";
import React from "react";

const page = () => {
  return (
    <div className="w-full h-full md:h-fit bg-[url('/images/backgroundLogin_1.jpg')] bg-no-repeat bg-cover bg-center bg-fixed flex flex-row items-center justify-center">
      <RegisterForm />
    </div>
  );
};

export default page;
