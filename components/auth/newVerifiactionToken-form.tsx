"use client";
import React, { useCallback, useEffect, useState } from "react";
import CardWrapper from "./CardWrapper";
import { useSearchParams } from "next/navigation";
import { BounceLoader } from "react-spinners";
import { acceptVerificationToken } from "@/serverActions/acceptVerificationToken";
import FormError from "./FormAnnounce/FormError";
import FormSuccess from "./FormAnnounce/FormSuccess";

const NewVerificationTokenForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  //todo: Lấy giá trị token từ params
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const autoAcceptVerificationToken = useCallback(async () => {
    console.log("token", token);
    if (!token) {
      setError("Token không tồn tại, vui lòng thử lại !");
      setLoading(false);
      return;
    }
    await acceptVerificationToken(token)
      .then((data) => {
        setError(data.error);
        setSuccess(data.success);
        setLoading(false);
      })
      .catch(() => {
        setError("Đã xảy ra lỗi, vui lòng thử lại !");
      }); //* thực hiện xác thực người dùng
  }, [token]); //* nếu token thay đổi giữa các lần hiển thị, thì autoAcceptVerificationToken tạo lại hàm

  useEffect(() => {
    //* componentDidUpdate, useEffect được gọi khi autoAcceptVerificationToken thay đổi
    autoAcceptVerificationToken();
  }, [autoAcceptVerificationToken]);

  return (
    <div className="w-full h-fit lg:w-[30%] ">
      <CardWrapper
        label="Xác Thực Email"
        registerLabel=""
        registerHref=""
        socialLogin={false}
      >
        <div className="flex flex-cols justify-center">
          <BounceLoader color="#36d7b7" loading={loading} />
          {!success && <FormError message={error} />}
          {!error && <FormSuccess message={success} />}
        </div>
      </CardWrapper>
    </div>
  );
};

export default NewVerificationTokenForm;
