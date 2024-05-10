"use client";
import React, { useTransition } from "react";
import CardWrapper from "./CardWrapper";
import RegisterInputForm from "./CardWrapper/RegisterInputForm";

const RegisterForm = () => {
  return (
    <div className="w-full h-fit lg:w-[30%] ">
      <CardWrapper
        label="Đăng Ký"
        registerLabel="Bạn đã có tài khoản ?"
        registerHref="/auth/login"
        socialLogin={false}
      >
        <RegisterInputForm />
      </CardWrapper>
    </div>
  );
};

export default RegisterForm;
