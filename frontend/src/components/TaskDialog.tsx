import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { Task } from "../services/tasksService";
import { tasksService } from "../services/tasksService";
import { toast } from "react-toastify";

interface TaskDialogProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: () => void;
}

export function TaskDialog({
  open,
  task,
  onClose,
  onSave,
}: TaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [task]);

  const handleSubmit = async () => {
    try {
      if (!title.trim()) {
        toast.error("Title is required");
        return;
      }

      if (task) {
        await tasksService.updateTask(task._id, {
          title,
          description,
        });
        toast.success("Task updated successfully!");
      } else {
        await tasksService.createTask({
          title,
          description,
        });
        toast.success("Task created successfully!");
      }

      onSave();
    } catch (error) {
      toast.error("Error saving task");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {task ? "Edit Task" : "New Task"}
      </DialogTitle>

      <DialogContent>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextField
          label="Description"
          fullWidth
          margin="normal"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
