"use client";

import React, { useState, useTransition } from "react";
import CardWrapper from "./CardWrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { InputNewPasswordFormSchema } from "@/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { changePassword } from "@/serverActions/changePassword";
import FormError from "./FormAnnounce/FormError";
import FormSuccess from "./FormAnnounce/FormSuccess";

const NewResetPasswordTokenForm = () => {
  const searchParams = useSearchParams();

  const token = searchParams.get("token"); //*: lấy token từ params

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const inputNewPasswordForm = useForm<
    z.infer<typeof InputNewPasswordFormSchema>
  >({
    resolver: zodResolver(InputNewPasswordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const submitInputNewPasswordForm = (
    values: z.infer<typeof InputNewPasswordFormSchema>
  ) => {
    startTransition(() => {
      if (!token) return;
      console.log(values);

      changePassword(token, values).then((data) => {
        setSuccess(data.success);
        setError(data.error);
        inputNewPasswordForm.reset();
      });
    });
  };
  return (
    <div className="w-full h-fit lg:w-[30%] ">
      <CardWrapper
        label="Đổi Mật Khẩu"
        registerLabel=""
        registerHref=""
        socialLogin={false}
      >
        <Form {...inputNewPasswordForm}>
          <form
            onSubmit={inputNewPasswordForm.handleSubmit(
              submitInputNewPasswordForm
            )}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col items-start gap-y-3">
              <FormField
                disabled={isPending}
                name="currentPassword"
                control={inputNewPasswordForm.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Mật Khẩu Hiện Tại</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isPending}
                name="newPassword"
                control={inputNewPasswordForm.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Mật Khẩu Mới</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isPending}
                name="confirmNewPassword"
                control={inputNewPasswordForm.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Nhập Lại Mật Khẩu Mới</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormError message={error} />
              <FormSuccess message={success} />
            </div>
            <Button className="w-full" type="submit">
              Xác Nhận
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
};

export default NewResetPasswordTokenForm;
