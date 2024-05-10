import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth(); //* api route nằm tại server nên sử dụng được mọi thứ tại server

  if (session?.user.role !== UserRole.ADMIN) {
    //* protected admin data
    return new NextResponse("Forbidden", { status: 304 });
  }

  return new NextResponse("Allowed", { status: 200 });
}
