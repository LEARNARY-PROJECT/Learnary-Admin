import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Cho phép truy cập /login mà không cần đăng nhập
    if (pathname === "/login") {
        return NextResponse.next();
    }

    // ✅ Bắt buộc truyền secret rõ ràng vào đây
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET, // hoặc truyền trực tiếp nếu cần
    });
    console.log("Token in middleware:", token); // Log token để kiểm tra

    // Kiểm tra role trong token
    if (!token || token.role !== "ADMIN") {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next|favicon.ico).*)"],
};

