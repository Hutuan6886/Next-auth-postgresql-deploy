"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PiSignOutBold } from "react-icons/pi";
import { FaUser } from "react-icons/fa";
import { logout } from "@/serverActions/logout";
const Navbar = () => {
  const pathName = usePathname(); //* Lấy giá trị url để thực hiện active

  const arrNav = [
    {
      label: "Server",
      href: "/server",
      active: pathName === "/server" ? true : false,
    },
    {
      label: "Client",
      href: "/client",
      active: pathName === "/client" ? true : false,
    },
    {
      label: "Admin",
      href: "/admin",
      active: pathName === "/admin" ? true : false,
    },
    {
      label: "Settings",
      href: "/settings",
      active: pathName === "/settings" ? true : false,
    },
  ];
  return (
    <nav className="bg-zinc-100 w-[95%] rounded-2xl m-auto my-4 flex flex-row items-center justify-between px-3 py-1 md:px-6 md:py-4">
      <div className="flex flex-row items-center  justify-start gap-2">
        {arrNav.map((itemNav, index) => (
          <Button
            key={index}
            variant={itemNav.active ? "default" : "ghost"}
            className="p-0 rounded-lg transition"
          >
            <Link href={itemNav.href} className="p-3 py-2">
              {itemNav.label}
            </Link>
          </Button>
        ))}
      </div>
      <div className="ml-auto">
        <Popover>
          <PopoverTrigger>
            <Avatar>
              <AvatarImage src="" alt=""></AvatarImage>
              <AvatarFallback className="text-xs font-semibold text-white bg-blue-300">
                <FaUser />
              </AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className="w-fit">
            <Button
              variant="ghost"
              className="hover:bg-white flex flex-row items-center justify-start gap-2"
              onClick={() => {
                logout();
              }}
            >
              Đăng xuất <PiSignOutBold />
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
};

export default Navbar;
