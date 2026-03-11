import { useState } from "react";
import { Box, ThemeProvider, CssBaseline, Typography } from "@mui/material";

// Đưa components ra ngoài App
import { Sidebar } from "./components/Sidebar";
import { TaskInput } from "./components/TaskInput";
import { TaskList } from "./components/TaskList";
import { TaskDrawer } from "./components/TaskDrawer";
import { DeleteConfirmDialog } from "./components/DeleteConfirmDialog";

// Types, Constants và Theme

import { CATEGORIES_LIST } from "./constants";
import { theme } from "./theme";
import type { DeleteDialogState, FilterState, Task } from "./types";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([
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

  const [newTaskText, setNewTaskText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState<FilterState>({
    type: "CARD",
    value: "All",
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    open: false,
    taskId: null,
  });

  const handleAddTask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTaskText.trim() !== "") {
      const newTask: Task = {
        id: Date.now(),
        text: newTaskText.trim(),
        important: currentFilter.value === "Important",
        completed: false,
        deleted: false,
        categoryId:
          currentFilter.type === "CATEGORY" ? currentFilter.value : "ca-nhan",
      };

      setTasks([...tasks, newTask]);
      setNewTaskText("");
    }
  };

  const handleToggleComplete = (taskId: number) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t,
      ),
    );
  };

  const handleToggleImportant = (taskId: number) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId ? { ...t, important: !t.important } : t,
      ),
    );
  };

  const handleOpenTaskDetails = (task: Task) => {
    setSelectedTask({ ...task });
    setIsDrawerOpen(true);
  };

  const handleSaveSelectedTask = () => {
    if (selectedTask) {
      setTasks(tasks.map((t) => (t.id === selectedTask.id ? selectedTask : t)));
      setIsDrawerOpen(false);
    }
  };

  const handleOpenDeleteConfirm = (taskId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDeleteDialog({ open: true, taskId });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.taskId !== null) {
      setTasks(
        tasks.map((t) =>
          t.id === deleteDialog.taskId ? { ...t, deleted: true } : t,
        ),
      );

      if (selectedTask && selectedTask.id === deleteDialog.taskId) {
        setIsDrawerOpen(false);
      }
    }
    setDeleteDialog({ open: false, taskId: null });
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteDialog({ open: false, taskId: null });
  };

  const handleRestoreTask = (taskId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, deleted: false } : t)),
    );
  };

  const getListHeader = () => {
    if (currentFilter.type === "CARD") return currentFilter.value;
    const cat = CATEGORIES_LIST.find((c) => c.id === currentFilter.value);
    return cat ? cat.name : "All";
  };

  const filteredTasks = tasks.filter((task) => {
    if (
      searchQuery &&
      !task.text.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    if (currentFilter.type === "CARD") {
      switch (currentFilter.value) {
        case "All":
          return !task.deleted;
        case "Important":
          return task.important && !task.deleted;
        case "Completed":
          return task.completed && !task.deleted;
        case "Deleted":
          return task.deleted;
        default:
          return true;
      }
    } else if (currentFilter.type === "CATEGORY") {
      return task.categoryId === currentFilter.value && !task.deleted;
    }

    return true;
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f3f4f6" }}>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Sidebar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
            tasks={tasks}
            categoriesList={CATEGORIES_LIST}
          />

          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              p: { xs: 3, md: 4, lg: 5 },
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Task Header & Task List sẽ được handle trong TaskList */}
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, color: "#111827" }}
              >
                {getListHeader()}
              </Typography>

              <TaskInput
                newTaskText={newTaskText}
                setNewTaskText={setNewTaskText}
                onAddTask={handleAddTask}
                visible={currentFilter.value !== "Deleted"}
              />

              <TaskList
                filteredTasks={filteredTasks}
                listHeader=""
                isDeletedFilter={currentFilter.value === "Deleted"}
                onOpenDetails={handleOpenTaskDetails}
                onToggleComplete={handleToggleComplete}
                onToggleImportant={handleToggleImportant}
                onRestoreTask={handleRestoreTask}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <TaskDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        task={selectedTask}
        onChangeTask={setSelectedTask}
        onSave={handleSaveSelectedTask}
        onDeleteRequest={handleOpenDeleteConfirm}
        categoriesList={CATEGORIES_LIST}
      />

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onClose={handleCloseDeleteConfirm}
        onConfirm={handleConfirmDelete}
      />
    </ThemeProvider>
  );
}
