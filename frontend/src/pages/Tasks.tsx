import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  ExitToApp as LogoutIcon,
  Assessment as StatsIcon,
} from "@mui/icons-material";
import { tasksService, Task, TaskStats } from "../services/tasksService";
import { authService } from "../services/authService";
import { useAuthStore } from "../stores/useAuthStore";
import { TaskCard } from "../components/TaskCard";
import { TaskDialog } from "../components/TaskDialog";
import { StatsCard } from "../components/StatsCard";
import { toast } from "react-toastify";

export function Tasks() {
  const { user, setUser, logout } = useAuthStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    loadUserAndTasks();
  }, []);

  const loadUserAndTasks = async () => {
    try {
      setIsLoading(true);
      const [userData, tasksData, statsData] = await Promise.all([
        authService.getCurrentUser(),
        tasksService.getTasks(),
        tasksService.getStats(),
      ]);
      setUser(userData);
      setTasks(tasksData);
      setStats(statsData);
    } catch (error: any) {
      toast.error("Error loading data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await tasksService.deleteTask(id);
        setTasks(tasks.filter((t) => t._id !== id));
        toast.success("Task deleted successfully!");
        loadUserAndTasks();
      } catch (error) {
        toast.error("Error deleting task");
      }
    }
  };

  const handleMarkAsDone = async (id: string) => {
    try {
      const updatedTask = await tasksService.markAsDone(id);
      setTasks(tasks.map((t) => (t._id === id ? updatedTask : t)));
      toast.success("Task marked as completed!");
      loadUserAndTasks();
    } catch (error) {
      toast.error("Error marking task as completed");
    }
  };

  const handleSaveTask = async () => {
    setIsDialogOpen(false);
    await loadUserAndTasks();
  };

  const handleLogout = () => {
    logout();
    authService.logout();
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TaskFlow - {user?.name}
          </Typography>
          <IconButton color="inherit" onClick={() => setShowStats(!showStats)}>
            <StatsIcon />
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {showStats && stats && <StatsCard stats={stats} />}

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" component="h1">
            My Tasks
            <Chip
              label={`${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`}
              color="primary"
              size="small"
              sx={{ ml: 2 }}
            />
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateTask}
            size="large"
          >
            New Task
          </Button>
        </Box>

        {tasks.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              No tasks found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Click "New Task" to get started
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {tasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task._id}>
                <TaskCard
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onMarkAsDone={handleMarkAsDone}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <TaskDialog
        open={isDialogOpen}
        task={selectedTask}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveTask}
      />
    </>
  );
}
