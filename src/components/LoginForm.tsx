"use client"

import { signIn } from "next-auth/react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import Link from "next/link"

export default function LoginForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.target as HTMLFormElement);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const result = await signIn("credentials", {
                email,
                password,
                callbackUrl: "/",
                redirect: false,
            });

            if (result?.error) {
                toast.error("Tài khoản hoặc mật khẩu không đúng !"); // ✅ Hiển thị lỗi từ API bằng toast
            } else {
                console.log("result", result);
                toast.success("Đăng nhập thành công! 🎉");
                router.push(result?.url || "/");
            }
        } catch {
            toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Đăng nhập</CardTitle>
                    <CardDescription>
                        Nhập email và mật khẩu để đăng nhập tài khoản quản trị.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Mật khẩu</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full">
                                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                            </Button>
                        </div>

                        <div className="mt-4 text-center text-sm">
                            Chưa có tài khoản?{" "}
                            <Link href="#" className="underline underline-offset-4">
                                Đăng ký
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
