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
import type { FilterState, Task, Category } from "../types";

interface SidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentFilter: FilterState;
  setCurrentFilter: (filter: FilterState) => void;
  tasks: Task[];
  categoriesList: Category[];
}

export function Sidebar({
  searchQuery,
  setSearchQuery,
  currentFilter,
  setCurrentFilter,
  tasks,
  categoriesList,
}: SidebarProps) {
  const countAll = tasks.filter((t) => !t.deleted).length;
  const countImportant = tasks.filter((t) => t.important && !t.deleted).length;
  const countCompleted = tasks.filter((t) => t.completed && !t.deleted).length;
  const countDeleted = tasks.filter((t) => t.deleted).length;

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

  return (
    <Box
      sx={{
        width: { xs: "100%", md: 320, lg: 350 },
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        bgcolor: "#f8f9fa",
        p: { xs: 3, md: 4, lg: 5 },
        borderRight: "1px solid #e5e7eb",
      }}
    >
      <Paper
        sx={{
          p: "4px 8px",
          display: "flex",
          alignItems: "center",
          width: "100%",
          borderRadius: 2,
          bgcolor: "#e5e7eb",
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 1.5,
        }}
      >
        {cards.map((card, idx) => {
          const isActive =
            currentFilter.type === "CARD" && currentFilter.value === card.value;
          const isAllButActive =
            card.value === "All" && currentFilter.type !== "CARD";

          const activeBg = isActive || isAllButActive ? "#0b5286" : "#ebebeb";
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
                p: "12px 14px",
                borderRadius: 3.5,
                bgcolor: activeBg,
                color: activeColor,
                height: 80,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                boxShadow: "none",
                cursor: "pointer",
                transition: "transform 0.1s",
                "&:active": { transform: "scale(0.96)" },
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
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
                {card.count}
              </Typography>
            </Paper>
          );
        })}
      </Box>

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
            const catCount = tasks.filter(
              (t) => t.categoryId === cat.id && !t.deleted,
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
  );
}
