//todo: Định nghĩa các routes, which we allow loged out users to vist

//todo: JS document
/**
 * An array of routes that are accessible to the public - Là 1 mảng chứa các routes, chúng có thể được truy cập công khai.
 * These routes don't require authentication - Các routes này không cần phải xác thực người dùng.
 * @type {string[]}
 */
//todo: publicRoute: Khi logIn hay logOut đều truy cập được
export const publicRoutes = ["/", "/auth/newVerificationToken"]; //* Define những routes không cần đăng nhập vẫn có thể truy cập
//* /auth/newVerificationToken có thể đặt tại publicRoutes, Bởi vì khi register, email được gửi tới, lúc này user chưa login nhưng cần truy cập vào route newVerificationToken
//* because the user can be able to change their email in the setting page. Nếu user có thể change email tại setting page, nghĩa là user đã được logIn

/**
 * An array of routes that are used for authentication - Là 1 mảng chứa các routes, những route này để xác thực email.
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
//todo: authRoute: chỉ khi logOut mới truy cập
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/forgotPassword",
  "/auth/newResetPasswordToken",
]; //* Define những routes cần đăng nhập mới được truy cập
//* /auth/newVerificationToken có thể được đặt tại authRoutes

/**
 * The prefix for API authentication routes - Tiền tố cho xác thực API.
 * Routes that start with this prefix are used for API authentication purposes - Các routes bắt đầu bằng tiền tố này được sử dụng cho mục đích xác thực API.
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth"; //* Đại diện cho folder api/auth - bởi vì trong folder này cho phép use log in hay log out nên, nó cần phải được block và xác thực

/**
 * The default redirect path after loggging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings"; //* the default route to redirect after logged in
