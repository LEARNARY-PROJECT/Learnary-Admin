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
    accessToken?: string;
}
declare module "next-auth" {
    interface Session {
        accessToken?: string;
        user: {
            id: string;
            email?: string | null;
            name?: string | null;
            image?: string | null;
            role?: string;
        }
    }
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

                /*      if (process.env.NEXT_PUBLIC_DEV_MODE === "true") {
                         // Tài khoản mock
                         if (email === "admin@learnary.com" && password === "admin123") {
                             const user: ExtendedUser = {
                                 id: "1",
                                 email: "admin@learnary.com",
                                 role: "ADMIN",
                             };
                             console.log("Development mode: Mock user logged in:", user);
                             return user;
                         }
                         
                         throw new CredentialsSignin("Sai tài khoản hoặc mật khẩu");
                     } */

                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email, password }),
                    });
                    if (!response.ok) return null;
                    console.log("data:", response);
                    const data = await response.json();

                    if (data && data.token) {
                        const decodedToken: DecodedToken = jwtDecode(data.token);
                        const user: ExtendedUser = {
                            id: decodedToken.id,
                            email: decodedToken.email,
                            role: decodedToken.role,
                            accessToken: data.token,
                        };
                        /*      console.log("user data:", user); */
                        return {
                            ...user,
                            accessToken: data.token,
                        };
                    } else {
                        throw new CredentialsSignin("Sai tài khoản hoặc mật khẩu");
                    }
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
                const u = user as ExtendedUser;
                token.id = u.id;
                token.email = u.email;
                token.role = u.role;
                token.accessToken = u.accessToken;
            }
            return token;
        },
        async session({ session, token }) {
        session.accessToken = token.accessToken as string;
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
    /*  cookies: {
         sessionToken: {
             name: `__Secure-next-auth.session-token`,
             options: {
                 httpOnly: true,
                 sameSite: 'lax',
                 path: '/',
                 secure: process.env.NODE_ENV === 'production'
             }
         },
         callbackUrl: {
             name: `__Secure-next-auth.callback-url`,
             options: {
                 sameSite: 'lax',
                 path: '/',
                 secure: process.env.NODE_ENV === 'production'
             }
         },
         csrfToken: {
             name: `__Host-next-auth.csrf-token`,
             options: {
                 httpOnly: true,
                 sameSite: 'lax',
                 path: '/',
                 secure: process.env.NODE_ENV === 'production'
             }
         }
     }, */
});
