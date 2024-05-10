"use client";
import { ShieldX } from "lucide-react";
import React from "react";

interface FormErrorProps {
  message?: string;
}
const FormError = ({ message }: FormErrorProps) => {
  if (!message) {
    return null;
  }
  return (
    <div className="w-full h-fit flex flex-row items-center justify-start gap-x-3 p-2 bg-red-100 rounded-lg text-sm text-red-600">
      <ShieldX />
      <p>{message}</p>
    </div>
  );
};

export default FormError;
