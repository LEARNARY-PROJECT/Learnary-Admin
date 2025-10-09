"use client";
import React, { useState, useEffect } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus, RefreshCw, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { apiFetch } from '@/lib/api';
import { CreateCategoryForm } from "@/components/CreateCategoryForm";
import { ToasterConfirm } from "@/components/ToasterConfimer";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { SpinnerLoading } from "@/components/LoadingSpinner";
import { useAuthFetch } from "@/lib/authFetch";

export const UserChema = z.object({
  user_id: z.string(),
  email: z.string().email(),
  fullName: z.string(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  role: z.enum(["ADMIN", "INSTRUCTOR", "LEARNER"]),
  phone: z.union([z.string(), z.number()]).nullable(),
  avatar: z.string().url().nullable(),
  dateOfBirth: z.string().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  country: z.string().nullable(),
  nation: z.string().nullable(),
  bio: z.string().nullable(),
  last_login: z.string().nullable(),
  isActive: z.boolean(),
});
type User = z.infer<typeof UserChema>
const mockUsers = [
  {
    user_id: "usr-001",
    email: "admin@example.com",
    password: "hashed_password_1",
    fullName: "Nguyễn Văn A",
    gender: "MALE",
    role: "ADMIN",
    phone: "0901234567",
    avatar: "https://example.com/avatar1.jpg",
    dateOfBirth: "1990-05-10T00:00:00.000Z",
    address: "123 Nguyễn Trãi, Quận 1",
    city: "Hồ Chí Minh",
    country: "Việt Nam",
    nation: "Việt Nam",
    bio: "Quản trị viên hệ thống Learnary.",
    last_login: "2025-09-20T08:45:00.000Z",
    isActive: true,
  },
  {
    user_id: "usr-002",
    email: "instructor1@example.com",
    password: "hashed_password_2",
    fullName: "Trần Thị B",
    gender: "FEMALE",
    role: "INSTRUCTOR",
    phone: "0912345678",
    avatar: "https://example.com/avatar2.jpg",
    dateOfBirth: "1988-11-22T00:00:00.000Z",
    address: "45 Lê Lợi, Quận 3",
    city: "Hồ Chí Minh",
    country: "Việt Nam",
    nation: "Việt Nam",
    bio: "Giảng viên chuyên ngành lập trình web.",
    last_login: "2025-09-21T10:30:00.000Z",
    isActive: true,
  },
  {
    user_id: "usr-003",
    email: "learner1@example.com",
    password: "hashed_password_3",
    fullName: "Phạm Minh C",
    gender: "MALE",
    role: "LEARNER",
    phone: "0923456789",
    avatar: "https://example.com/avatar3.jpg",
    dateOfBirth: "2002-03-15T00:00:00.000Z",
    address: "78 Hai Bà Trưng, Quận 1",
    city: "Hà Nội",
    country: "Việt Nam",
    nation: "Việt Nam",
    bio: "Sinh viên năm 3 học công nghệ thông tin.",
    last_login: "2025-09-25T09:10:00.000Z",
    isActive: true,
  },
  {
    user_id: "usr-004",
    email: "learner2@example.com",
    password: "hashed_password_4",
    fullName: "Lê Thị D",
    gender: "FEMALE",
    role: "LEARNER",
    phone: "0934567890",
    avatar: "https://example.com/avatar4.jpg",
    dateOfBirth: "2000-08-05T00:00:00.000Z",
    address: "12 Lý Thường Kiệt, Quận Hải Châu",
    city: "Đà Nẵng",
    country: "Việt Nam",
    nation: "Việt Nam",
    bio: "Yêu thích học thiết kế UI/UX.",
    last_login: "2025-09-28T14:00:00.000Z",
    isActive: true,
  },
  {
    user_id: "usr-005",
    email: "instructor2@example.com",
    password: "hashed_password_5",
    fullName: "Đỗ Hoàng E",
    gender: "OTHER",
    role: "INSTRUCTOR",
    phone: "0945678901",
    avatar: "https://example.com/avatar5.jpg",
    dateOfBirth: "1995-09-01T00:00:00.000Z",
    address: "90 Nguyễn Huệ, Quận 1",
    city: "Hồ Chí Minh",
    country: "Việt Nam",
    nation: "Việt Nam",
    bio: "Giảng viên Machine Learning.",
    last_login: "2025-09-29T18:00:00.000Z",
    isActive: true,
  },
];
function UserPages() {
  //authentication user
  const { data: session, status } = useSession();
  const authFetch = useAuthFetch();

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  //states
  const [user, setUser] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const fetchUsers = async () => {
    try {
      if (status === "authenticated") {
        setLoading(true)
        setError(null)
        const res = await authFetch("/api/users", { method: "GET" });
        if (!res.ok) {
          throw new Error(`HTTP error! status:${res.status}`)
        }
        const apiData = await res.json()
        let parsedUsers: User[] = [];
        if (apiData.success && Array.isArray(apiData.data)) {
          parsedUsers = UserChema.array().parse(apiData.data)
          toast.info(`Đã tải lên ${apiData.data.length} người dùng`)
        } else if (Array.isArray(apiData)) {
          parsedUsers = UserChema.array().parse(apiData)
          toast.success(`Đã tải lên ${apiData.length} người dùng`)
        }
        else {
          throw new Error("Data from API is not formated")
        }
        setUser(parsedUsers);
      } else {
        SpinnerLoading({ title: "Đang xác thực người dùng", rightContent: "Bạn vui lòng đợi một tí nhé" })
      }

    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng", error)

      toast.error("Lỗi khi tra cứu danh sách người dùng, vui lòng thử lại")

      const parsedMockUserData = UserChema.array().parse(mockUsers)
      setUser(parsedMockUserData)
    } finally {
      setLoading(false)
    }
  }
  const handleDeleteUser = async (user_id: string) => {
    ToasterConfirm({
      title: "Xoá người dùng",
      description: "Hành động này không thể hoàn tác. Bạn chắc chắn muốn xoá người dùng này?",
      confirmText: "Xoá người dùng này",
      cancelText: "Huỷ",
      onConfirm: async () => {
        try {
          const res = await apiFetch(`/api/users/delete/${user_id}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${session?.accessToken}`,
            },
          })
          const apiData = await res.json()
          if (!res.ok || !apiData.success) throw new Error(apiData.message)

          setUser((prev) => prev.filter((c) => c.user_id !== user_id))
          toast.success("Đã xoá người dùng thành công")
        } catch (err) {
          console.log(err)
          toast.error("Không thể người dùng, vui lòng thử lại")
        }
      },
    })
  }
  const columns: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({ table }) => {
        <Checkbox checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        >
        </Checkbox>
      },
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        ></Checkbox>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "fullName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tên người dùng
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const user = row.original
        return (
          <>
            <div className="flex items-center justify-between w-full">
              <div className="space-y-1">
                <div className="font-medium">{user.fullName}</div>
              </div>
            </div>
          </>
        )
      }
    },
    {
      accessorKey: "role",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Vai trò
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center justify-between w-full">
            <div className="space-y-1">
              <div className="font-medium">{user.role}</div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(user.user_id)}
                >
                  Copy ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(user.user_id)}>
                  Xóa người dùng
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      }
    }
  ]
  const table = useReactTable({
    data: user,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-4 w-[60px]" />
        </div>
      ))}
    </div>
  )
  useEffect(() => {
    fetchUsers()
  }, [])
  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 justify-start w-full pb-2">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={fetchUsers}
                  disabled={loading}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Làm mới
                </Button>

                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button className="cursor-pointer">
                      <Plus className="mr-2 h-4 w-4" />
                      Thêm người dùng
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex justify-center pb-5">Tạo người dùng mới</DialogTitle>
                    </DialogHeader>
                    <CreateCategoryForm></CreateCategoryForm>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          <CardDescription className="pl-2">
            {loading ? "Đang tải..." : `Tổng cộng ${user.length} người dùng trong hệ thống`}
            {error && (
              <span className="text-red-500 ml-2">({error})</span>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center py-4">
            <div className="flex w-full justify-start gap-5">
              <CardTitle>Danh sách người dùng</CardTitle>
              <Input
                placeholder="Tìm kiếm người dùng ..."
                value={(table.getColumn("fullName")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("fullName")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto cursor-pointer">
                  Cột hiển thị <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border">
            {loading ? (
              <div className="p-4">
                <LoadingSkeleton />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        {error ? "Không thể tải dữ liệu" : "Không có người dùng nào"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
          {!loading && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} trong{" "}
                {table.getFilteredRowModel().rows.length} hàng được chọn.
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default UserPages
