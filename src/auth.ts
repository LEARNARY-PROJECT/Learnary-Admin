import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { jwtDecode } from "jwt-decode";
import { signInSchema } from "./lib/zod";
import { User as DefaultUser } from "next-auth";

interface DecodedToken {
    id: string;
    email: string;
    role: string;
}

interface ExtendedUser extends DefaultUser {
    id: string;
    role?: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const { email, password } = await signInSchema.parseAsync({
                    email: credentials?.email ?? "",
                    password: credentials?.password ?? "",
                });

                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email, password }),
                    });

                    if (!response.ok) return null;

                    const data = await response.json();
                    console.log("User logged in:", data);

                    const decodedToken: DecodedToken = jwtDecode(data.token);

                    const user: ExtendedUser = {
                        id: decodedToken.id,
                        email: decodedToken.email,
                        role: decodedToken.role,
                    };

                    return user;

                } catch (error) {
                    console.error("Xuất hiện lỗi trong quá trình đăng nhập:", error);
                    throw new CredentialsSignin("Sai tài khoản hoặc mật khẩu");
                }
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = (user as ExtendedUser).id;
                token.email = user.email;
                token.role = (user as ExtendedUser).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                (session.user as ExtendedUser).role = token.role as string;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith(baseUrl)) {
                return url;
            }
            return baseUrl;
        },
    },
});
