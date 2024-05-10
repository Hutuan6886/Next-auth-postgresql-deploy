"use server";

import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

export const adminRole = async () => {
    const session = await auth() //* server action nằm tại server nên sử dụng được mọi thứ tại server

    if(session?.user.role !== UserRole.ADMIN){      //* protected admin data
        return {error:'Forbidden'}
    }

    return {success:'Allowed'}
};
