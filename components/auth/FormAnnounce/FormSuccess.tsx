"use client";
import { MailCheck } from "lucide-react";
import React from "react";

interface FormSuccessProps {
  message?: string;
}
const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) {
    return null;
  }
  return (
    <div className="w-full h-fit flex flex-row items-center justify-start gap-x-3 p-2 bg-green-100 rounded-lg text-sm text-green-600">
      <MailCheck />
      <p>{message}</p>
    </div>
  );
};

export default FormSuccess;
