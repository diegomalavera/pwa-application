import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async getUserById(userId: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async findAllByUser(userId: number): Promise<Task[]> {
    return this.taskRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' }
    });
  }

  async createTask(userId: number, payload: Partial<Task>): Promise<Task> {
    const user = await this.getUserById(userId);
    const task = this.taskRepository.create({
      title: payload.title,
      description: payload.description || '',
      priority: payload.priority || 'medium',
      completed: false,
      dueDate: payload.dueDate,
      user: user as User
    });
    return this.taskRepository.save(task);
  }

  async updateTask(userId: number, taskId: number, payload: Partial<Task>): Promise<Task | null> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, user: { id: userId } }
    });
    if (!task) {
      return null;
    }
    Object.assign(task, {
      title: payload.title ?? task.title,
      description: payload.description ?? task.description,
      priority: payload.priority ?? task.priority,
      dueDate: payload.dueDate ?? task.dueDate,
      completed: payload.completed ?? task.completed
    });
    return this.taskRepository.save(task);
  }

  async deleteTask(userId: number, taskId: number): Promise<boolean> {
    const result = await this.taskRepository.delete({ id: taskId, userId });
    return (result.affected ?? 0) > 0;
  }
}
