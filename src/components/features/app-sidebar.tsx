"use client";

import * as React from "react";
import {
  BookOpen,
  LayoutDashboard,
  MessageSquare,
  Settings2,
  SquareStack,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { NavMain } from "@/components/features/nav-main";
import { NavProjects } from "@/components/features/nav-projects";
import { NavUser } from "@/components/features/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") return null;

  const user = {
    email: session?.user?.email || "No Email",
    avatar: "/default-avatar.png",
  };

  const navMain = [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      isActive: pathname === "/",
      items: [
        { title: "Tổng quan", url: "/dashboard" },
        { title: "Thống kê", url: "/statistics" },
      ],
    },
    {
      title: "Course",
      url: "/courses",
      icon: BookOpen,
      isActive: pathname.startsWith("/courses"),
      items: [
        { title: "Tất cả khóa học", url: "/courses" },
        { title: "Tạo khóa học", url: "/courses/create" },
      ],
    },
    {
      title: "Categories",
      url: "/categories",
      icon: SquareStack,
      isActive: pathname.startsWith("/categories"),
      items: [
        { title: "Tất cả danh mục", url: "/categories" },
      ],
    },
    {
      title: "Users",
      url: "/users",
      icon: Users,
      isActive: pathname.startsWith("/users"),
      items: [
        { title: "Tất cả user", url: "/users" },
      ],
    },
    {
      title: "Phản hồi",
      url: "/feedbacks",
      icon: MessageSquare,
      isActive: pathname.startsWith("/feedbacks"),
      items: [
        { title: "Tất cả phản hồi", url: "/feedbacks" },
      ],
    },
    {
      title: "Cài đặt",
      url: "/settings",
      icon: Settings2,
      isActive: pathname.startsWith("/settings"),
      items: [],
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex flex-row px-2 py-4">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground" />
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">LEARNARY PLATFORM</span>
          <span className="truncate text-xs">Quản Trị Viên</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={[]} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
