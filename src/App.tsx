import { useState } from "react";
// Import các Component dựng sẵn (UI components) từ thư viện Material-UI (MUI)
// để sử dụng cho dự án, giúp xây dựng giao diện nhanh chóng thay vì vất vả viết CSS lại từ đầu.
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
  Drawer,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
} from "@mui/material";

// Import các Icon từ bộ biểu tượng @mui/icons-material
import SearchIcon from "@mui/icons-material/Search";
import InboxIcon from "@mui/icons-material/Inbox"; // Icon Hộp thư (All)
import FlagIcon from "@mui/icons-material/Flag"; // Icon Lá cờ (Important)
import CheckBoxIcon from "@mui/icons-material/CheckBox"; // Icon Ô check (Completed)
import DeleteIcon from "@mui/icons-material/Delete"; // Icon Thùng rác (Deleted / Nút xóa)
import FolderIcon from "@mui/icons-material/Folder"; // Icon Thư mục lưới
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked"; // Icon chưa đánh dấu Check
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Icon đã đánh dấu Check
import StarBorderIcon from "@mui/icons-material/StarBorder"; // Icon Ngôi sao chưa tô kín
import StarIcon from "@mui/icons-material/Star"; // Icon Ngôi sao (Important)
import AddIcon from "@mui/icons-material/Add"; // Icon Dấu cộng
import CloseIcon from "@mui/icons-material/Close"; // Icon Đóng X

// =====================
// 1. CHUẨN BỊ GIAO DIỆN CHUNG (THEME MUI)
// =====================
// Hàm createTheme() giúp cấu hình (overwrite) lại màu gốc, phông chữ và bóng đổ chung của toàn hệ thống
const theme = createTheme({
  palette: {
    mode: "light", // Sử dụng chế độ giao diện sáng
    background: {
      default: "#f3f4f6", // Đặt màu nền nền cơ sở cho toàn app thành màu xám nhạt (thay vì trắng toát mặc định)
    },
    primary: {
      main: "#0a497b", // Màu xanh dương đậm (Dùng cho List đang active & Nút Lưu)
    },
    error: {
      main: "#ef4444", // Màu đỏ (Dành cho Cảnh báo / Nút Xóa)
    },
  },
  typography: {
    // Sửa Font chữ tổng quát của website sang Inter (hoặc dùng Roboto/Helvetica nếu không có)
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          // Bất cứ nơi nào trong cấu trúc dùng Component <Paper> (Chứa thẻ, thanh search,...) thì tự có bóng đổ nhẹ và sạch
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        },
      },
    },
  },
});

export default function App() {
  // =====================
  // 2. CÁC BIẾN DATA VÀ STATE XỬ LÝ CHÍNH
  // =====================

  // tasks: Lưu trữ cơ sở dữ liệu chính của danh sách các Công việc. Mỗi khi state change (thay đổi), giao diện App sẽ tự render lại.
  const [tasks, setTasks] = useState([
    {
      id: 1, // Mã số định danh duy nhất (Unique ID)
      text: "Du lịch USA", // Nội dung task
      important: false, // Trạng thái Quan trọng (Sao vàng) -> chưa có
      completed: false, // Trạng thái Hoàn thành (Check) -> chưa hoàn thành
      deleted: false, // Trạng thái Xóa -> Nếu true thì chỉ hiện trong Thùng rác
      categoryId: "du-lich", // Nằm trong danh mục nào?
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
      text: "Ăn tối",
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

  // newTaskText: Lưu trữ giá trị Text mỗi khi người dùng đang "gõ gõ" vào ô Thêm task trên cùng.
  const [newTaskText, setNewTaskText] = useState("");

  // searchQuery: Lưu giá trị của ô Tìm Kiếm (Search) ở cột bên trái
  const [searchQuery, setSearchQuery] = useState("");

  // currentFilter: Trạng thái quy định chúng ta đang NHÌN VÀO THỨ GÌ trên màn hình (Ví dụ: Đang xem Toàn bộ thẻ? Hay đang ở trong Danh mục Cá nhân?)
  const [currentFilter, setCurrentFilter] = useState({
    type: "CARD", // Phân loại: Lọc theo Thẻ trạng thái ("CARD") hay theo Danh mục dưới ("CATEGORY")
    value: "All", // Giá trị đang nằm ở: All, Important, Completed, Deleted, hoặc Id của category ('ca-nhan',...)
  });

  // State quyết định Panel (Menu bên phải dùng để Edit Task) đang Đóng (false) hay Mở (true).
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // selectedTask: Giữ thông tin của 1 công việc MÀ MÌNH VỪA CLICK CHUỘT VÀO, để Panel Edit biết phải lấy dữ liệu gì để hiển thị lên.
  const [selectedTask, setSelectedTask] = useState<any>(null);

  // deleteDialog: Giữ thông tin hộp thoại Hỏi Confirm "Có chắc xóa không?"
  // 'open': Có đang nằm trên màn hình không? / 'taskId': Nhớ lại cái ID mình đang định bấm chữ X là ID mấy.
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    taskId: number | null;
  }>({
    open: false,
    taskId: null,
  });

  // Khai báo sẵn các danh mục (Categories List) ở danh sách tĩnh
  const categoriesList = [
    { id: "ca-nhan", name: "Cá nhân" },
    { id: "cong-ty", name: "Công ty" },
    { id: "du-lich", name: "Du lịch" },
    { id: "y-tuong", name: "Ý tưởng" },
  ];

  // =====================
  // 3. CÁC HÀM XỬ LÝ (ACTION HANDLERS) - Những gì xảy ra khi chúng ta Tương tác
  // =====================

  // Hàm thêm công việc mới: Chạy mỗi khi thả phím lên trên ô input (e.key)
  const handleAddTask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Chỉ chạy nếu người ta gõ Enter và đoạn text không hề bị rỗng
    if (e.key === "Enter" && newTaskText.trim() !== "") {
      const newTask = {
        id: Date.now(), // Dùng thời gian chuẩn hiện tại làm ID duy nhất (VD: 168019313)
        text: newTaskText.trim(), // Đoạn text vừa gõ
        // Nếu người dùng đang ấn đứng ở Thẻ Important và gõ luôn task, tự động gắn cờ Important cho task đó luôn
        important: currentFilter.value === "Important",
        completed: false, // Mặc định tạo ra luôn luôn chưa hoàn thành
        deleted: false, // Mặc định không bị vô thùng rác
        categoryId:
          currentFilter.type === "CATEGORY" ? currentFilter.value : "ca-nhan", // Mặc định danh mục là Cá nhân nếu chưa vào thư mục khác
      };

      // Copy mảng tasks cũ, nhét cái task mới này vào cuối cùng.
      setTasks([...tasks, newTask]);

      // Dọn sạch cái Text đã gõ trên ô Input cho đỡ bẩn
      setNewTaskText("");
    }
  };

  // Hàm toggle (qua về): Từ chưa H.Thành -> H.Thành hoặc ngược lại
  const handleToggleComplete = (taskId: number) => {
    // Tìm trong mảng. Nếu check ID gặp task đó, ghi đè cái thuộc tính completed lật ngược lại (VD: Đang false thành true và ngược lại !completed)
    setTasks(
      tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    );
  };

  // Hàm toggle Quan trọng: Từ thẻ sao viền -> sao đầy và ngược lại
  const handleToggleImportant = (taskId: number) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId ? { ...t, important: !t.important } : t
      )
    );
  };

  // Hàm XEM CHI TIẾT (Bật menu Drawer mép bên phải lên)
  const handleOpenTaskDetails = (task: any) => {
    setSelectedTask({ ...task }); // Sao chép copy nguyên bản cái task đó bỏ vô tủ selectedTask
    setIsDrawerOpen(true); // Gạt cần bật Drawer mở ra
  };

  // Hàm LƯU SAU KHI SỬA xong ở trong Drawer
  const handleSaveSelectedTask = () => {
    if (selectedTask) {
      // Loop toàn bộ bảng db task cũ, nếu nào là ID mình đã chỉnh sửa, thay thế nó bằng cái cục selectedTask mới
      setTasks(tasks.map((t) => (t.id === selectedTask.id ? selectedTask : t)));
      setIsDrawerOpen(false); // Sửa xong thì đóng Menu phải đi
    }
  };

  // Gọi bảng Dialog hiển thị thông báo xem có chắc chắn xóa hay không?
  const handleOpenDeleteConfirm = (taskId: number, e?: React.MouseEvent) => {
    // Vì cái "Nút Xóa" nằm chồng đè lên bề mặt của "Card Task",
    // nếu mình ấn Xóa, giao diện hiểu nhầm mình vừa bấm vô Card để Xem ==> stopPropagation cắt đứt hiểu lầm này.
    if (e) e.stopPropagation();

    // Lưu tạm lại mình đang chuẩn bị trảm thằng TaskID mấy rồi mở cửa Dialog lên.
    setDeleteDialog({ open: true, taskId });
  };

  // Phán xử cuối cùng: Nút MÀU ĐỎ "Chắc chắn Xóa" ở cửa sổ Dialog Confirm được bấm
  const handleConfirmDelete = () => {
    if (deleteDialog.taskId !== null) {
      // Trả thuộc tính cờ `deleted: true` ==> Biến mất khỏi đời sống list thật, chuyển qua list Ma
      setTasks(
        tasks.map((t) =>
          t.id === deleteDialog.taskId ? { ...t, deleted: true } : t
        )
      );

      // Thêm trick: Lỡ may vừa mở cái Menu bên phải mà mình đang xem chính cái Task đó rồi xóa, -> Ẩn luôn menu đi vì task lọt vô thùng rác rồi.
      if (selectedTask && selectedTask.id === deleteDialog.taskId) {
        setIsDrawerOpen(false);
      }
    }
    // Xong việc thì gập cái Dialog Cảnh Báo xuống
    setDeleteDialog({ open: false, taskId: null });
  };

  // Từ chối Phán xử (Chỉ đơn thuần tắt Dialog đi)
  const handleCloseDeleteConfirm = () => {
    setDeleteDialog({ open: false, taskId: null });
  };

  // Nút Dấu Cọng Màu Xanh ở mục Deleted (Cứu hộ Task = Restoring Task)
  const handleRestoreTask = (taskId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    // Gắn ngược cờ `deleted: false` để từ list Ma hiện nguyên hình lại vô list All
    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, deleted: false } : t))
    );
  };

  // =====================
  // 4. TIẾN HÀNH CALCULATION (LỌC & TÍNH SỐ LƯỢNG) ĐỂ HIỂN THỊ DỮ LIỆU CHUẨN XÁC RA VIEW
  // =====================

  // Đếm xem bao nhiêu việc không bị Xóa thì nhét vào thẻ mốc đếm số To to ở trên màn hình
  const countAll = tasks.filter((t) => !t.deleted).length;
  // Các cái task mà cờ important = True và không bị xóa = Chứa vô countImportant
  const countImportant = tasks.filter((t) => t.important && !t.deleted).length;
  // Tuơng tự
  const countCompleted = tasks.filter((t) => t.completed && !t.deleted).length;
  // Những cái nào có deleted = true nhét vô Đếm của Thùng rác
  const countDeleted = tasks.filter((t) => t.deleted).length;

  // Render ra dòng Text ở bên phải cái List (Title để biết mình ở list gì: "All", "Công Ty", "Cá nhân")
  const getListHeader = () => {
    if (currentFilter.type === "CARD") return currentFilter.value; // Khá đơn giản, lôi luôn Text của thẻ

    // Nếu bị kẹt ở ID Categories ("ca-nhan"), dò trong danh sách Categories tìm tên Tiếng Việt (Name) trả ra: "Cá nhân"
    const cat = categoriesList.find((c) => c.id === currentFilter.value);
    return cat ? cat.name : "All";
  };

  // Cốt Lõi (Core View Data): Những Công việc Nào Sẽ Thực Sự Được Hiển Thị Trong Danh Sách Khung Chính Bên Phải?
  // Phải xài filter() để lọc qua các điều kiện: Type, Khung tìm kiếm(Search)....
  const filteredTasks = tasks.filter((task) => {
    // Điều kiện A: Nếu người dùng đang Search chữ. Dò xem Task text có chứa chữ đó không? (Để lowerCase hết để tìm bừa hoa thường cũng ra do k phân biệt)
    if (
      searchQuery &&
      !task.text.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false; // Nếu không tìm thấy, Gạt đi.
    }

    // Điều kiện B: Trạng thái Tab 4 cục bự đang ở đâu?
    if (currentFilter.type === "CARD") {
      switch (currentFilter.value) {
        case "All":
          return !task.deleted; // Chỉ hiển thị task nếu chưa bị xóa
        case "Important":
          return task.important && !task.deleted; // Phải là sao và chưa bị xóa
        case "Completed":
          return task.completed && !task.deleted; // Phải check hoàn thành và chưa xóa
        case "Deleted":
          return task.deleted; // Bắt buộc là bị xóa (Tức mới chui vô thùng rác coi nè)
        default:
          return true;
      }
    }
    // Điều kiện C: Không bấm thẻ To ở trên mà đang bấm Thư Mục nhỏ ở dưới cột bên trái (Category)
    else if (currentFilter.type === "CATEGORY") {
      return task.categoryId === currentFilter.value && !task.deleted; // Gốc folder phải khớp rập khuôn với categoryId
    }

    return true; // Lọt vô đây thì task được xuất hiện.
  });

  // Khai báo sẵn Cấu trúc dữ liệu 4 cái khung bự để tý nữa map() vòng lặp render
  const cards = [
    {
      title: "All",
      value: "All",
      count: countAll,
      icon: <InboxIcon />,
      iconColor: "#ffffff",
    },
    {
      title: "Important",
      value: "Important",
      count: countImportant,
      icon: <FlagIcon />,
      iconColor: "#f59e0b",
    },
    {
      title: "Completed",
      value: "Completed",
      count: countCompleted,
      icon: <CheckBoxIcon />,
      iconColor: "#10b981",
    },
    {
      title: "Deleted",
      value: "Deleted",
      count: countDeleted,
      icon: <DeleteIcon />,
      iconColor: "#ef4444",
    },
  ];

  // =====================
  // 5. HIỂN THỊ GIAO DIỆN KIẾN TRÚC UI
  // JSX Render
  // =====================
  return (
    // Bọc Theme MUI chứa các màu sắc để mọi thành phần con sử dụng
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Reset mọi thuộc tính lề CSS tào lao của Browser cũ*/}
      {/* Container Body Background Tổng Phủ Kín Toàn Bộ*/}
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f3f4f6" }}>
        {/* Layout cắt làm 2 cột: Cột trái - Cột Phải (Ở giao diện điện thoại xs thì thành từ trên -> Dưới theo column) */}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* ======================= */}
          {/* == VÙNG CỘT TRÁI (SIDEBAR MENU TRÁI) == */}
          {/* ======================= */}
          <Box
            sx={{
              width: { xs: "100%", md: 320, lg: 350 }, // Điện thoại thả thả full 100%. Laptop thì dính đứt 350px
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              bgcolor: "#f8f9fa", // Nền nhạt hơn xíu
              p: { xs: 3, md: 4, lg: 5 },
              borderRight: "1px solid #e5e7eb", // Đường thẳng dọc chia dọc trang
            }}
          >
            {/* Component: Ô Tìm kiếm SearchBar */}
            <Paper
              sx={{
                p: "4px 8px",
                display: "flex",
                alignItems: "center",
                width: "100%",
                borderRadius: 2,
                bgcolor: "#e5e7eb", // Ô nền xám nhạt
                border: "none",
                boxShadow: "none",
              }}
            >
              <IconButton sx={{ p: "8px" }} aria-label="search">
                <SearchIcon sx={{ color: "#9ca3af" }} fontSize="small" />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1, fontSize: 14 }}
                placeholder="Search"
                value={searchQuery} // Bind gõ text searchQuery
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Paper>

            {/* Component: Lưới của 4 thẻ Trạng Thái Dashboard Lớn */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 1.5,
              }}
            >
              {cards.map((card, idx) => {
                // Kiểm tra bằng mắt logic: Thẻ nào có value khớp với State Bộ Lọc gốc(currentFilter) thì thẻ đó Đang Active Bật.
                const isActive =
                  currentFilter.type === "CARD" &&
                  currentFilter.value === card.value;
                const isAllButActive =
                  card.value === "All" && currentFilter.type !== "CARD";

                // Nếu Đang Bật -> Màu xanh dương | Chưa bật -> Nền Xám
                const activeBg =
                  isActive || isAllButActive ? "#0b5286" : "#ebebeb";
                const activeColor =
                  isActive || isAllButActive ? "#ffffff" : "#111827";
                const activeIconColor =
                  isActive || isAllButActive ? "#ffffff" : card.iconColor;

                return (
                  <Paper
                    key={idx}
                    onClick={() =>
                      setCurrentFilter({ type: "CARD", value: card.value })
                    } // Bấm vô cái nào, state filter chuyển thẳng giá trị sang filter của cái đó luôn
                    sx={{
                      p: "12px 14px",
                      borderRadius: 3.5,
                      bgcolor: activeBg, // Rót nền dô thẻ
                      color: activeColor,
                      height: 80,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      boxShadow: "none",
                      cursor: "pointer",
                      transition: "transform 0.1s",
                      "&:active": { transform: "scale(0.96)" }, // Anim nhấn nhẹ Scale thun xuống
                    }}
                  >
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
                        sx={{ fontWeight: 650, fontSize: "0.95rem" }}
                      >
                        {card.title}
                      </Typography>
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.8rem",
                        lineHeight: 1,
                        mt: "-2px",
                      }}
                    >
                      {card.count} {/* Render chữ số hiển thị Count */}
                    </Typography>
                  </Paper>
                );
              })}
            </Box>

            {/* Component: Danh mục (Categories) Bằng chữ bên dưới chân */}
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
                  // Đếm bằng vòng lặp ảo thử xem bao nhiêu list con đang có cái đuôi thẻ categoryID giống category id này? (Để xổ số lượng Count 2,3,4 ở cạnh)
                  const catCount = tasks.filter(
                    (t) => t.categoryId === cat.id && !t.deleted
                  ).length;

                  // So điều kiện nếu State lọc đang đứng trùng với chữ thì Focus
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
                        bgcolor: isActive ? "#e5e7eb" : "transparent", // Màu nền nhẹ Highlight nếu đang ở tab này
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

          {/* ======================= */}
          {/* == VÙNG CỘT PHẢI (MAIN LIST TASK HIỂN THỊ) == */}
          {/* ======================= */}
          <Box
            sx={{
              flex: 1, // flex 1: Kéo dãn cho đầy không gian trống còn dư (full ngang phía sau cột 350px)
              display: "flex",
              flexDirection: "column",
              gap: 3,
              p: { xs: 3, md: 4, lg: 5 },
            }}
          >
            {/* Header Thay Đổi Name Động : "All", "Important", "Danh mục XYZ"...  */}
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#111827" }}>
              {getListHeader()}
            </Typography>

            {/* Component: Ô Nhập Vào (Text Input Tạo Công Việc Mới Bằng Phím Enter) */}
            {/* CHÚ Ý: Nếu đang mở tab xem THÙNG RÁC, chặn luôn đi không cho render (Biến mất) cái form nhập task mới do đâu ai nhập rác mới làm gì. */}
            {currentFilter.value !== "Deleted" && (
              <Paper
                sx={{
                  p: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  borderRadius: 3,
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  border: "1px solid #f3f4f6", // Viền bo xám
                  bgcolor: "#ffffff",
                  transition: "box-shadow 0.2s",
                }}
              >
                <AddIcon sx={{ color: "#6b7280", mr: 1, fontSize: 22 }} />
                <InputBase
                  sx={{ flex: 1, fontSize: 15, color: "#374151" }}
                  placeholder="Add new task"
                  value={newTaskText} // Biến quản lý chữ mỗi khi gõ
                  onChange={(e) => setNewTaskText(e.target.value)} // Truyền giá trị vào ngược biến Set State
                  onKeyDown={handleAddTask} // Lắng nghe ấn Enter
                />
              </Paper>
            )}

            {/* Component: Box Danh Sách Các Mục (Các Dòng Task Line ngang) */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {/* Nếu Mảng Công Việc Filtered đã rỗng không có phần tử nào -> Render chữ Trống */}
              {filteredTasks.length === 0 ? (
                <Typography
                  sx={{ color: "#9ca3af", textAlign: "center", mt: 4 }}
                >
                  There are no tasks to display.
                </Typography>
              ) : (
                /* Ngược lại, lôi ra xài vòng lặp map để dàn hàng ngang từng cục task một */
                filteredTasks.map((task) => (
                  <Paper
                    key={task.id}
                    onClick={() => handleOpenTaskDetails(task)} // Bấm vô nguyên cái Line này -> Kích hoạt lệnh Mở Right Panel Edit
                    sx={{
                      p: "6px 16px",
                      display: "flex",
                      alignItems: "center", // Xếp theo chiều ngang
                      width: "100%",
                      borderRadius: 3,
                      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                      border: "1px solid #f3f4f6",
                      opacity: task.completed ? 0.7 : 1, // Làm mờ công việc nhìn cho dễ nếu như đã check (hoàn thành)
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        transform: "translateY(-1px)", // Hover đè lên thì cái khung nẩy cao lên 1 tí (Bay nhẹ)
                      },
                    }}
                  >
                    {/* Phần Icon Tương Tác Cột 1: Tick Check Mark (Hoàn Thành hay Chưa) */}
                    <IconButton
                      size="small"
                      // PHẢI CÓ STOPPROPAGATION: nếu không dặn, khi người dùng kích chuột check box xong rớt tay gập màn hình ngay -> Vì nó sẽ chạy cả lệnh bấm Mở menu ngoài ở Paper nữa
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleComplete(task.id);
                      }}
                      sx={{
                        mr: 1,
                        color: task.completed ? "#10b981" : "#d1d5db",
                      }} // Check rồi màu xanh, chưa check màu xám viền
                    >
                      {task.completed ? (
                        <CheckCircleIcon />
                      ) : (
                        <RadioButtonUncheckedIcon />
                      )}
                    </IconButton>

                    {/* Phần Trữ Nội dung Text Cột 2 (Dài nhất đẩy flex chèn ép tụi kia) */}
                    <Typography
                      sx={{
                        flex: 1, // Tự động kéo dãn không gian đẩy 2 cột button qua 2 phía mút cuối
                        fontSize: 15,
                        fontWeight: 500,
                        color: task.completed ? "#6b7280" : "#1f2937",
                        textDecoration: task.completed
                          ? "line-through"
                          : "none", // Nếu check xanh -> lấy bút dạ kẻ line giữa gạch chân text!
                        ml: 1,
                      }}
                    >
                      {task.text}
                    </Typography>

                    {/* Phần Icon Tương Tác Cột 3: Quẹt Ngôi Sao Important (Quan Trọng) */}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleImportant(task.id);
                      }}
                      sx={{
                        mr: 1,
                        color: task.important ? "#f59e0b" : "#d1d5db",
                      }} // Sao vàng chói thì ra #f5...
                    >
                      {task.important ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>

                    {/* Phần Button Tương Tác Cột 4: Rẽ Hướng Logic XÓA Hoặc KHÔI PHỤC  */}
                    {/* {currentFilter.value !== "Deleted" ? (
                      // A. Nếu mình đang lướt mục bình thường, hiển nhiên cái nút sẽ mang thuộc tính "Mang Đi Thụt Nách (Xóa Cảnh Báo) -> Thùng rác"
                      <IconButton
                        size="small"
                        onClick={(e) => handleOpenDeleteConfirm(task.id, e)} // TRiger lôi bảng Dialog Pop UP đỏ chót ra hỏi Cho Xóa K?
                        sx={{
                          color: "#ef4444",
                          opacity: 0.6,
                          "&:hover": { opacity: 1 },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    ) : (
                      // B. Lúc này mình đang đứng check hàng trong tab "THÙNG RÁC". Cụ nút Xóa sẽ Hô biến ảo hóa vờn màu Xanh và Cứu vớt Task vô đời
                      <IconButton
                        size="small"
                        onClick={(e) => handleRestoreTask(task.id, e)} // Khôi Phục lượi chui qua list bt
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
      {/* ======================= */}
      {/* 6A. MẢNG CƠ CHẾ POP-UP ẨN GIẤU - PANEL KÉO CANH MÀN HÌNH BÊN PHẢI (CHỈNH SỬA DETAIL) */}
      {/* ======================= */}
      {/* Drawer: là một mảng chèn ẩn của MUI sẽ tự trượt ra mượt (anchor=Right lề phải) từ mép mỗi khi prop `open` có biến state đánh giá == true */}
      <Drawer
        anchor="right"
        open={isDrawerOpen} // Nó nghe lệnh này mà ngụp lên lặn xuống nè.
        onClose={() => setIsDrawerOpen(false)} // Lúc bấm dô lề xám mờ màn hình để gập, nó tự động đổi cờ Open thành false
        PaperProps={{
          sx: { width: { xs: "100%", sm: 400 }, p: 4, bgcolor: "#ffffff" }, // xs đt thì kín full tab che mặt. pc thì ra cái form size 400px xài lề p=4 cho khỏe
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Chỉnh sửa Task
          </Typography>
          <IconButton
            onClick={() => setIsDrawerOpen(false)}
            sx={{ bgcolor: "#f3f4f6" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 4 }} /> {/* Vạch kẻ mỏng chia cắt ngăn cản */}
        {/* NẾU đã load trúng dữ liệu của selectedTask vào thì MỚI cho chường mặt ra cho phép chỉnh sửa ko thì trốn tịt tránh LỖI Crash APP TRẮNG XÓA (If render condition)  */}
        {selectedTask && (
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 3.5, flex: 1 }}
          >
            {/* Input dạng Hộp Khung - Hỗ trợ cho phép xuống dòng Multiline Rows=3 chuyên nghiệp giống IOS Notepad */}
            <TextField
              label="Tên công việc"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={selectedTask.text} // In ra chữ tạm thời (Draf Text Copy)
              onChange={(e) =>
                setSelectedTask({ ...selectedTask, text: e.target.value })
              } // Người dùng thay đổi -> Update vô Draf. Tuyệt đối không update dô App Core chưa gì!
            />

            {/* Input dạng Danh Sổ chọn mũi tên Natively DropDown -> Đổi category.  */}
            <TextField
              select
              label="Danh mục List (Category)"
              value={selectedTask.categoryId}
              onChange={(e) =>
                setSelectedTask({ ...selectedTask, categoryId: e.target.value })
              }
              SelectProps={{ native: true }} // Dùng native option thuần túy trên ĐT dễ thao tác ngón tay
              fullWidth
            >
              {categoriesList.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </TextField>

            <Box
              sx={{ display: "flex", gap: 2, alignItems: "center", mt: "auto" }}
            >
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />} // Gắn thêm cái nút thùng rác vô lỡ user thấy chán bỏ edit
                onClick={() => handleOpenDeleteConfirm(selectedTask.id)} // Cũng gọi Pop đỏ hỏi xác minh nhé
                sx={{ flex: 1, py: 1.2, fontWeight: 700, borderRadius: 2 }}
              >
                Xóa
              </Button>
              <Button
                variant="contained"
                color="primary" // Cái nút To Nhất chói Sáng Trắng nhất xanh dương đậm nhất dành cho Save Data
                onClick={handleSaveSelectedTask} // Bóp còi - Xóa copy, GHI ĐÈ VÀO SOURCE CODE GỐC DATABASE TRONG RAM
                sx={{
                  flex: 2,
                  py: 1.2,
                  fontWeight: 700,
                  borderRadius: 2,
                  boxShadow: "none",
                }}
              >
                Lưu Thay Đổi
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
      {/* ======================= */}
      {/* 6B. MẢNG CƠ CHẾ POP-UP ẨN GIẤU - HỘP DIALOG XÁC NHẬN "BẠN CÓ CHẮC KHÔNG?" TRÁNH VIỆC VÔ TÌNH BÓP LẦM BỊ MẤT FILE */}
      {/* ======================= */}
      <Dialog
        open={deleteDialog.open} // Lệnh nghe nhịp đóng mở bằng State riêng ở cục số (2) đầu file
        onClose={handleCloseDeleteConfirm} // Nhấn Cance hoặc Hủy -> Hạ State false cúp cửa xuống
        PaperProps={{
          sx: { borderRadius: 4, p: 1, minWidth: { xs: 300, sm: 400 } },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: "1.3rem" }}>
          Xác nhận xóa
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#374151" }}>
            Bạn có chắc chắn muốn xóa công việc này không? Task này sẽ được
            chuyển vào nằm trong thẻ thùng rác "Deleted".
          </DialogContentText>
        </DialogContent>
        {/* Nhu cầu Actions nút bấm */}
        <DialogActions sx={{ pb: 1, px: 3 }}>
          <Button
            onClick={handleCloseDeleteConfirm}
            sx={{ color: "#6b7280", fontWeight: 700 }}
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            sx={{ fontWeight: 700, boxShadow: "none", borderRadius: 2 }}
          >
            Chắc chắn xóa
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
