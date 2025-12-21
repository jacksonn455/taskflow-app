export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export interface Task {
  _id?: any;
  title: string;
  description?: string;
  status: TaskStatus;
  userId: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}
