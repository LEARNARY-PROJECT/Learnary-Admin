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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus, RefreshCw } from "lucide-react"
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
import { CreateCategoryForm } from "@/components/CreateCategoryForm";
import { ToasterConfirm } from "@/components/ToasterConfimer";
import { useSession } from "next-auth/react";
import { useAuthFetch } from "@/lib/authFetch";
type Category = {
  category_id: string,
  category_name: string,
  slug: string,
  createdAt: string,
  updatedAt: string,
}
const mockData: Category[] = [
  {
    category_id: "cat-001",
    category_name: "Lập trình Web",
    slug: "lap-trinh-web",
    createdAt: "2025-01-05T10:00:00.000Z",
    updatedAt: "2025-01-05T10:00:00.000Z",
  },
  {
    category_id: "cat-002",
    category_name: "Phát triển Mobile",
    slug: "phat-trien-mobile",
    createdAt: "2025-01-07T12:30:00.000Z",
    updatedAt: "2025-01-07T12:30:00.000Z",
  },
  {
    category_id: "cat-003",
    category_name: "Trí tuệ nhân tạo",
    slug: "tri-tue-nhan-tao",
    createdAt: "2025-02-01T08:45:00.000Z",
    updatedAt: "2025-02-01T08:45:00.000Z",
  },
  {
    category_id: "cat-004",
    category_name: "Phân tích dữ liệu",
    slug: "phan-tich-du-lieu",
    createdAt: "2025-02-10T09:15:00.000Z",
    updatedAt: "2025-02-10T09:15:00.000Z",
  },
  {
    category_id: "cat-005",
    category_name: "Machine Learning",
    slug: "machine-learning",
    createdAt: "2025-02-20T14:20:00.000Z",
    updatedAt: "2025-02-20T14:20:00.000Z",
  },
  {
    category_id: "cat-006",
    category_name: "Thiết kế UI/UX",
    slug: "thiet-ke-ui-ux",
    createdAt: "2025-03-02T11:00:00.000Z",
    updatedAt: "2025-03-02T11:00:00.000Z",
  },
  {
    category_id: "cat-007",
    category_name: "Lập trình Backend",
    slug: "lap-trinh-backend",
    createdAt: "2025-03-10T13:10:00.000Z",
    updatedAt: "2025-03-10T13:10:00.000Z",
  },
  {
    category_id: "cat-008",
    category_name: "Cloud Computing",
    slug: "cloud-computing",
    createdAt: "2025-03-22T09:30:00.000Z",
    updatedAt: "2025-03-22T09:30:00.000Z",
  },
  {
    category_id: "cat-009",
    category_name: "An ninh mạng",
    slug: "an-ninh-mang",
    createdAt: "2025-04-01T10:50:00.000Z",
    updatedAt: "2025-04-01T10:50:00.000Z",
  },
  {
    category_id: "cat-010",
    category_name: "Khoa học máy tính",
    slug: "khoa-hoc-may-tinh",
    createdAt: "2025-04-10T15:00:00.000Z",
    updatedAt: "2025-04-10T15:00:00.000Z",
  },
]

function CategoriesPage() {
  //authentication user
  const { data: session, status } = useSession();
  const authFetch = useAuthFetch()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  //state
  const [category, setCategory] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const fetchCategories = async () => {
    try {
      if (status === "authenticated") {
        setLoading(true)
        setError(null)
        const res = await authFetch("/api/categories", {
          method: "GET",
        })
        if (!res.ok) {
          throw new Error(`HTTP error! status:${res.status}`)
        }
        const apiData = await res.json()
        if (apiData.success && Array.isArray(apiData.data)) {
          setCategory(apiData.data)
          toast.info(`Đã tải lên ${apiData.data.length} khoá học`)
        } else if (Array.isArray(apiData)) {
          setCategory(apiData)
          toast.success(`Đã tải lên ${apiData.length} khoá học`)
        }
        else {
          throw new Error("Data from API is not formated")
        }
      } else {
        toast.error(`Không tìm được user đang đăng nhập`)
        throw new Error("User is not authenticated")
      }

    } catch (error) {
      console.error("Lỗi khi tải danh sách danh mục", error)

      toast.error("Lỗi khi tra cứu danh sách danh mục, vui lòng thử lại")
      setCategory(mockData)
    } finally {
      setLoading(false)
    }
  }
  const handleDeleteCategories = async (category_id: string) => {
    ToasterConfirm({
      title: "Xoá danh mục",
      description: "Hành động này không thể hoàn tác. Bạn chắc chắn muốn xoá danh mục này?",
      confirmText: "Xoá danh mục này",
      cancelText: "Huỷ",
      onConfirm: async () => {
        try {
          const res = await authFetch(`/api/categories/delete/${category_id}`, {
            method: "DELETE",
          })
          const apiData = await res.json()
          if (!res.ok || !apiData.success) throw new Error(apiData.message)

          setCategory((prev) => prev.filter((c) => c.category_id !== category_id))
          toast.success("Đã xoá danh mục thành công")
        } catch (err) {
          console.log(err)
          toast.error("Không thể xoá danh mục, vui lòng thử lại")
        }
      },
    })
  }
  const columns: ColumnDef<Category>[] = [
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
      accessorKey: "category_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tên danh mục
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const category = row.original
        return (
          <>
            <div className="flex items-center justify-between w-full">
              <div className="space-y-1">
                <div className="font-medium">{category.category_name}</div>
              </div>
            </div>
          </>
        )
      }
    },
    {
      accessorKey: "slug",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Slug
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const category = row.original
        return (
          <div className="flex items-center justify-between w-full">
            <div className="space-y-1">
              <div className="font-medium">{category.slug}</div>
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
                  onClick={() => navigator.clipboard.writeText(category.category_id)}
                >
                  Copy ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteCategories(category.category_id)}>
                  Xóa danh mục
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      }
    }
  ]
  const table = useReactTable({
    data: category,
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
    if(status === "authenticated") {
      fetchCategories()
    }
  }, [status])
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
                  onClick={fetchCategories}
                  disabled={loading}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Làm mới
                </Button>

                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button className="cursor-pointer">
                      <Plus className="mr-2 h-4 w-4" />
                      Thêm danh mục
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex justify-center pb-5">Tạo danh mục mới</DialogTitle>
                    </DialogHeader>
                    <CreateCategoryForm></CreateCategoryForm>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          <CardDescription className="pl-2">
            {loading ? "Đang tải..." : `Tổng cộng ${category.length} khóa học trong hệ thống`}
            {error && (
              <span className="text-red-500 ml-2">({error})</span>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center py-4">
            <div className="flex w-full justify-start gap-5">
              <CardTitle>Danh sách danh mục</CardTitle>
              <Input
                placeholder="Tìm kiếm danh mục ..."
                value={(table.getColumn("category_name")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("category_name")?.setFilterValue(event.target.value)
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
                        {error ? "Không thể tải dữ liệu" : "Không có danh mục nào"}
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

export default CategoriesPage
