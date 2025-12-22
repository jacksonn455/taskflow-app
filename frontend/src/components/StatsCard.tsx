import { Paper, Grid, Box, Typography } from "@mui/material";
import {
  Assignment as TotalIcon,
  HourglassEmpty as PendingIcon,
  TrendingUp as InProgressIcon,
  CheckCircle as DoneIcon,
} from "@mui/icons-material";
import { TaskStats } from "../services/tasksService";


interface StatsCardProps {
  stats: TaskStats;
}

export function StatsCard({ stats }: StatsCardProps) {
  const statsData = [
    {
      label: "Total",
      value: stats.total,
      icon: <TotalIcon fontSize="large" />,
      color: "#1976d2",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: <PendingIcon fontSize="large" />,
      color: "#ed6c02",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: <InProgressIcon fontSize="large" />,
      color: "#0288d1",
    },
    {
      label: "Completed",
      value: stats.done,
      icon: <DoneIcon fontSize="large" />,
      color: "#2e7d32",
    },
  ];

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Statistics
      </Typography>
      <Grid container spacing={3}>
        {statsData.map((stat) => (
          <Grid item xs={6} sm={3} key={stat.label}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 2,
                backgroundColor: `${stat.color}10`,
                borderRadius: 2,
              }}
            >
              <Box sx={{ color: stat.color, mb: 1 }}>{stat.icon}</Box>
              <Typography
                variant="h4"
                sx={{ color: stat.color, fontWeight: "bold" }}
              >
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
