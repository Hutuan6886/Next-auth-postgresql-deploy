"use client";
import React, { useState, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UpdateInfoFormSchema } from "@/formSchema";
import useStoreSettings from "@/hooks/useStoreSettings";
import { UserRole } from "@prisma/client";
import { settings } from "@/serverActions/settings";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import FormError from "@/components/auth/FormAnnounce/FormError";
import FormSuccess from "@/components/auth/FormAnnounce/FormSuccess";
import { useSession } from "next-auth/react";

const UpdateInfo = () => {
  const session = useSession();
  const user = session.data?.user;

  const storeSettings = useStoreSettings();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [openCodeField, setOpenCodeField] = useState<boolean>(false);

  const updateInfoForm = useForm<z.infer<typeof UpdateInfoFormSchema>>({
    resolver: zodResolver(UpdateInfoFormSchema),
    defaultValues: user
      ? {
          name: user.name || undefined,
          email: user.email || undefined,
          phone: user.phone || undefined,
          role: user.role || undefined,
          isEnabledTwoFactorAuth: user.isEnabledTwoFactorAuth || undefined,
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
          code: "",
        }
      : undefined,
  });

  const submitUpdateInfo = (values: z.infer<typeof UpdateInfoFormSchema>) => {
    console.log("update-info form", values);
    setError("");
    setSuccess("");
    startTransition(() => {
      settings(values)
        .then((res) => {
          if (res.error) {
            setError(res.error);
          }
          if (res.successSendToken) {
            setSuccess(res.successSendToken);
          }
          if (res.successUpdate) {
            setSuccess(res.successUpdate);
            updateInfoForm.reset();
            storeSettings.closeUpdateInfoForm();
            session.update(); //* Để cập nhật tính nhất quán giá trị sau chỉnh sửa tại DB cho layouts của client và server
          }
          if (res.isCodeField) {
            setOpenCodeField(res.isCodeField);
          }
        })
        .catch(() => {
          setError("Đã xảy ra lỗi, vui lòng thử lại!");
        });
    });
  };
  return (
    <div className="w-[75%] m-auto">
      <Form {...updateInfoForm}>
        <form onSubmit={updateInfoForm.handleSubmit(submitUpdateInfo)}>
          <div className="flex flex-col gap-3">
            {user?.isOAuth !== "oauth" && (
              <FormField
                disabled={isPending}
                control={updateInfoForm.control}
                name="email"
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
            )}
            <FormField
              disabled={isPending}
              control={updateInfoForm.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Họ Và Tên</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isPending}
              control={updateInfoForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Số Điện Thoại</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isPending}
              control={updateInfoForm.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Vai trò của tài khoản" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={UserRole.ADMIN}>ADMIN</SelectItem>
                      <SelectItem value={UserRole.USER}>USER</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {user?.isOAuth !== "oauth" && (
              <>
                <FormField
                  disabled={isPending}
                  control={updateInfoForm.control}
                  name="isEnabledTwoFactorAuth"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Bảo Mật 2 Lớp
                        </FormLabel>
                        <FormDescription>
                          Tính năng bảo mật 2 lớp giúp tăng bảo mật cho người
                          dùng.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isPending}
                  control={updateInfoForm.control}
                  name="currentPassword"
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
                  control={updateInfoForm.control}
                  name="newPassword"
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
                  control={updateInfoForm.control}
                  name="confirmNewPassword"
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
              </>
            )}
            {openCodeField && user?.isOAuth !== "oauth" && (
              <>
                <FormField
                  disabled={isPending}
                  control={updateInfoForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã Xác Thực</FormLabel>
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

            {error && <FormError message={error} />}
            {success && <FormSuccess message={success} />}
          </div>
          <div className="flex flex-row justify-end items-center gap-3 my-6">
            <Button
              type="button"
              variant="ghost"
              onClick={storeSettings.closeUpdateInfoForm}
            >
              Quay Lại
            </Button>
            <Button type="submit">Xác Nhận</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdateInfo;
