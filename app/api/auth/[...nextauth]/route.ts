export { GET, POST } from "@/auth";     //* @/auth là file cấu hình next-auth
export const runtime = "nodejs" // optional, sử dụng prisma làm default thì không cần edge
//todo: (Lúc trước chứa các API Route (pages/api/auth/[...nextauth].ts), hiện tại thì a 1-line handler for GET and POST requests for those paths.)
