import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import React from "react";
import Navbar from "./_components/navbar";
import { Toaster } from "@/components/ui/toaster";

//todo: (protected) chứa /settings route là 1 client component, nên (protected) layout phải là server component để session cho settings route, session sẽ được (protected) layout truyền vào children của nó thông qua <SessionProvider session={}>
//todo: tại children của (protected) layout, muốn truy suất giá trị session thì sử dụng useSession()
//todo: <SessionProvider> bọc tại đâu thì phạm vi của session được sử dụng tại đó, vậy nên để bảo mật người dùng, chỉ bọc những route có thẩm quyền truy suất vào thông tin user như settings route, chứ không nên bọc layout của toàn bộ ứng dụng
const layoutProtected = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth(); //* session được lấy từ auth(), chính là giá trị từ Jwt callback trả về trong ./auth/ts

  return (
    <SessionProvider session={session}>
      <Navbar />
      {children}
      <Toaster />
    </SessionProvider>
  );
};

export default layoutProtected;
