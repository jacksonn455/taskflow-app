import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(100, { message: 'Title must be at most 100 characters long' })
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, {
    message: 'Description must be at most 500 characters long',
  })
  description?: string;

  @IsEnum(TaskStatus, { message: 'Invalid status' })
  @IsOptional()
  status?: TaskStatus;

  @IsDateString({}, { message: 'Invalid date' })
  @IsOptional()
  dueDate?: string;
}
