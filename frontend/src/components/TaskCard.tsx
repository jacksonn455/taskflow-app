import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Box,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";
import { Task, TaskStatus } from "../services/tasksService";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMarkAsDone: (id: string) => void;
}

const statusConfig = {
  [TaskStatus.PENDING]: { label: "Pending", color: "warning" as const },
  [TaskStatus.IN_PROGRESS]: { label: "In Progress", color: "info" as const },
  [TaskStatus.DONE]: { label: "Completed", color: "success" as const },
};

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onMarkAsDone,
}: TaskCardProps) {
  const statusInfo = statusConfig[task.status];
  const isDone = task.status === TaskStatus.DONE;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        opacity: isDone ? 0.8 : 1,
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={1}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{
              textDecoration: isDone ? "line-through" : "none",
              wordBreak: "break-word",
            }}
          >
            {task.title}
          </Typography>
          <Chip
            label={statusInfo.label}
            color={statusInfo.color}
            size="small"
          />
        </Box>

        {task.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, mb: 2 }}
          >
            {task.description}
          </Typography>
        )}

        <Box>
          <Typography variant="caption" color="text.secondary" display="block">
            Created at:{" "}
            {format(new Date(task.createdAt), "MM/dd/yyyy HH:mm", {
              locale: enUS,
            })}
          </Typography>

          {task.dueDate && (
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Due date:{" "}
              {format(new Date(task.dueDate), "MM/dd/yyyy", { locale: enUS })}
            </Typography>
          )}

          {task.completedAt && (
            <Typography variant="caption" color="success.main" display="block">
              ✅ Completed at:{" "}
              {format(new Date(task.completedAt), "MM/dd/yyyy HH:mm", {
                locale: enUS,
              })}
            </Typography>
          )}
        </Box>
      </CardContent>

      <CardActions>
        {!isDone && (
          <Tooltip title="Mark as completed">
            <IconButton
              size="small"
              color="success"
              onClick={() => onMarkAsDone(task._id)}
            >
              <CheckIcon />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Edit">
          <IconButton size="small" color="primary" onClick={() => onEdit(task)}>
            <EditIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete">
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(task._id)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}
