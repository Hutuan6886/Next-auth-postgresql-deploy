"use client";
import React from "react";
import CardWrapper from "./CardWrapper";
import LoginInputForm from "./CardWrapper/LoginInputForm";

//todo: Giao diện loginForm

const LoginForm = () => {
  return (
    <div className="w-full h-fit lg:w-[30%] ">
      <CardWrapper
        label="Đăng Nhập"
        registerLabel="Bạn chưa có tài khoản ?"
        registerHref="/auth/register"
        socialLogin={true}
      >
        <LoginInputForm />
      </CardWrapper>
    </div>
  );
};

export default LoginForm;
