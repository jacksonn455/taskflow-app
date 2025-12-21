import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTaskDto: CreateTaskDto, @Req() req: any) {
    return this.tasksService.create(createTaskDto, req.user.sub);
  }

  @Get()
  async findAll(@Req() req: any) {
    return this.tasksService.findAll(req.user.sub);
  }

  @Get('stats')
  async getStats(@Req() req: any) {
    return this.tasksService.getStats(req.user.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    return this.tasksService.findOne(id, req.user.sub);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: any,
  ) {
    return this.tasksService.update(id, updateTaskDto, req.user.sub);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Req() req: any) {
    await this.tasksService.remove(id, req.user.sub);
  }

  @Post(':id/mark-done')
  async markAsDone(@Param('id') id: string, @Req() req: any) {
    return this.tasksService.markAsDone(id, req.user.sub);
  }
}
