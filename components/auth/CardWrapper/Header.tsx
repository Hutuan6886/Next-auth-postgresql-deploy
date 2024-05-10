"use client";
import React from "react";

const Header = ({ label }: { label: string }) => {
  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold">{label}</h3>
    </div>
  );
};

export default Header;
