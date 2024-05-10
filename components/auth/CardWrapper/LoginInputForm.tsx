"use client";
import React, { useState, useTransition } from "react";
import { z } from "zod";
import { LoginFormSchema } from "@/formSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "@/serverActions/login";
import FormSuccess from "../FormAnnounce/FormSuccess";
import FormError from "../FormAnnounce/FormError";
import { useRouter, useSearchParams } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const LoginInputForm = () => {
  //todo: Thông báo success or error and set disabled field when server run
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [showCodeInput, setShowCodeInput] = useState<boolean>(false);

  const router = useRouter();
  //todo: Khi signIn trùng tài khoản credential hoặc github hoặc google, sẽ redirect qua errorUrl (localhost:...?error=OAuthAccountNotLinked), lấy giá trị error trong errorUrl hiển thị error trên layout
  const searchParams = useSearchParams();
  const existingUserError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email này đã tồn tại !"
      : "";

  const loginForm = useForm<z.infer<typeof LoginFormSchema>>({
    //todo: Define LoginForm
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const submitLoginForm = (values: z.infer<typeof LoginFormSchema>) => {
    //todo: Define submit button
    console.log("submitLoginForm", values);

    //todo: startTransition diễn ra, call login server
    setError("");
    setSuccess("");
    startTransition(() => {
      login(values)
        .then(
          (
            data:
              | { error?: string; success?: string; isShowCodeInput?: boolean }
              | undefined
          ) => {
            if (data?.error) {
              setError(data?.error);
              loginForm.reset();
            }
            if (data?.success) {
              setSuccess(data?.success);
            }
            if (data?.isShowCodeInput) {
              setShowCodeInput(true);
              loginForm.resetField("code");
            }
          }
        )
        .catch(() => {
          setError("Đã xảy ra lỗi, vui lòng thử lại !");
        });
    });
  };
  return (
    <Form {...loginForm}>
      <form
        onSubmit={loginForm.handleSubmit(submitLoginForm)}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col items-start gap-y-3">
          <FormField
            disabled={isPending}
            control={loginForm.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="...@gmail.com" {...field} />
                </FormControl>
                {/* <FormDescription></FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={isPending}
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                {/* <FormDescription></FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          {showCodeInput && (
            <>
              <FormField
                disabled={isPending}
                control={loginForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác Thực Đăng Nhập</FormLabel>
                    <FormControl>
                      <InputOTP
                        onWheel={(event) => event.currentTarget.blur()}
                        maxLength={6}
                        {...field}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Please enter the one-time password sent to your email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          <Button
            type="button"
            size="sm"
            variant="link"
            className="text-sm p-0"
            onClick={() => router.push("/auth/forgotPassword")}
          >
            Quên mật khẩu ?
          </Button>
        </div>
        <FormSuccess message={success} />
        <FormError message={error || existingUserError} />
        <Button disabled={isPending} type="submit" className="w-full">
          {!showCodeInput ? "Đăng Nhập" : "Xác Nhận"}
        </Button>
      </form>
    </Form>
  );
};

export default LoginInputForm;
