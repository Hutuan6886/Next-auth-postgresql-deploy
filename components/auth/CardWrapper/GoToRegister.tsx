"use client";
import Link from "next/link";
import React from "react";

const GoToRegister = ({ label, href }: { label: string; href: string }) => {
  return (
    <div className="flex flex-row items-center justify-start gap-x-2">
      <Link className="text-sm hover:text-zinc-500 transition-all" href={href}>
        {label}
      </Link>
    </div>
  );
};

export default GoToRegister;
