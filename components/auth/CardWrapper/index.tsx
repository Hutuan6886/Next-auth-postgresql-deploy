"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import React from "react";
import Header from "./Header";
import Social from "./Social";
import GoToRegister from "./GoToRegister";

interface LoginCardProps {
  children: React.ReactNode;
  label: string;
  registerLabel: string;
  registerHref: string;
  socialLogin: boolean;
}

const index = ({
  children,
  label,
  registerLabel,
  registerHref,
  socialLogin,
}: LoginCardProps) => {
  return (
    <Card>
      <CardHeader>
        <Header label={label} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {socialLogin && (
        <CardFooter className="flex flex-col items-center">
          <Social />
        </CardFooter>
      )}
      <CardFooter className="flex flex-col items-center">
        <GoToRegister label={registerLabel} href={registerHref} />
      </CardFooter>
    </Card>
  );
};

export default index;
