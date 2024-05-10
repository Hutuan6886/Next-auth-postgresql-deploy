"use client";
import { ForgotPassWordFormSchema } from "@/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CardWrapper from "./CardWrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FormSuccess from "./FormAnnounce/FormSuccess";
import FormError from "./FormAnnounce/FormError";
import { sendResetPasswordToEmail } from "@/serverActions/sendResetPasswordToEmail";

const ForgotPassWordForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const forgotPassWordForm = useForm<z.infer<typeof ForgotPassWordFormSchema>>({
    resolver: zodResolver(ForgotPassWordFormSchema),
    defaultValues: {
      email: "",
    },
  });
  const submitForgotPasswordForm = (
    values: z.infer<typeof ForgotPassWordFormSchema>
  ) => {
    startTransition(() => {
      sendResetPasswordToEmail(values).then((data) => {
        //* data là đối tượng mà resetPassword(values) trả ra
        setSuccess(data.success);
        setError(data.error);
      });
    });
  };

  return (
    <div className="w-full h-fit lg:w-[30%] ">
      <CardWrapper
        label="Quên Mật Khẩu"
        registerLabel="Quay lại để đăng nhập"
        registerHref="/auth/login"
        socialLogin={false}
      >
        <Form {...forgotPassWordForm}>
          <form
            onSubmit={forgotPassWordForm.handleSubmit(submitForgotPasswordForm)}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col items-start gap-y-3">
              <FormField
                disabled={isPending}
                name="email"
                control={forgotPassWordForm.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="abc@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormSuccess message={success} />
            <FormError message={error} />
            <Button type="submit" className="w-full">
              Xác Nhận
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
};

export default ForgotPassWordForm;
