import { Controller, Get, Render, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { AppService } from 'src/services/app.service';

@Controller()
export class IndexController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  index() {
    return {
      title: 'Lista de tareas'
    };
  }

  //@UseGuards(AuthGuard)
  @Get('tareas')
  @Render('tasks')
  tasks() {
    return {
      title: 'Lista de tareas'
    };
  }
}
