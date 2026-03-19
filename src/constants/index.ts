import type { Category } from "../types";

// Danh sách các danh mục mặc định của ứng dụng
export const CATEGORIES_LIST: Category[] = [
  { id: "ca-nhan", name: "Cá nhân" },
  { id: "cong-ty", name: "Công ty" },
  { id: "du-lich", name: "Du lịch" },
  { id: "y-tuong", name: "Ý tưởng" },
];

// Các tùy chọn lọc chính ở Sidebar
export const SIDEBAR_FILTER_OPTIONS = [
  { title: "All", value: "All", icon: "Inbox" },
  { title: "Important", value: "Important", icon: "Flag" },
  { title: "Completed", value: "Completed", icon: "CheckBox" },
  { title: "Deleted", value: "Deleted", icon: "Delete" },
] as const;
