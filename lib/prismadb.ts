/* 
todo: Chúng ta có thể khởi tạo prismadb bằng cách const prismadb = new PrismaClient(), nhưng nó có thể chạy tốt khi ở môi trường "production", còn môi trường development nó sẽ bị warning lỗi bởi vì hot reload của nextjs, làm cho prismadb bị khởi tạo(initialize) nhiều lần sau mỗi lần save file
*/

import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismadb = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb;

/*
 * Ban đầu globalThis.prisma chưa có giá trị -> khởi tạo prismadb = new PrismaClient()
 * Check nếu không phải production -> gán prismadb vừa khởi tạo cho globalThis.prisma
 * *Nếu save file reload lại -> globalThis.prisma đã có giá trị trước đó, prismadb sẽ được gán bởi globalThis.prisma chứ không cần phải khởi tạo lại
 */

export default prismadb;
