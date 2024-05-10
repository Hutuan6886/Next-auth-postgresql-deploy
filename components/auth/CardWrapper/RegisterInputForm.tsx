"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterFormSchema } from "@/formSchema";
import { register } from "@/serverActions/register";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormSuccess from "../FormAnnounce/FormSuccess";
import FormError from "../FormAnnounce/FormError";

const RegisterInputForm = () => {
  //todo: disable field and render error or success
  const [isPending, startTransition] = useTransition(); //* isPending=true khi startTransition thực thi, thực thi hoàn thành isPending=false
  const [error, setError] = useState<string | undefined>(""); //* error có giá trị thì success undefined
  const [success, setSuccess] = useState<string | undefined>(""); //* error undefined thì success có giá trị
  //todo: define form
  const registerForm = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const submitRegister = (values: z.infer<typeof RegisterFormSchema>) => {
    console.log("register submit", values);

    //todo: startTransition diễn ra, call login server
    setSuccess("");
    setError("");
    startTransition(() => {
      register(values).then((data: { error?: string; success?: string }) => {
        setError(data?.error);
        setSuccess(data?.success);
        registerForm.reset();
      });
    });
  };
  return (
    <Form {...registerForm}>
      <form
        onSubmit={registerForm.handleSubmit(submitRegister)}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col items-start gap-3">
          <FormField
            disabled={isPending}
            name="name"
            control={registerForm.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Họ Và Tên</FormLabel>
                <FormControl>
                  <Input type="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={isPending}
            name="phone"
            control={registerForm.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Số Điện Thoại</FormLabel>
                <FormControl>
                  <Input type="phone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={isPending}
            name="email"
            control={registerForm.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={isPending}
            name="password"
            control={registerForm.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Mật Khẩu</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={isPending}
            name="confirmPassword"
            control={registerForm.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nhập Lại Mật Khẩu</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormSuccess message={success} />
        <FormError message={error} />
        <Button
          disabled={isPending}
          type="submit"
          variant="default"
          className="w-full"
        >
          Đăng Ký
        </Button>
      </form>
    </Form>
  );
};

export default RegisterInputForm;
