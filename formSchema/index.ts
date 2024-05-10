import { z } from "zod";

//todo: Định nghĩa schema của form (structure, validation ,...)

const passwordValidation = new RegExp( //* một chữ Viết hoa và 1 viết thường và 1 kí tự đặc biệt
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);
export const LoginFormSchema = z.object({
  email: z.string().min(1).email({
    message: "Email không hợp lệ !",
  }),
  password: z
    .string()
    .min(8, {
      message:
        "Mật khẩu phải có ít nhất 8 kí tự, bao gồm 1 chữ cái viết hoa, 1 chữ cái viết thường và 1 kí tự đặc biệt!",
    })
    .regex(passwordValidation, {
      message:
        "Mật khẩu phải có ít nhất 8 kí tự, bao gồm 1 chữ cái viết hoa, 1 chữ cái viết thường và 1 kí tự đặc biệt!",
    }),
  code: z.string().min(0),
});

export const RegisterFormSchema = z
  .object({
    name: z.string().min(2, {
      message: "",
    }),
    phone: z
      .string()
      .min(10, {
        message: "Số điện thoại phải chứa 10 số!",
      })
      .max(10, {
        message: "Số điện thoại phải chứa 10 số!",
      }),
    email: z.string().min(1).email({
      message: "Email không hợp lệ !",
    }),
    password: z
      .string()
      .min(8, {
        message:
          "Mật khẩu phải có ít nhất 8 kí tự, bao gồm 1 chữ cái viết hoa, 1 chữ cái viết thường và 1 kí tự đặc biệt!",
      })
      .regex(passwordValidation, {
        message:
          "Mật khẩu phải có ít nhất 8 kí tự, bao gồm 1 chữ cái viết hoa, 1 chữ cái viết thường và 1 kí tự đặc biệt!",
      }),
    confirmPassword: z.string(),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Nhập lại mật khẩu không trùng khớp!",
      path: ["confirmPassword"],
    }
  );

export const ForgotPassWordFormSchema = z.object({
  email: z.string().min(1).email({
    message: "Email không hợp lệ !",
  }),
});

export const InputNewPasswordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, {
        message:
          "Mật khẩu phải có ít nhất 8 kí tự, bao gồm 1 chữ cái viết hoa, 1 chữ cái viết thường và 1 kí tự đặc biệt!",
      })
      .regex(passwordValidation, {
        message:
          "Mật khẩu phải có ít nhất 8 kí tự, bao gồm 1 chữ cái viết hoa, 1 chữ cái viết thường và 1 kí tự đặc biệt!",
      }),
    newPassword: z
      .string()
      .min(8, {
        message:
          "Mật khẩu phải có ít nhất 8 kí tự, bao gồm 1 chữ cái viết hoa, 1 chữ cái viết thường và 1 kí tự đặc biệt!",
      })
      .regex(passwordValidation, {
        message:
          "Mật khẩu phải có ít nhất 8 kí tự, bao gồm 1 chữ cái viết hoa, 1 chữ cái viết thường và 1 kí tự đặc biệt!",
      }),
    confirmNewPassword: z.string(),
  })
  .refine(
    (values) => {
      return values.currentPassword !== values.newPassword;
    },
    {
      message:
        "Vui lòng không sử dụng mật khẩu mới trùng với mật khẩu hiện tại !",
      path: ["newPassword"],
    }
  )
  .refine(
    (values) => {
      return values.newPassword === values.confirmNewPassword;
    },
    {
      message: "Nhập lại mật khẩu mới không trùng khớp!",
      path: ["confirmNewPassword"],
    }
  );

export const UpdateInfoFormSchema = z
  .object({
    name: z.string().min(2, {
      message: "",
    }),
    phone: z
      .string()
      .min(10, {
        message: "Số điện thoại phải chứa 10 số!",
      })
      .max(10, {
        message: "Số điện thoại phải chứa 10 số!",
      }),
    email: z.string().min(1).email({
      message: "Email không hợp lệ !",
    }),
    role: z.string(),
    isEnabledTwoFactorAuth: z.boolean().optional(),
    currentPassword: z
      .optional(
        z
          .string()
          .min(8, {
            message:
              "Mật khẩu phải có ít nhất 8 kí tự, bao gồm 1 chữ cái viết hoa, 1 chữ cái viết thường và 1 kí tự đặc biệt!",
          })
          .regex(passwordValidation, {
            message:
              "Mật khẩu phải có ít nhất 8 kí tự, bao gồm 1 chữ cái viết hoa, 1 chữ cái viết thường và 1 kí tự đặc biệt!",
          })
      )
      .or(z.literal("")),
    //todo: optional là field có thể có để trống
    newPassword: z
      .optional(
        z
          .string()
          .min(8, {
            message:
              "Mật khẩu phải có ít nhất 8 kí tự, bao gồm 1 chữ cái viết hoa, 1 chữ cái viết thường và 1 kí tự đặc biệt!",
          })
          .regex(passwordValidation, {
            message:
              "Mật khẩu phải có ít nhất 8 kí tự, bao gồm 1 chữ cái viết hoa, 1 chữ cái viết thường và 1 kí tự đặc biệt!",
          })
      )
      .or(z.literal("")),

    confirmNewPassword: z
      .optional(
        z
          .string()
          .min(8, {
            message:
              "Mật khẩu phải có ít nhất 8 kí tự, bao gồm 1 chữ cái viết hoa, 1 chữ cái viết thường và 1 kí tự đặc biệt!",
          })
          .regex(passwordValidation, {
            message:
              "Mật khẩu phải có ít nhất 8 kí tự, bao gồm 1 chữ cái viết hoa, 1 chữ cái viết thường và 1 kí tự đặc biệt!",
          })
      )
      .or(z.literal("")),
    code: z.string().min(0),
  })
  .refine(
    (values) => {
      return values.newPassword === values.confirmNewPassword;
    },
    {
      message: "Nhập lại mật khẩu mới không trùng khớp!",
      path: ["confirmNewPassword"],
    }
  );
