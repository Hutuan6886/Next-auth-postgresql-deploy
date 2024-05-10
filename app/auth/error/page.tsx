import CardWrapper from "@/components/auth/CardWrapper";
import React from "react";
import { IoWarning } from "react-icons/io5";

const page = () => {
  return (
    <div className="w-full h-full bg-zinc-900 flex flex-row items-center justify-center">
      <div className="w-full h-fit lg:w-[30%] ">
        <CardWrapper
          label="Oops !"
          registerLabel="Quay lại để đăng nhập"
          registerHref="/auth/login"
          socialLogin={false}
        >
          <div className="flex flex-col items-center gap-2 text-red-600">
            <p className="font-semibold">Đã xảy ra lỗi, vui lòng thử lại !</p>
            <IoWarning className="text-3xl" />
          </div>
        </CardWrapper>
      </div>
    </div>
  );
};

export default page;
