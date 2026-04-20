import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TasksService } from 'src/services/tasks.service';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import type { Request } from 'express';

@Controller('api/tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  private async getCurrentUser(req: Request): Promise<User | null> {
    const userSession = (req.session as any)?.user;
    if (!userSession?.id) {
      return null;
    }
    return this.userRepository.findOne({ where: { id: userSession.id } });
  }

  @Get()
  async findAll(@Req() req: Request) {
    const user = await this.getCurrentUser(req);
    if (!user) {
      return { success: false, message: 'No autorizado' };
    }
    const tasks = await this.tasksService.findAllByUser(user.id);
    return { success: true, tasks };
  }

  @Post()
  async create(@Req() req: Request, @Body() body: { title: string; priority?: string; description?: string; dueDate?: string }) {
    const user = await this.getCurrentUser(req);
    if (!user) {
      return { success: false, message: 'No autorizado' };
    }
    if (!body.title) {
      return { success: false, message: 'El título es requerido' };
    }
    const task = await this.tasksService.createTask(user.id, body as Partial<Task>);
    return { success: true, task };
  }

  @Put(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() body: { title?: string; priority?: string; description?: string; dueDate?: string; completed?: boolean }
  ) {
    const user = await this.getCurrentUser(req);
    if (!user) {
      return { success: false, message: 'No autorizado' };
    }
    const task = await this.tasksService.updateTask(user.id, id, body as Partial<Task>);
    if (!task) {
      return { success: false, message: 'Tarea no encontrada' };
    }
    return { success: true, task };
  }

  @Patch(':id')
  async patch(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() body: { completed?: boolean }
  ) {
    const user = await this.getCurrentUser(req);
    if (!user) {
      return { success: false, message: 'No autorizado' };
    }
    const task = await this.tasksService.updateTask(user.id, id, { completed: body.completed } as Partial<Task>);
    if (!task) {
      return { success: false, message: 'Tarea no encontrada' };
    }
    return { success: true, task };
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: number) {
    const user = await this.getCurrentUser(req);
    if (!user) {
      return { success: false, message: 'No autorizado' };
    }
    const deleted = await this.tasksService.deleteTask(user.id, id);
    return { success: deleted, message: deleted ? 'Tarea eliminada' : 'Tarea no encontrada' };
  }
}
