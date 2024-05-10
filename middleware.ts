//todo: middleware là nơi nhận allow req, sau đó cho phép hoặc không cho phép redirect route
import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";
import { NextResponse } from "next/server";

//todo: sử dụng authConfig cho middleware
export const { auth } = NextAuth(authConfig);

export default auth((req: any) => {
  //todo: req nhận vào là 1 req
  console.log("ROUTE nextUrl:", req.nextUrl);
  console.log("ROUTE url:", req.url);

  const isLoggedIn = !!req.auth; //* Ép về boolean
  console.log("isLoggoedIn", isLoggedIn);

  const isApiAuthRoute = req.nextUrl.pathname.startsWith(apiAuthPrefix); //* nếu bắt đầu tiền tố của req.nextUrl.pathname = /api/auth -> isApiAuthRoute=true
  console.log("isApiAuthRoute", isApiAuthRoute);

  const isAuthRoute = authRoutes.includes(req.nextUrl.pathname); //* Nếu req.nextUrl.pathname giống với giá trị trong mảng authROutes -> isAuthRoute=true
  console.log("isAuthRoute", isAuthRoute);

  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname); //* Nếu req.nextUrl.pathname giống với giá trị trong mảng publicRoute -> isAuthRoute=true
  console.log("isPublicRoute", isPublicRoute);

  if (isApiAuthRoute) {
    //todo: middleware khi load tại API
    return undefined; //* Nếu truy cập browser localhost:.../api/auth/... thì sẽ truy cập được, không bị block route
  }

  if (isAuthRoute) {
    //todo: middleware khi load tại login và register pages
    if (isLoggedIn) {
      //* Nếu truy cập /auth/login trong trạng thái đang đăng nhập, thì sẽ block không đi tới login page được mà thực hiện redirect tới public route /
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl));
    }
    return undefined; //* Nếu đang không đăng nhập thì không block
  }

  if (!isLoggedIn && !isPublicRoute) {
    //todo: middleware khi load tại những route khác public route và auth route mà chưa login

    // let callbackUrl = req.nextUrl.pathname; //* Để sau khi login redirect tới last route, ví dụ last route là /admin thì tại pathName của login route phải mang giá trị: /login?callbackUrl=%2Fadmin(giá trị route /admin được mã hoá), sau đó lấy giá trị callbackUrl gán vào reddirectTo của phương thức signIn() của @/auth.ts được sử dụng tại serverActions/login.
    // console.log("req.nextUrl.pathname middleware", req.nextUrl.pathname);
    // console.log("nextUrl.search middleware", req.nextUrl.search);
    // if (req.nextUrl.search) {
    //   callbackUrl += req.nextUrl.search;
    // }
    // const enCodeCallbackUrl = encodeURIComponent(callbackUrl); //* mã hoá pathName

    // return Response.redirect(
    //   new URL(`/auth/login?callbackUrl=${enCodeCallbackUrl}`, req.nextUrl) //* giá trị callbackUrl để redirectTo last route
    // );

    return Response.redirect(
      new URL(`/auth/login`, req.nextUrl) //* URL(url cho phép truy cập tới, nếu không cho phép nextUrl sẽ redirect tới), Nếu chưa đăng nhập thì chỉ tới được public route và auth route(bởi vì isAuthRoute đã thực thi và return undefined ở bên trên), truy cập vào những route khác thì sẽ bị redirect về /auth/login
    );
  }
});

// Optionally, don't invoke Middleware on some paths
// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    // Exclude files with a "." followed by an extension, which are typically static files.
    // Exclude files in the _next directory, which are Next.js internals.
    "/((?!.+\\.[\\w]+$|_next).*)",
    // Re-include any files in the api or trpc folders that might have an extension
    "/(api|trpc)(.*)",
  ], //* matcher của clerk: https://clerk.com/docs/quickstarts/nextjs?utm_source=sponsorship&utm_medium=youtube&utm_campaign=code-with-antonio&utm_content=12-31-2023
  //todo: Với matcher này thì sẽ gọi middleware everywhere
};

//todo: matcher: ["...jahdfhgas"] - có nhiều ng hiểu sai về nó, những thứ trong matcher nó không phải sử dụng để check xem public route hay private route, mà nó sử dụng để gọi middleware - some people have misconception about macher in middleware and dont understand exacly what it does, eveything put in here not to check it is a public route or private route, it simple use to invoke the middleware
/* 
Ví dụ: 
    export default auth((req) => {
        console.log('ROUTE:',req.nextUrl.pathname)
    });
  export const config = {matcher: ["/auth/login", "/auth/..."],}; //* matcher gọi tới auth((req)...) function ở trên 

todo: Nếu trên browser chạy tới trang login(/auth/login) thì console.log sẽ xuất hiện ROUTE: /auth/login bởi vì middleware được invole, còn những trang khác thì không có console.log bởi vì middleware is not invoke
  */
