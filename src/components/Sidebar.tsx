import React from "react";
import {
  Box,
  Paper,
  InputBase,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InboxIcon from "@mui/icons-material/Inbox";
import FlagIcon from "@mui/icons-material/Flag";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import { CATEGORIES_LIST, SIDEBAR_FILTER_OPTIONS } from "../constants";

// Redux
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectSearchQuery, setSearchQuery } from "../store/slices/searchSlice";
import { selectCurrentFilter, setCurrentFilter } from "../store/slices/uiSlice";
import {
  selectCountAll,
  selectCountImportant,
  selectCountCompleted,
  selectCountDeleted,
  selectAllTasks,
} from "../store/slices/tasksSlice";

// Ánh xạ icon cho các thẻ thống kê
const ICON_MAP: Record<string, { icon: React.ReactNode; color: string }> = {
  Inbox: { icon: <InboxIcon />, color: "#ffffff" },
  Flag: { icon: <FlagIcon />, color: "#f59e0b" },
  CheckBox: { icon: <CheckBoxIcon />, color: "#10b981" },
  Delete: { icon: <DeleteIcon />, color: "#ef4444" },
};

// Thanh điều hướng bên trái (Sidebar)
export function Sidebar() {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(selectSearchQuery);
  const currentFilter = useAppSelector(selectCurrentFilter);

  const countAll = useAppSelector(selectCountAll);
  const countImportant = useAppSelector(selectCountImportant);
  const countCompleted = useAppSelector(selectCountCompleted);
  const countDeleted = useAppSelector(selectCountDeleted);
  const tasks = useAppSelector(selectAllTasks);

  const counts: Record<string, number> = {
    All: countAll,
    Important: countImportant,
    Completed: countCompleted,
    Deleted: countDeleted,
  };

  const getCategoryCount = (categoryId: string) =>
    tasks.filter((t) => t.categoryId === categoryId && !t.deleted).length;

  return (
    <Box sx={{ width: { xs: "100%", md: 320, lg: 350 }, flexShrink: 0, display: "flex", flexDirection: "column", gap: 3, bgcolor: "#f8f9fa", p: { xs: 3, md: 4, lg: 5 }, borderRight: "1px solid #e5e7eb" }}>
      {/* Ô tìm kiếm */}
      <Paper sx={{ p: "4px 8px", display: "flex", alignItems: "center", width: "100%", borderRadius: 2, bgcolor: "#e5e7eb", border: "none", boxShadow: "none" }}>
        <IconButton sx={{ p: "8px" }} aria-label="search"><SearchIcon sx={{ color: "#9ca3af" }} fontSize="small" /></IconButton>
        <InputBase sx={{ ml: 1, flex: 1, fontSize: 14 }} placeholder="Search" value={searchQuery} onChange={(e) => dispatch(setSearchQuery(e.target.value))} />
      </Paper>

      {/* Các bộ lọc thống kê dựa trên SIDEBAR_FILTER_OPTIONS constant */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1.5 }}>
        {SIDEBAR_FILTER_OPTIONS.map((option, idx) => {
          const count = counts[option.value];
          const iconConfig = ICON_MAP[option.icon];
          const isActive = currentFilter.type === "CARD" && currentFilter.value === option.value;
          const isAllButActive = option.value === "All" && currentFilter.type !== "CARD";
          
          const activeBg = isActive || isAllButActive ? "#0b5286" : "#ebebeb";
          const activeColor = isActive || isAllButActive ? "#ffffff" : "#111827";
          const activeIconColor = isActive || isAllButActive ? "#ffffff" : iconConfig.color;

          return (
            <Paper key={idx} onClick={() => dispatch(setCurrentFilter({ type: "CARD", value: option.value }))} sx={{ p: "12px 14px", borderRadius: 3.5, bgcolor: activeBg, color: activeColor, height: 80, display: "flex", justifyContent: "space-between", alignItems: "flex-start", boxShadow: "none", cursor: "pointer", transition: "transform 0.1s", "&:active": { transform: "scale(0.96)" } }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
                <Box sx={{ color: activeIconColor, display: "flex", alignItems: "center" }}>{iconConfig.icon}</Box>
                <Typography variant="body2" sx={{ fontWeight: 650, fontSize: "0.95rem" }}>{option.title}</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, fontSize: "1.8rem", lineHeight: 1, mt: "-2px" }}>{count}</Typography>
            </Paper>
          );
        })}
      </Box>

      {/* Danh sách danh mục */}
      <Box sx={{ mt: 1 }}>
        <Typography variant="caption" sx={{ color: "#9ca3af", fontWeight: "bold", mb: 1, display: "block", px: 1 }}>Categories</Typography>
        <List disablePadding>
          {CATEGORIES_LIST.map((cat, idx) => {
            const catCount = getCategoryCount(cat.id);
            const isActive = currentFilter.type === "CATEGORY" && currentFilter.value === cat.id;

            return (
              <ListItem key={idx} onClick={() => dispatch(setCurrentFilter({ type: "CATEGORY", value: cat.id }))} sx={{ px: 1, py: 0.5, borderRadius: 2, cursor: "pointer", bgcolor: isActive ? "#e5e7eb" : "transparent", "&:hover": { bgcolor: "#e5e7eb" } }}>
                <ListItemIcon sx={{ minWidth: 36 }}><FolderIcon sx={{ color: isActive ? "#3b82f6" : "#d1d5db" }} fontSize="small" /></ListItemIcon>
                <ListItemText primary={cat.name} primaryTypographyProps={{ fontSize: 14, fontWeight: isActive ? 700 : 600, color: isActive ? "#111827" : "#374151" }} />
                <Typography variant="body2" sx={{ color: "#9ca3af", fontWeight: "bold" }}>{catCount}</Typography>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
}
