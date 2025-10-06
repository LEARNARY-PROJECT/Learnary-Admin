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
import { toast } from "react-hot-toast"

type Course = {
  courses_id: string;
  category_id: string;
  level_id: string;
  instructor_id: string;
  status: "Draft" | "Published" | "Archived";
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  price: number;
  sale_off: boolean;
  hot: boolean;
  tag: boolean;
  requirement: string;
  available_language: "Vietnamese" | "English";
  created_at: string;
  updated_at: string;
}

const data: Course[] = [
  {
    courses_id: "course_001",
    category_id: "cat_001",
    level_id: "level_001",
    instructor_id: "inst_001",
    status: "Published",
    title: "React Fundamentals",
    slug: "react-fundamentals",
    description: "Học React từ cơ bản đến nâng cao với các dự án thực tế",
    thumbnail: "/images/react-course.jpg",
    price: 299000,
    sale_off: true,
    hot: true,
    tag: false,
    requirement: "Có kiến thức cơ bản về HTML, CSS và JavaScript",
    available_language: "Vietnamese",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-20T15:30:00Z",
  },
  {
    courses_id: "course_002",
    category_id: "cat_001",
    level_id: "level_002",
    instructor_id: "inst_002",
    status: "Published",
    title: "JavaScript ES6+",
    slug: "javascript-es6-plus",
    description: "Các tính năng mới của JavaScript ES6+ và hiện đại",
    thumbnail: "/images/js-course.jpg",
    price: 199000,
    sale_off: false,
    hot: false,
    tag: true,
    requirement: "Có kiến thức cơ bản về JavaScript",
    available_language: "Vietnamese",
    created_at: "2024-01-20T09:00:00Z",
    updated_at: "2024-01-25T14:20:00Z",
  },
  {
    courses_id: "course_003",
    category_id: "cat_002",
    level_id: "level_003",
    instructor_id: "inst_003",
    status: "Draft",
    title: "Node.js Backend Development",
    slug: "nodejs-backend-development",
    description: "Xây dựng API và backend với Node.js, Express, MongoDB",
    thumbnail: "/images/nodejs-course.jpg",
    price: 399000,
    sale_off: false,
    hot: false,
    tag: false,
    requirement: "Có kiến thức về JavaScript và cơ sở dữ liệu",
    available_language: "English",
    created_at: "2024-02-01T11:00:00Z",
    updated_at: "2024-02-01T11:00:00Z",
  },
  {
    courses_id: "course_004",
    category_id: "cat_001",
    level_id: "level_003",
    instructor_id: "inst_004",
    status: "Archived",
    title: "TypeScript Advanced",
    slug: "typescript-advanced",
    description: "TypeScript cho dự án lớn và enterprise",
    thumbnail: "/images/typescript-course.jpg",
    price: 349000,
    sale_off: true,
    hot: false,
    tag: true,
    requirement: "Có kinh nghiệm với JavaScript và TypeScript cơ bản",
    available_language: "Vietnamese",
    created_at: "2024-01-10T08:00:00Z",
    updated_at: "2024-01-15T16:45:00Z",
  },
  {
    courses_id: "course_005",
    category_id: "cat_003",
    level_id: "level_002",
    instructor_id: "inst_005",
    status: "Published",
    title: "Vue.js Complete Guide",
    slug: "vuejs-complete-guide",
    description: "Học Vue.js toàn diện từ cơ bản đến nâng cao",
    thumbnail: "/images/vuejs-course.jpg",
    price: 279000,
    sale_off: false,
    hot: true,
    tag: false,
    requirement: "Có kiến thức cơ bản về HTML, CSS và JavaScript",
    available_language: "Vietnamese",
    created_at: "2024-02-05T13:00:00Z",
    updated_at: "2024-02-10T10:15:00Z",
  },
  {
    courses_id: "course_006",
    category_id: "cat_004",
    level_id: "level_001",
    instructor_id: "inst_006",
    status: "Published",
    title: "Python for Beginners",
    slug: "python-for-beginners",
    description: "Học Python từ cơ bản đến nâng cao với các dự án thực tế",
    thumbnail: "/images/python-course.jpg",
    price: 249000,
    sale_off: true,
    hot: false,
    tag: true,
    requirement: "Không cần kinh nghiệm lập trình",
    available_language: "Vietnamese",
    created_at: "2024-02-12T09:00:00Z",
    updated_at: "2024-02-15T14:30:00Z",
  },
  {
    courses_id: "course_007",
    category_id: "cat_002",
    level_id: "level_003",
    instructor_id: "inst_007",
    status: "Published",
    title: "Docker & Kubernetes",
    slug: "docker-kubernetes",
    description: "Containerization và orchestration với Docker và Kubernetes",
    thumbnail: "/images/docker-course.jpg",
    price: 449000,
    sale_off: false,
    hot: true,
    tag: false,
    requirement: "Có kiến thức cơ bản về Linux và command line",
    available_language: "English",
    created_at: "2024-02-18T11:00:00Z",
    updated_at: "2024-02-20T16:45:00Z",
  },
  {
    courses_id: "course_008",
    category_id: "cat_005",
    level_id: "level_002",
    instructor_id: "inst_008",
    status: "Draft",
    title: "Mobile App Development",
    slug: "mobile-app-development",
    description: "Phát triển ứng dụng mobile với React Native",
    thumbnail: "/images/mobile-course.jpg",
    price: 379000,
    sale_off: false,
    hot: false,
    tag: true,
    requirement: "Có kiến thức về React và JavaScript",
    available_language: "Vietnamese",
    created_at: "2024-02-25T10:00:00Z",
    updated_at: "2024-02-25T10:00:00Z",
  },
  {
    courses_id: "course_009",
    category_id: "cat_001",
    level_id: "level_003",
    instructor_id: "inst_009",
    status: "Published",
    title: "GraphQL API Development",
    slug: "graphql-api-development",
    description: "Xây dựng API hiện đại với GraphQL và Apollo Server",
    thumbnail: "/images/graphql-course.jpg",
    price: 329000,
    sale_off: true,
    hot: false,
    tag: false,
    requirement: "Có kinh nghiệm với Node.js và JavaScript",
    available_language: "English",
    created_at: "2024-03-01T08:00:00Z",
    updated_at: "2024-03-05T12:20:00Z",
  },
  {
    courses_id: "course_010",
    category_id: "cat_006",
    level_id: "level_001",
    instructor_id: "inst_010",
    status: "Published",
    title: "UI/UX Design Fundamentals",
    slug: "ui-ux-design-fundamentals",
    description: "Nguyên tắc thiết kế UI/UX và sử dụng Figma",
    thumbnail: "/images/design-course.jpg",
    price: 199000,
    sale_off: false,
    hot: true,
    tag: true,
    requirement: "Không cần kinh nghiệm thiết kế",
    available_language: "Vietnamese",
    created_at: "2024-03-08T14:00:00Z",
    updated_at: "2024-03-10T09:15:00Z",
  },
  {
    courses_id: "course_011",
    category_id: "cat_007",
    level_id: "level_002",
    instructor_id: "inst_011",
    status: "Archived",
    title: "Blockchain Development",
    slug: "blockchain-development",
    description: "Phát triển ứng dụng blockchain với Solidity",
    thumbnail: "/images/blockchain-course.jpg",
    price: 599000,
    sale_off: false,
    hot: false,
    tag: false,
    requirement: "Có kiến thức về JavaScript và cơ bản về blockchain",
    available_language: "English",
    created_at: "2024-03-15T16:00:00Z",
    updated_at: "2024-03-20T11:30:00Z",
  },
  {
    courses_id: "course_012",
    category_id: "cat_004",
    level_id: "level_003",
    instructor_id: "inst_012",
    status: "Published",
    title: "Machine Learning với Python",
    slug: "machine-learning-python",
    description: "Học machine learning và AI với Python, TensorFlow",
    thumbnail: "/images/ml-course.jpg",
    price: 499000,
    sale_off: true,
    hot: true,
    tag: true,
    requirement: "Có kiến thức về Python và toán học cơ bản",
    available_language: "Vietnamese",
    created_at: "2024-03-22T13:00:00Z",
    updated_at: "2024-03-25T15:45:00Z",
  },
  {
    courses_id: "course_013",
    category_id: "cat_008",
    level_id: "level_001",
    instructor_id: "inst_013",
    status: "Draft",
    title: "Cybersecurity Basics",
    slug: "cybersecurity-basics",
    description: "Kiến thức cơ bản về bảo mật thông tin và ethical hacking",
    thumbnail: "/images/security-course.jpg",
    price: 299000,
    sale_off: false,
    hot: false,
    tag: false,
    requirement: "Có kiến thức cơ bản về mạng máy tính",
    available_language: "Vietnamese",
    created_at: "2024-03-28T10:00:00Z",
    updated_at: "2024-03-28T10:00:00Z",
  },
  {
    courses_id: "course_014",
    category_id: "cat_002",
    level_id: "level_002",
    instructor_id: "inst_014",
    status: "Published",
    title: "AWS Cloud Computing",
    slug: "aws-cloud-computing",
    description: "Học AWS và cloud computing từ cơ bản đến nâng cao",
    thumbnail: "/images/aws-course.jpg",
    price: 399000,
    sale_off: false,
    hot: true,
    tag: true,
    requirement: "Có kiến thức cơ bản về hệ thống và mạng",
    available_language: "English",
    created_at: "2024-04-01T09:00:00Z",
    updated_at: "2024-04-05T14:20:00Z",
  },
  {
    courses_id: "course_015",
    category_id: "cat_009",
    level_id: "level_001",
    instructor_id: "inst_015",
    status: "Published",
    title: "Digital Marketing",
    slug: "digital-marketing",
    description: "Chiến lược marketing số và quảng cáo online",
    thumbnail: "/images/marketing-course.jpg",
    price: 179000,
    sale_off: true,
    hot: false,
    tag: false,
    requirement: "Không cần kinh nghiệm marketing",
    available_language: "Vietnamese",
    created_at: "2024-04-08T11:00:00Z",
    updated_at: "2024-04-12T16:30:00Z",
  },
]

// Định nghĩa columns cho table
const columns: ColumnDef<Course>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tên khóa học
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const course = row.original
      return (
        <div className="space-y-1">
          <div className="font-medium">{row.getValue("title")}</div>
          <div className="text-xs text-muted-foreground">{course.slug}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "instructor_id",
    header: "Giảng viên",
    cell: ({ row }) => {
      const instructorId = row.getValue("instructor_id") as string
      // Trong thực tế, bạn sẽ fetch thông tin instructor từ API
      const instructorNames: { [key: string]: string } = {
        "inst_001": "Nguyễn Văn A",
        "inst_002": "Trần Thị B",
        "inst_003": "Lê Văn C",
        "inst_004": "Phạm Thị D",
        "inst_005": "Hoàng Văn E"
      }
      return <div>{instructorNames[instructorId] || instructorId}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const statusColors = {
        Published: "bg-green-100 text-green-800",
        Archived: "bg-red-100 text-red-800",
        Draft: "bg-yellow-100 text-yellow-800"
      }
      const statusLabels = {
        Published: "Đã xuất bản",
        Archived: "Đã lưu trữ",
        Draft: "Bản nháp"
      }

      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors]}`}>
          {statusLabels[status as keyof typeof statusLabels]}
        </span>
      )
    },
  },
  {
    accessorKey: "available_language",
    header: "Ngôn ngữ",
    cell: ({ row }) => {
      const language = row.getValue("available_language") as string
      const languageLabels = {
        Vietnamese: "Tiếng Việt",
        English: "Tiếng Anh"
      }
      return <div>{languageLabels[language as keyof typeof languageLabels]}</div>
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Giá
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const course = row.original
      const price = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price)

      return (
        <div className="text-right space-y-1">
          <div className="font-medium">{formatted}</div>
          {course.sale_off && (
            <div className="text-xs text-green-600 font-medium">Đang giảm giá</div>
          )}
        </div>
      )
    },
  },
  {
    id: "badges",
    header: "Nhãn",
    cell: ({ row }) => {
      const course = row.original
      return (
        <div className="flex gap-1 flex-wrap">
          {course.hot && (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
              Hot
            </span>
          )}
          {course.tag && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Tag
            </span>
          )}
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const course = row.original

      return (
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
              onClick={() => navigator.clipboard.writeText(course.courses_id)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
            <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Xóa khóa học
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

function CoursePage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  // State 
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}`
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const apiData = await response.json()
      if (apiData.success && Array.isArray(apiData.data)) {
        setCourses(apiData.data)
        toast.success(`Đã tải ${apiData.data.length} khóa học`)
      } else if (Array.isArray(apiData)) {
        setCourses(apiData)
        toast.success(`Đã tải ${apiData.length} khóa học`)
      } else {
        throw new Error("Dữ liệu API không đúng định dạng")
      }
    } catch (error) {
      console.error("Lỗi khi fetch courses:", error)
      setError(error instanceof Error ? error.message : "Có lỗi xảy ra")
      console.log("Sử dụng mock data...")
      setCourses(data)
      toast("Đang sử dụng dữ liệu mẫu", { icon: "ℹ️" })
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchCourses()
  }, [])

  const table = useReactTable({
    data: courses,
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

  // Loading skeleton component
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 justify-start w-full pb-2">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={fetchCourses}
                  disabled={loading}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Làm mới
                </Button>
                <Button className="cursor-pointer">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm khóa học
                </Button>
              </div>
            </div>
          </div>
          <CardDescription className="pl-2">
            {loading ? "Đang tải..." : `Tổng cộng ${courses.length} khóa học trong hệ thống`}
            {error && (
              <span className="text-red-500 ml-2">({error})</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <div className="flex w-full justify-start gap-5">
              <CardTitle>Danh sách khoá học</CardTitle>
              <Input
                placeholder="Tìm kiếm khóa học..."
                value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("title")?.setFilterValue(event.target.value)
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
                        {error ? "Không thể tải dữ liệu" : "Không có khóa học nào"}
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
  );
}

export default CoursePage;
