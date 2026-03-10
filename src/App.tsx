import { useState } from "react";
import {
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Typography,
  InputBase,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InboxIcon from "@mui/icons-material/Inbox";
import FlagIcon from "@mui/icons-material/Flag";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";

// Cấu hình giao diện (Theme) cho Material UI
const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f3f4f6", // Màu nền xám nhạt hiện đại
    },
    primary: {
      main: "#0a497b",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        },
      },
    },
  },
});

export default function App() {
  // Trạng thái (state) lưu danh sách công việc
  const [tasks, setTasks] = useState([
    {
      id: 1,
      text: "Du lịch USA",
      important: false,
      completed: false,
      deleted: false,
      categoryId: "du-lich",
    },
    {
      id: 2,
      text: "Du lịch Nhật Bản",
      important: true,
      completed: false,
      deleted: false,
      categoryId: "du-lich",
    },
    {
      id: 3,
      text: "Test",
      important: true,
      completed: false,
      deleted: false,
      categoryId: "y-tuong",
    },
    {
      id: 4,
      text: "Ăn tối ",
      important: false,
      completed: false,
      deleted: false,
      categoryId: "cong-ty",
    },
    {
      id: 5,
      text: "Đạp xe",
      important: false,
      completed: false,
      deleted: false,
      categoryId: "ca-nhan",
    },
  ]);

  // Trạng thái nhập công việc mới
  const [newTaskText, setNewTaskText] = useState("");
  // Trạng thái tìm kiếm
  const [searchQuery, setSearchQuery] = useState("");
  // Trạng thái bộ lọc hiện tại (VD: 'All', 'Important', 'Completed', 'Deleted' hoặc id của danh mục)
  const [currentFilter, setCurrentFilter] = useState({
    type: "CARD",
    value: "All",
  });

  // Danh mục (Categories)
  const categoriesList = [
    { id: "ca-nhan", name: "Cá nhân" },
    { id: "cong-ty", name: "Công ty" },
    { id: "du-lich", name: "Du lịch" },
    { id: "y-tuong", name: "Ý tưởng" },
  ];

  // =====================
  // CÁC HÀM XỬ LÝ LOGIC
  // =====================

  // Hàm thêm công việc mới
  const handleAddTask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTaskText.trim() !== "") {
      const newTask = {
        id: Date.now(),
        text: newTaskText.trim(),
        important: currentFilter.value === "Important", // Nếu đang ở tab Important, đánh dấu là quan trọng luôn
        completed: false,
        deleted: false,
        categoryId:
          currentFilter.type === "CATEGORY" ? currentFilter.value : "ca-nhan", // Mặc định vào Cá nhân nếu không chọn danh mục
      };
      setTasks([...tasks, newTask]);
      setNewTaskText(""); // Xóa trắng ô nhập
    }
  };

  // Hàm chuyển trạng thái Hoàn thành / Chưa hoàn thành
  const handleToggleComplete = (taskId: number) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    );
  };

  // Hàm chuyển trạng thái Quan trọng / Bình thường
  const handleToggleImportant = (taskId: number) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId ? { ...t, important: !t.important } : t
      )
    );
  };

  // Hàm xóa (chuyển vào thùng rác)
  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, deleted: true } : t)));
  };

  // =====================
  // TÍNH TOÁN DỮ LIỆU HIỂN THỊ
  // =====================

  // Tính số lượng cho từng thẻ (Card)
  const countAll = tasks.filter((t) => !t.deleted).length;
  const countImportant = tasks.filter((t) => t.important && !t.deleted).length;
  const countCompleted = tasks.filter((t) => t.completed && !t.deleted).length;
  const countDeleted = tasks.filter((t) => t.deleted).length;

  // Tiêu đề của danh sách hiện tại (All, Important,...)
  const getListHeader = () => {
    if (currentFilter.type === "CARD") return currentFilter.value;
    const cat = categoriesList.find((c) => c.id === currentFilter.value);
    return cat ? cat.name : "All";
  };

  // Lọc ra danh sách công việc phù hợp với tìm kiếm và bộ lọc (Filter)
  const filteredTasks = tasks.filter((task) => {
    // 1. Áp dụng tìm kiếm
    if (
      searchQuery &&
      !task.text.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // 2. Áp dụng bộ lọc thẻ/danh mục
    if (currentFilter.type === "CARD") {
      switch (currentFilter.value) {
        case "All":
          return !task.deleted;
        case "Important":
          return task.important && !task.deleted;
        case "Completed":
          return task.completed && !task.deleted;
        case "Deleted":
          return task.deleted; // Chỉ hiện task trong thùng rác
        default:
          return true;
      }
    } else if (currentFilter.type === "CATEGORY") {
      // Bộ lọc theo danh mục
      return task.categoryId === currentFilter.value && !task.deleted;
    }

    return true;
  });

  // Cấu hình các thẻ trạng thái
  const cards = [
    {
      title: "All",
      value: "All",
      count: countAll,
      icon: <InboxIcon />,
      bg: "#0b5286",
      color: "#ffffff",
      iconColor: "#ffffff",
    },
    {
      title: "Important",
      value: "Important",
      count: countImportant,
      icon: <FlagIcon />,
      bg: "#e5e7eb",
      color: "#1f2937",
      iconColor: "#f59e0b",
    },
    {
      title: "Completed",
      value: "Completed",
      count: countCompleted,
      icon: <CheckBoxIcon />,
      bg: "#e5e7eb",
      color: "#1f2937",
      iconColor: "#10b981",
    },
    {
      title: "Deleted",
      value: "Deleted",
      count: countDeleted,
      icon: <DeleteIcon />,
      bg: "#e5e7eb",
      color: "#1f2937",
      iconColor: "#ef4444",
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          bgcolor: "#f3f4f6", // Đảm bảo toàn bộ không gian trống có màu đồng nhất
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* Cột trái (Sidebar) */}
          <Box
            sx={{
              width: { xs: "100%", md: 320, lg: 350 },
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              bgcolor: "#f8f9fa", // Màu nền xám/trắng nhạt bên trái (Filter)
              p: { xs: 3, md: 4, lg: 5 },
              borderRight: "1px solid #e5e7eb",
            }}
          >
            {/* Ô Tìm kiếm */}
            <Paper
              sx={{
                p: "4px 8px",
                display: "flex",
                alignItems: "center",
                width: "100%",
                borderRadius: 2,
                bgcolor: "#e5e7eb", // Đổi sang nền xám giống hình mẫu
                border: "none", // Bỏ viền
                boxShadow: "none",
              }}
            >
              <IconButton sx={{ p: "8px" }} aria-label="search">
                <SearchIcon sx={{ color: "#9ca3af" }} fontSize="small" />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1, fontSize: 14 }}
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Paper>

            {/* Danh sách Thẻ trạng thái */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 1.5, // 12px để giống khoảng cách trong hình
              }}
            >
              {cards.map((card, idx) => {
                const isActive =
                  currentFilter.type === "CARD" &&
                  currentFilter.value === card.value;
                const isAllButActive =
                  card.value === "All" && currentFilter.type !== "CARD";
                // Nếu thẻ hiện tại được chọn, đổi màu nền và màu sắc
                const activeBg =
                  isActive || isAllButActive ? "#0b5286" : "#ebebeb"; // Dùng xám sáng hơn chút cho card không chọn
                const activeColor =
                  isActive || isAllButActive ? "#ffffff" : "#111827";
                const activeIconColor =
                  isActive || isAllButActive ? "#ffffff" : card.iconColor;

                return (
                  <Paper
                    key={idx}
                    onClick={() =>
                      setCurrentFilter({ type: "CARD", value: card.value })
                    }
                    sx={{
                      p: "12px 14px", // Padding vừa vặn
                      borderRadius: 3.5,
                      bgcolor: activeBg,
                      color: activeColor,
                      height: 80, // Giảm chiều cao để tạo hình chữ nhật dẹp giống ảnh
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start", // Đẩy nội dung lên trên
                      boxShadow: "none",
                      cursor: "pointer",
                      transition: "transform 0.1s",
                      "&:active": { transform: "scale(0.96)" },
                    }}
                  >
                    {/* Cột trái: Icon và Title được gom lại gần nhau */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.8,
                      }}
                    >
                      <Box
                        sx={{
                          color: activeIconColor,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {card.icon}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 650,
                          fontSize: "0.95rem", // Chữ to và rõ hơn xíu
                        }}
                      >
                        {card.title}
                      </Typography>
                    </Box>

                    {/* Cột phải: Count */}
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.8rem", // Số to, đậm
                        lineHeight: 1,
                        mt: "-2px", // Căn chỉnh line height chuẩn với lề trên
                      }}
                    >
                      {card.count}
                    </Typography>
                  </Paper>
                );
              })}
            </Box>

            {/* Danh mục (Categories) */}
            <Box sx={{ mt: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  color: "#9ca3af",
                  fontWeight: "bold",
                  mb: 1,
                  display: "block",
                  px: 1,
                }}
              >
                Categories
              </Typography>
              <List disablePadding>
                {categoriesList.map((cat, idx) => {
                  // Đếm số lượng task thuộc danh mục, bỏ qua task bị xóa
                  const catCount = tasks.filter(
                    (t) => t.categoryId === cat.id && !t.deleted
                  ).length;
                  const isActive =
                    currentFilter.type === "CATEGORY" &&
                    currentFilter.value === cat.id;

                  return (
                    <ListItem
                      key={idx}
                      onClick={() =>
                        setCurrentFilter({ type: "CATEGORY", value: cat.id })
                      }
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 2,
                        cursor: "pointer",
                        bgcolor: isActive ? "#e5e7eb" : "transparent",
                        "&:hover": { bgcolor: "#e5e7eb" },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <FolderIcon
                          sx={{ color: isActive ? "#3b82f6" : "#d1d5db" }}
                          fontSize="small"
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={cat.name}
                        primaryTypographyProps={{
                          fontSize: 14,
                          fontWeight: isActive ? 700 : 600,
                          color: isActive ? "#111827" : "#374151",
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: "#9ca3af", fontWeight: "bold" }}
                      >
                        {catCount}
                      </Typography>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </Box>

          {/* Cột phải (Nội dung chính - List task) */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              bgcolor: "#f3f4f6", // Màu nền xám đậm hơn một chút ở bên phải (List)
              p: { xs: 3, md: 4, lg: 5 },
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#111827" }}>
              {getListHeader()}
            </Typography>

            {/* Ô Nhập công việc mới - Chỉ hiện nếu không nằm trong phần "Deleted" */}
            {currentFilter.value !== "Deleted" && (
              <Paper
                sx={{
                  p: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  borderRadius: 3,
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  border: "1px solid #f3f4f6",
                  bgcolor: "#ffffff",
                  transition: "box-shadow 0.2s",
                }}
              >
                <AddIcon sx={{ color: "#6b7280", mr: 1, fontSize: 22 }} />
                <InputBase
                  sx={{ flex: 1, fontSize: 15, color: "#374151" }}
                  placeholder="Add new task"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyDown={handleAddTask}
                />
              </Paper>
            )}

            {/* Danh sách công việc */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              {filteredTasks.length === 0 ? (
                <Typography
                  sx={{ color: "#9ca3af", textAlign: "center", mt: 4 }}
                >
                  Không có công việc nào thoản mãn.
                </Typography>
              ) : (
                filteredTasks.map((task) => (
                  <Paper
                    key={task.id}
                    sx={{
                      p: "6px 16px", // padding hai bên thu nhỏ lại một chút
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      borderRadius: 3,
                      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                      border: "1px solid #f3f4f6",
                      opacity: task.completed ? 0.7 : 1, // Làm mờ công việc đã hoàn thành
                      transition: "box-shadow 0.2s",
                      "&:hover": {
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    {/* Nút Đánh dấu hoàn thành */}
                    <IconButton
                      size="small"
                      onClick={() => handleToggleComplete(task.id)}
                      sx={{
                        mr: 1,
                        color: task.completed ? "#10b981" : "#d1d5db",
                      }}
                    >
                      {task.completed ? (
                        <CheckCircleIcon />
                      ) : (
                        <RadioButtonUncheckedIcon />
                      )}
                    </IconButton>

                    {/* Nội dung Task */}
                    <Typography
                      sx={{
                        flex: 1,
                        fontSize: 15,
                        fontWeight: 500,
                        color: task.completed ? "#6b7280" : "#1f2937", // Chữ màu xám nếu đã xong
                        textDecoration: task.completed
                          ? "line-through"
                          : "none",
                        ml: 1,
                      }}
                    >
                      {task.text}
                    </Typography>

                    {/* Nút Đánh dấu sao quan trọng */}
                    <IconButton
                      size="small"
                      onClick={() => handleToggleImportant(task.id)}
                      sx={{
                        mr: 1,
                        color: task.important ? "#f59e0b" : "#d1d5db",
                      }}
                    >
                      {task.important ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>

                    {/* Nút Xóa (Hoặc khôi phục nếu đang xem từ thùng rác - màn hình Deleted) */}
                    {/* {currentFilter.value !== "Deleted" ? (
                      <IconButton
                        size="small"
                        title="Xóa công việc"
                        onClick={() => handleDeleteTask(task.id)}
                        sx={{
                          color: "#ef4444",
                          opacity: 0.6,
                          "&:hover": { opacity: 1 },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    ) : (
                      <IconButton
                        size="small"
                        title="Khôi phục công việc"
                        onClick={() => {
                          setTasks(
                            tasks.map((t) =>
                              t.id === task.id ? { ...t, deleted: false } : t
                            )
                          );
                        }}
                        sx={{
                          color: "#10b981",
                          opacity: 0.6,
                          "&:hover": { opacity: 1 },
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    )} */}
                  </Paper>
                ))
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
